import express from "express";
import cors from "cors";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import router from "./routes/index.js";

const app = express();

app.use(express.json());
// app.use(express.static("front-end"));


app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  // console.log("nonce irj bgg shalgj bn ==== ", nonce);
  res.locals.cspNonce = nonce;

  
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  next();
});

app.use(express.static("front-end", { index: false }));

function sendIndexHtml(req, res) {
  const nonce = res.locals.cspNonce || "";
  const indexPath = path.join("front-end", "index.html");

  // index.html уншина
  let html = fs.readFileSync(indexPath, "utf8");

  // __CSP_NONCE__ гэдгийг бодит nonce-р сольж өгнө
  html = html.replaceAll("__CSP_NONCE__", nonce);

  // HTML гэж хэлээд буцаана
  res.type("html").send(html);
}

app.get("/", sendIndexHtml);
app.get("/index.html", sendIndexHtml);

app.use("/api", router);


function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ error: message });
}

app.use(errorHandler);

export { app };
