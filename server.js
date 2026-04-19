console.log("🚀 Starting server...");

require("dotenv").config();

console.log("ENV KEY:", process.env.RAZORPAY_KEY_ID);

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payment", paymentRoutes);

console.log("✅ Routes loaded");

app.get("/", (req, res) => {
  res.send("Music Backend Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});