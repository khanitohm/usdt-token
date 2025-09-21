const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://[::]:8080'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const pricePath = process.env.PRICE_FEED_PATH || path.join(__dirname, "../config/price_feed.json");

app.get("/price", (req, res) => {
  try {
    const raw = fs.readFileSync(pricePath, "utf8");
    const priceData = JSON.parse(raw);
    res.json({
      symbol: priceData.symbol || "USDTz",
      price: Number(priceData.priceUSD ?? 1),
      currency: "USD",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("/price error:", err.message);
    res.status(500).json({ error: "Failed to read price", details: String(err) });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, pricePath });
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "127.0.0.1";

const server = app.listen(PORT, HOST, () => {
  console.log(`Mock Price Feed running on http://${HOST}:${PORT}/price`);
  console.log(`Using price file: ${pricePath}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
