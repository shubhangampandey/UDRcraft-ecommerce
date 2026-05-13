const router = require('express').Router();
const Product = require('../models/Product');

// GET /api/search?q=term
router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) return res.json([]);

    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      approved: true,
      $or: [
        { name: regex },
        { category: regex },
        { vendor: regex },
        { description: regex },
      ],
    }).limit(20);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
