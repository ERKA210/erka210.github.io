import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 55432),
  user: process.env.PGUSER ?? "numd_admin",
  password: process.env.PGPASSWORD ?? "qwer1234",
  database: process.env.PGDATABASE ?? "numdelivery",
});
