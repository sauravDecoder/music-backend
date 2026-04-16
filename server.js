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

/// 🔑 Razorpay config
const razorpay = new Razorpay({
  key_id: "rzp_live_SeFcV9f35r5NIF",
  key_secret: "tFyFl3l7JKMJJp1LbdZVBfQv",
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
      .createHmac("sha256", "PPdhQ1Wwrb2cDFrTatdjho2Y") // 🔥 SAME SECRET
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
