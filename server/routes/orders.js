const router = require('express').Router();
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
// GET /api/orders — admin gets all
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/vendor/:vendorId
router.get('/vendor/:vendorId', protect, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.vendorId': req.params.vendorId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/track/:orderId
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders
router.post('/', protect, async (req, res) => {
  console.log("BODY:", req.body);
  try {
    const order = await Order.create({
      customerId: req.user._id.toString(),
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: req.body.items,
      total: req.body.total,
      shippingAddress: req.body.shippingAddress,
      status: 'pending',
    });
    try {
 const vendorMap = {};

order.items.forEach(item => {
  if (!item.vendorEmail) return;

  if (!vendorMap[item.vendorEmail]) {
    vendorMap[item.vendorEmail] = [];
  }

  vendorMap[item.vendorEmail].push(item);
});

for (const email in vendorMap) {
  const itemsText = vendorMap[email]
    .map(i => `${i.productName} x ${i.quantity}`)
    .join('\n');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Order Received",
    text: `
New Order Received

Customer: ${order.customerName}
Total: ₹${order.total}

Items:
${itemsText}
`,
  });
}
} catch (err) {
  console.error("Email error:", err);
}
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/create-payment", protect, async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const crypto = require("crypto");

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (err) {
    res.status(500).json({ success: false });
  }
});
module.exports = router;
