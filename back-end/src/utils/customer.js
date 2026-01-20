import { assertUuid } from "./validation.js";

export async function ensureCustomerUser(client, { id, name, phone, studentId }) {
  assertUuid(id, "customerId must be UUID");

  const phoneNumber = String(phone || "").trim();
  if (!phoneNumber) {
    const err = new Error("phone is required");
    err.status = 400;
    throw err;
  }


  const fullName = String(name || "").trim();
  if (!fullName) {
    const err = new Error("name is required");
    err.status = 400;
    throw err;
  }


  const studentID = String(studentId || "").trim();
  if (!studentID) {
    const err = new Error("studentId is required");
    err.status = 400;
    throw err;
  }


  const existing = await client.query(
    "SELECT id FROM users WHERE phone = $1 LIMIT 1",
    [phoneNumber]
  );

  if (existing.rows.length) {
    return existing.rows[0].id;
  }

  await client.query(
    `INSERT INTO users (id, full_name, phone, student_id, role)
     VALUES ($1, $2, $3, $4, 'customer')`,
    [id, fullName, phoneNumber, studentID]
  );

  return id;
}
