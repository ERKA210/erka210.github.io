import { uuidRe } from "./validation.js";

export async function ensureCustomerUser(client, { id, name, phone, studentId }) {
  if (!id || !uuidRe.test(String(id))) {
    throw new Error("customerId must be UUID");
  }

  const fullName = (name || "Зочин хэрэглэгч").trim() || "Зочин хэрэглэгч";
  const phoneSafe = (phone || "00000000").trim() || "00000000";
  const studentSafe = (studentId || "").trim();
  const studentValue = studentSafe ? studentSafe : null;

  const existing = await client.query(
    `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
    [phoneSafe]
  );
  if (existing.rows.length) {
    const existingId = existing.rows[0].id;
    await client.query(
      `UPDATE users
         SET full_name = $2,
             student_id = COALESCE($3::text, student_id)
       WHERE id = $1`,
      [existingId, fullName, studentValue]
    );
    return existingId;
  }

  await client.query(
    `INSERT INTO users (id, full_name, phone, student_id, role)
     VALUES ($1,$2,$3,$4,'customer')
     ON CONFLICT (id) DO UPDATE
       SET full_name = EXCLUDED.full_name,
           phone = CASE WHEN EXCLUDED.phone <> '' THEN EXCLUDED.phone ELSE users.phone END,
           student_id = COALESCE(EXCLUDED.student_id, users.student_id)`,
    [id, fullName, phoneSafe, studentValue]
  );

  return id;
}
