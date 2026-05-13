require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://ud-rcraft-ecommerce-zmv9.vercel.app/"
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/search', require('./routes/search'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
