import { verifyJwt } from "./jwt.js";
import { getCookie } from "./cookies.js";

const jwtSecret = process.env.JWT_SECRET;

export function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const headerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length).trim()
      : "";

    const token = headerToken || getCookie(req, "auth_token");
    if (!token) {
      const err = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    const payload = verifyJwt(token, jwtSecret);
    req.user = payload;
    next();
  } catch (e) {
    const err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
}