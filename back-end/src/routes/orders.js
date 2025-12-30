import { Router } from "express";
import { pool } from "../db.js";
import { ensureCustomerUser } from "../utils/customer.js";
import { sanitizeText } from "../utils/sanitize.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();

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
      `INSERT INTO orders (customer_id, from_place_id, to_place_id, scheduled_at, subtotal_amount, delivery_fee, total_amount, note)
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
        o.created_at,
        fp.name AS from_name,
        tp.name AS to_name,
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
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN order_couriers oc ON oc.order_id = o.id
      LEFT JOIN users cu ON cu.id = oc.courier_id
      ${customerId ? "WHERE o.customer_id = $1" : ""}
      GROUP BY o.id, fp.name, tp.name, cu.id, cu.full_name, cu.phone, cu.student_id, cu.avatar_url
      ORDER BY o.created_at DESC
    `;

    const r = await pool.query(q, customerId ? [customerId] : []);
    res.json(r.rows);
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

    res.json({ order: detail.rows[0] });
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
