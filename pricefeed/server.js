const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

app.get("/price", (req, res) => {
  const priceData = JSON.parse(fs.readFileSync(path.join(__dirname, "../price_feed.json"), "utf8"));
  res.json({
    symbol: priceData.symbol,
    price: priceData.priceUSD,
    currency: "USD",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock Price Feed running on http://localhost:${PORT}/price`);
});
