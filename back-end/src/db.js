import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  host: "127.0.0.1",
  port: 55432,
  user: "numd_admin",
  password: "qwer1234",
  database: "numdelivery",
});
