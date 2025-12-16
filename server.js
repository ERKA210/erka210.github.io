import express from 'express';
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());
app.use(express.static('front-end'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 55432),
  user: process.env.PGUSER ?? "numd_admin",
  password: process.env.PGPASSWORD ?? "qwer1234",
  database: process.env.PGDATABASE ?? "numdelivery",
});

app.get("/health", async (req, res) => {
  const r = await pool.query("select now() as now");
  res.json({ ok: true, db_time: r.rows[0].now });
});

app.get("/api/from-places", async (req, res) => {
  const r = await pool.query(
    `SELECT id, kind, name
     FROM places
     WHERE is_active=true AND kind IN ('store','restaurant','other')
     ORDER BY name`
  );
  res.json(r.rows);
});

app.get("/api/to-places", async (req, res) => {
  const r = await pool.query(
    `SELECT id, name
     FROM places
     WHERE is_active=true AND kind='campus'
     ORDER BY name`
  );
  res.json(r.rows);
});

app.get("/api/menus/:placeId", async (req, res) => {
  const { placeId } = req.params;

  // UUID шалгах (placeId=1 гэх мэт бол шууд 400)
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(placeId);

  if (!isUuid) {
    return res.status(400).json({ error: "placeId must be UUID" });
  }

  const r = await pool.query(
    `SELECT m.menu_json
     FROM menus m
     WHERE m.place_id = $1`,
    [placeId]
  );

  res.json(r.rows[0] ?? { menu_json: [] });
});

app.get("/api/courier/me", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT u.id, u.full_name AS name, u.phone, u.student_id
      FROM couriers c
      JOIN users u ON u.id = c.user_id
      WHERE c.is_active = true
      ORDER BY c.created_at ASC
      LIMIT 1
    `);

    res.json(r.rows[0] || null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// app.get('/api/orders', (req, res) => {
//   res.json([
//     { thumb: 'assets/img/box.svg', 
//       title: 'GL burger - 7-р байр 207', 
//       meta: '11/21/25 • 14:00', 
//       price: '10,000₮', 
//       sub: [
//       { name: "Бууз", price: "5000₮" },
//       { name: "Сүү", price: "2000₮" },] },
//       { thumb: 'assets/img/document.svg', 
//       title: 'GL burger - 7-р байр 207', 
//       meta: '11/21/25 • 14:00', 
//       price: '10,000₮', 
//       sub: [
//       { name: "Бууз", price: "5000₮" },
//       { name: "Сүү", price: "2000₮" },] },
//       { thumb: 'assets/img/tor.svg', 
//       title: 'GL burger - 7-р байр 207', 
//       meta: '11/21/25 • 14:00', 
//       price: '10,000₮', 
//       sub: [
//       { name: "Бууз", price: "5000₮" },
//       { name: "Сүү", price: "2000₮" },] },
//       { thumb: 'assets/img/tor.svg', 
//       title: 'GL burger - 7-р байр 207', 
//       meta: '11/21/25 • 14:00', 
//       price: '10,000₮', 
//       sub: [
//       { name: "Бууз", price: "5000₮" },
//       { name: "Сүү", price: "2000₮" },] },
//   ]);
// })

// app.get('/api/products', (req, res) => {
//   res.json([
//     { id: 1, name: "Кимбаб", price: 5000 },
//     { id: 2, name: "Бургер", price: 8000 },
//     { id: 3, name: "Бууз", price: 6000 },
//     { id: 4, name: "Салад", price: 7000 },
//     { id: 5, name: "Кола 0.5л", price: 2000 },
//     { id: 6, name: "Хар цай", price: 1500 },
//     { id: 7, name: "Кофе", price: 3000 },
//     { id: 8, name: "Жүүс 0.33л", price: 2500 },
//   ]);
// })


app.post("/api/orders", async (req, res) => {
  const client = await pool.connect();
  try {
    const { customerId, fromPlaceId, toPlaceId, scheduledAt, items = [], deliveryFee = 0, note } = req.body;

    const subtotal = items.reduce((s, it) => s + (it.unitPrice * it.qty), 0);
    const total = subtotal + deliveryFee;

    await client.query("BEGIN");

    const orderR = await client.query(
      `INSERT INTO orders (customer_id, from_place_id, to_place_id, scheduled_at, subtotal_amount, delivery_fee, total_amount, note)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [customerId, fromPlaceId, toPlaceId, scheduledAt ?? null, subtotal, deliveryFee, total, note ?? null]
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
    res.status(201).json({ orderId, subtotal, deliveryFee, total });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

app.get("/api/orders", async (req, res) => {
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

app.post("/api/orders/:id/pay", async (req, res) => {
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

app.post("/api/orders/:id/review", async (req, res) => {
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
