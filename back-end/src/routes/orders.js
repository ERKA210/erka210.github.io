import { Router } from "express";
import { pool } from "../db.js";
import { ensureCustomerUser } from "../utils/customer.js";
import { sanitizeText } from "../utils/sanitize.js";
import { requireAuth } from "../utils/auth.js";
import { broadcastOrderEvent, registerSseClient, removeSseClient } from "../utils/sse.js";

const router = Router();

router.get("/orders/stream", requireAuth, (req, res) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (res.flushHeaders) res.flushHeaders();

  const clientId = registerSseClient(res, {
    userId,
    role: req.user?.role || "",
  });

  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeSseClient(clientId);
  });
});

router.post("/orders", async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      customerId,
      fromPlaceId,
      toPlaceId,
      scheduledAt,
      items = [],
      deliveryFee = 0,
      note,
      customerName,
      customerPhone,
      customerStudentId,
    } = req.body;

    const resolvedCustomerId = await ensureCustomerUser(client, {
      id: customerId,
      name: sanitizeText(customerName || "Зочин хэрэглэгч", { maxLen: 80 }),
      phone: customerPhone || "00000000",
      studentId: sanitizeText(customerStudentId || "", { maxLen: 32 }),
    });

    const sanitizedItems = items.map((it) => ({
      ...it,
      name: sanitizeText(it?.name || "", { maxLen: 120 }),
      menuItemKey: sanitizeText(it?.menuItemKey || "", { maxLen: 120 }),
    }));
    const subtotal = sanitizedItems.reduce((s, it) => s + it.unitPrice * it.qty, 0);
    const total = subtotal + deliveryFee;

    await client.query("BEGIN");

    const orderR = await client.query(
      `INSERT INTO orders (
         customer_id,
         from_place_id,
         to_place_id,
         scheduled_at,
         subtotal_amount,
         delivery_fee,
         total_amount,
         note
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        resolvedCustomerId,
        fromPlaceId,
        toPlaceId,
        scheduledAt ?? null,
        subtotal,
        deliveryFee,
        total,
        sanitizeText(note || "", { maxLen: 500 }),
      ]
    );

    const orderId = orderR.rows[0].id;

    for (const it of sanitizedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_key, name, unit_price, qty, item_snapshot_json)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          orderId,
          it.menuItemKey ?? null,
          it.name,
          it.unitPrice,
          it.qty,
          it.options ?? {},
        ]
      );
    }

    await client.query(
      `INSERT INTO order_status_history (order_id, status, note)
       VALUES ($1,'created','Order created')`,
      [orderId]
    );

    await client.query("COMMIT");
    res.status(201).json({ orderId, subtotal, deliveryFee, total, customerId: resolvedCustomerId });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

router.get("/orders", async (req, res) => {
  try {
    const { customerId } = req.query;

    const q = `
      SELECT
        o.id,
        o.status,
        o.total_amount,
        o.scheduled_at,
        o.created_at,
        fp.name AS from_name,
        tp.name AS to_name,
        json_build_object(
          'id', c.id,
          'name', c.full_name,
          'phone', c.phone,
          'student_id', c.student_id,
          'avatar', c.avatar_url
        ) AS customer,
        CASE WHEN cu.id IS NULL THEN NULL ELSE json_build_object(
          'id', cu.id,
          'name', cu.full_name,
          'phone', cu.phone,
          'student_id', cu.student_id,
          'avatar', cu.avatar_url
        ) END AS courier,
        COALESCE(
          json_agg(
            json_build_object(
              'name', oi.name,
              'qty', oi.qty
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      JOIN places fp ON fp.id = o.from_place_id
      JOIN places tp ON tp.id = o.to_place_id
      JOIN users c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN order_couriers oc ON oc.order_id = o.id
      LEFT JOIN users cu ON cu.id = oc.courier_id
      ${customerId ? "WHERE o.customer_id = $1" : ""}
      GROUP BY o.id, fp.name, tp.name, c.id, c.full_name, c.phone, c.student_id, c.avatar_url,
               cu.id, cu.full_name, cu.phone, cu.student_id, cu.avatar_url
      ORDER BY o.created_at DESC
    `;

    const r = await pool.query(q, customerId ? [customerId] : []);
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/orders/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const meta = await pool.query(
      `SELECT o.customer_id, o.status, oc.courier_id
         FROM orders o
         LEFT JOIN order_couriers oc ON oc.order_id = o.id
        WHERE o.id = $1`,
      [id]
    );
    if (!meta.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { customer_id: customerId, status, courier_id: courierId } = meta.rows[0];
    if (req.user?.role !== "admin" && String(customerId) !== String(userId)) {
      return res.status(403).json({ error: "Forbidden: owner only" });
    }

    const normalizedStatus = String(status || "").toLowerCase();
    if (normalizedStatus === "delivered") {
      return res.status(400).json({ error: "Delivered orders cannot be cancelled" });
    }

    if (normalizedStatus !== "cancelled") {
      await pool.query(
        `UPDATE orders
            SET status = 'cancelled',
                updated_at = now()
          WHERE id = $1`,
        [id]
      );
      await pool.query(
        `INSERT INTO order_status_history (order_id, status, note)
         VALUES ($1,'cancelled','Order cancelled by customer')`,
        [id]
      );
    }

    broadcastOrderEvent({
      event: "order-status",
      orderId: id,
      status: "cancelled",
      courierId,
      customerId,
    });

    res.json({ ok: true, status: "cancelled" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/orders/history/customer", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (req.user?.role !== "customer") {
      return res.status(403).json({ error: "Forbidden: customer only" });
    }

    const r = await pool.query(
      `SELECT o.id,
              o.status,
              o.total_amount,
              o.scheduled_at,
              o.created_at,
              fp.name AS from_name,
              tp.name AS to_name
         FROM orders o
         JOIN places fp ON fp.id = o.from_place_id
         JOIN places tp ON tp.id = o.to_place_id
        WHERE o.customer_id = $1
        ORDER BY o.created_at DESC`,
      [userId]
    );
    res.json({ items: r.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/orders/history/courier", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (req.user?.role !== "courier") {
      return res.status(403).json({ error: "Forbidden: courier only" });
    }

    const r = await pool.query(
      `SELECT o.id,
              o.status,
              o.total_amount,
              o.scheduled_at,
              o.created_at,
              fp.name AS from_name,
              tp.name AS to_name
         FROM orders o
         JOIN places fp ON fp.id = o.from_place_id
         JOIN places tp ON tp.id = o.to_place_id
         JOIN order_couriers oc ON oc.order_id = o.id
        WHERE oc.courier_id = $1
        ORDER BY o.created_at DESC`,
      [userId]
    );
    res.json({ items: r.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/orders/:id/assign-courier", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (req.user?.role !== "courier") {
    return res.status(403).json({ error: "Forbidden: courier only" });
  }

  try {
    const orderRow = await pool.query(
      `SELECT customer_id FROM orders WHERE id = $1`,
      [id]
    );
    if (!orderRow.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (String(orderRow.rows[0]?.customer_id) === String(userId)) {
      return res.status(403).json({ error: "Forbidden: self delivery" });
    }

    await pool.query(
      `INSERT INTO order_couriers (order_id, courier_id)
       VALUES ($1, $2)
       ON CONFLICT (order_id) DO UPDATE
         SET courier_id = EXCLUDED.courier_id,
             assigned_at = now()`,
      [id, userId]
    );

    const detail = await pool.query(
      `SELECT o.id,
              o.created_at,
              o.customer_id,
              fp.name AS from_name,
              tp.name AS to_name,
              json_build_object(
                'name', cu.full_name,
                'phone', cu.phone,
                'studentId', cu.student_id,
                'avatar', cu.avatar_url
              ) AS customer
         FROM orders o
         JOIN places fp ON fp.id = o.from_place_id
         JOIN places tp ON tp.id = o.to_place_id
         JOIN users cu ON cu.id = o.customer_id
        WHERE o.id = $1
        LIMIT 1`,
      [id]
    );
    if (!detail.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    broadcastOrderEvent({
      event: "order-updated",
      orderId: id,
      courierId: userId,
      customerId: detail.rows[0]?.customer_id || null,
    });

    res.json({ order: detail.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/orders/:id/status", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (req.user?.role !== "courier") {
    return res.status(403).json({ error: "Forbidden: courier only" });
  }

  const status = String(req.body?.status || "").toLowerCase();
  const allowed = new Set(["created", "on_the_way", "on-the-way", "delivered"]);
  if (!allowed.has(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const normalizedStatus = status === "on-the-way" ? "on_the_way" : status;

  try {
    const meta = await pool.query(
      `SELECT o.customer_id, oc.courier_id
         FROM orders o
         LEFT JOIN order_couriers oc ON oc.order_id = o.id
        WHERE o.id = $1`,
      [id]
    );
    if (!meta.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }
    const { customer_id: customerId, courier_id: courierId } = meta.rows[0];
    if (!courierId || courierId !== userId) {
      return res.status(403).json({ error: "Forbidden: not assigned courier" });
    }

    await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2`,
      [normalizedStatus, id]
    );
    await pool.query(
      `INSERT INTO order_status_history (order_id, status, note)
       VALUES ($1,$2,$3)`,
      [id, normalizedStatus, "Courier status update"]
    );

    broadcastOrderEvent({
      event: "order-status",
      orderId: id,
      status: normalizedStatus,
      courierId,
      customerId,
    });

    res.json({ ok: true, status: normalizedStatus });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/orders/:id/pay", async (req, res) => {
  const { id } = req.params;
  const { amount, method } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO payments (order_id, amount, method, status, paid_at)
       VALUES ($1,$2,$3,'paid',now())`,
      [id, amount, method]
    );
    await client.query(
      `UPDATE orders SET status='delivered', total_amount=$1 WHERE id=$2`,
      [amount, id]
    );
    await client.query(
      `INSERT INTO order_status_history (order_id, status, note)
       VALUES ($1,'delivered','Paid and delivered')`,
      [id]
    );
    await client.query("COMMIT");
    const meta = await pool.query(
      `SELECT o.customer_id, oc.courier_id
         FROM orders o
         LEFT JOIN order_couriers oc ON oc.order_id = o.id
        WHERE o.id = $1`,
      [id]
    );
    const customerId = meta.rows[0]?.customer_id || null;
    const courierId = meta.rows[0]?.courier_id || null;
    broadcastOrderEvent({
      event: "order-status",
      orderId: id,
      status: "delivered",
      courierId,
      customerId,
    });
    res.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

router.post("/orders/:id/review", async (req, res) => {
  const { id } = req.params;
    const { customerId, courierId, rating, comment } = req.body;
    try {
      await pool.query(
        `INSERT INTO reviews (order_id, customer_id, courier_id, rating, comment)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (order_id) DO UPDATE
           SET rating = EXCLUDED.rating,
               comment = EXCLUDED.comment,
               courier_id = EXCLUDED.courier_id`,
        [id, customerId, courierId ?? null, rating, sanitizeText(comment || "", { maxLen: 1000 })]
      );
      res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
