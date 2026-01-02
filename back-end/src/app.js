import express from "express";
import cors from "cors";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import router from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.locals.cspNonce = nonce;
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self' http://localhost:3000",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
app.use(express.json());
app.use(express.static("front-end", { index: false }));

app.get("/", (req, res) => {
  const nonce = res.locals.cspNonce || "";
  const indexPath = path.join("front-end", "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  html = html.replaceAll("__CSP_NONCE__", nonce);
  res.type("html").send(html);
});
app.get("/index.html", (_req, res) => {
  const nonce = res.locals.cspNonce || "";
  const indexPath = path.join("front-end", "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  html = html.replaceAll("__CSP_NONCE__", nonce);
  res.type("html").send(html);
});

app.use("/api", router);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

export { app };
