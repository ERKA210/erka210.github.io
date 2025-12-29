import express from "express";
import cors from "cors";
import path from "path";
import router from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.static("front-end"));

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

export { app };
