if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

console.log("🔥 SERVER STARTED");

/// 🔑 Razorpay config (ENV से आएगा)
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log("❌ ENV variables missing");
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/// 🔥 CREATE ORDER
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("🟢 Order Created:", order.id);

    res.json(order);
  } catch (error) {
    console.log("❌ Order Error:", error);
    res.status(500).send("Error creating order");
  }
});

/// 🔥 VERIFY PAYMENT
app.post("/verify-payment", (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    const generated_signature = crypto
     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generated_signature === signature) {
      console.log("✅ PAYMENT VERIFIED");
      res.json({ success: true });
    } else {
      console.log("❌ PAYMENT FAILED");
      res.json({ success: false });
    }
  } catch (error) {
    console.log("❌ Verify Error:", error);
    res.status(500).send("Verification error");
  }
});

/// TEST
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
