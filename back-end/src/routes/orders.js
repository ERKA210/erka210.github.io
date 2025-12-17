import { Router } from "express";
import { pool } from "../db.js";
import { ensureCustomerUser } from "../utils/customer.js";

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
      name: customerName || "Зочин хэрэглэгч",
      phone: customerPhone || "00000000",
      studentId: customerStudentId || "",
    });

    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
    const total = subtotal + deliveryFee;

    await client.query("BEGIN");

    const orderR = await client.query(
      `INSERT INTO orders (customer_id, from_place_id, to_place_id, scheduled_at, subtotal_amount, delivery_fee, total_amount, note)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [resolvedCustomerId, fromPlaceId, toPlaceId, scheduledAt ?? null, subtotal, deliveryFee, total, note ?? null]
    );

    const orderId = orderR.rows[0].id;

    for (const it of items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_key, name, unit_price, qty, item_snapshot_json)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [orderId, it.menuItemKey ?? null, it.name, it.unitPrice, it.qty, it.options ?? {}]
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
      ${customerId ? "WHERE o.customer_id = $1" : ""}
      GROUP BY o.id, fp.name, tp.name
      ORDER BY o.created_at DESC
    `;

    const r = await pool.query(q, customerId ? [customerId] : []);
    res.json(r.rows);
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
      [id, customerId, courierId ?? null, rating, comment ?? null]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
