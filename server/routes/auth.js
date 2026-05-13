const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const safeRole = role === 'vendor' ? 'vendor' : 'customer';

const user = await User.create({
  email,
  password,
  name,
  role: safeRole,
  storeName,
  storeDescription,
  status: safeRole === 'vendor' ? 'pending' : 'active',
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended' });
    }
    const token = signToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'avatar', 'storeName', 'storeDescription'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
