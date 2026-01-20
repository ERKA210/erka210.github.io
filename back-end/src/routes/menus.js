import { Router } from "express";
import { pool } from "../db.js";
import { assertUuid } from "../utils/validation.js";

const router = Router();

router.get("/menus/:placeId", async (req, res) => {
  const { placeId } = req.params;

  assertUuid(placeId, "placeId must be UUID");

  const r = await pool.query(
    `SELECT m.menu_json
     FROM menus m
     WHERE m.place_id = $1`,
    [placeId]
  );

  res.json(r.rows[0] ?? { menu_json: [] });
});

export default router;
