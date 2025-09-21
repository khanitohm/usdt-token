const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/price", (req, res) => {
  res.json({
    symbol: "USDTz",
    price: 0.97087,
    currency: "USD",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock Price Feed running on http://localhost:${PORT}/price`);
});
