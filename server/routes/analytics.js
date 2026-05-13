const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// GET /api/analytics/admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const [users, orders, products] = await Promise.all([
      User.find(),
      Order.find(),
      Product.find(),
    ]);

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const statusCounts = {};
    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].forEach(s => {
      statusCounts[s] = orders.filter(o => o.status === s).length;
    });

    // Monthly revenue aggregation
    const monthlyMap = {};
    orders.forEach(o => {
      const d = o.createdAt || new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + o.total;
    });
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyRevenue = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, revenue]) => ({
        month: monthNames[parseInt(key.split('-')[1], 10) - 1],
        revenue,
      }));

    res.json({
      totalUsers: users.length,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalRevenue,
      customerCount: users.filter(u => u.role === 'customer').length,
      vendorCount: users.filter(u => u.role === 'vendor').length,
      recentOrders: orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
      ordersByStatus: statusCounts,
      monthlyRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/vendor/:vendorId
router.get('/vendor/:vendorId', protect, async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const [products, orders] = await Promise.all([
      Product.find({ vendorId }),
      Order.find({ 'items.vendorId': vendorId }),
    ]);

    const vendorRevenue = orders.reduce((sum, o) => {
      return sum + o.items
        .filter(i => i.vendorId === vendorId)
        .reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);

    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: vendorRevenue,
      pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
      recentOrders: orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
