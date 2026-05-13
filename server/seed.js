require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});

  // Create users
  const admin = await User.create({
    email: 'admin@maison.com', password: 'admin123', name: 'Admin User',
    role: 'admin', status: 'active',
  });
  const vendor1 = await User.create({
    email: 'vendor@nordicliving.com', password: 'vendor123', name: 'Erik Lindström',
    role: 'vendor', storeName: 'Nordic Living', storeDescription: 'Scandinavian-inspired premium furniture', status: 'active',
  });
  const vendor2 = await User.create({
    email: 'vendor@atelier.com', password: 'vendor123', name: 'Sophie Dubois',
    role: 'vendor', storeName: 'Atelier Moderne', storeDescription: 'Contemporary French design', status: 'active',
  });
  const customer = await User.create({
    email: 'customer@example.com', password: 'customer123', name: 'Jane Smith',
    role: 'customer', status: 'active',
  });

  console.log('Users seeded');

  // Create products
  const productData = [
    { name: 'Mond Sectional Sofa', price: 4299, originalPrice: 5199, category: 'Seating', rating: 4.9, reviews: 124, badge: 'Best Seller', vendor: 'Nordic Living', vendorId: vendor1._id.toString(), description: 'A masterpiece of Scandinavian craftsmanship.', inStock: true, approved: true, image: '' },
    { name: 'Luna Lounge Chair', price: 1890, category: 'Seating', rating: 4.8, reviews: 89, badge: 'New', vendor: 'Atelier Moderne', vendorId: vendor2._id.toString(), description: 'Designed for those who appreciate the art of sitting.', inStock: true, approved: true, image: '' },
    { name: 'Aria Coffee Table', price: 2150, originalPrice: 2600, category: 'Tables', rating: 4.7, reviews: 67, vendor: 'Nordic Living', vendorId: vendor1._id.toString(), description: 'Sculptural marble top meets artisan-crafted base.', inStock: true, approved: true, image: '' },
    { name: 'Zenith Floor Lamp', price: 890, category: 'Lighting', rating: 4.6, reviews: 45, badge: 'Trending', vendor: 'Nordic Living', vendorId: vendor1._id.toString(), description: 'Minimalist elegance meets warm ambient lighting.', inStock: true, approved: true, image: '' },
    { name: 'Erosion Ceramic Vase', price: 340, category: 'Decor', rating: 4.9, reviews: 156, badge: 'Best Seller', vendor: 'Atelier Moderne', vendorId: vendor2._id.toString(), description: 'Each piece is unique with natural mineral patterns.', inStock: true, approved: true, image: '' },
    { name: 'Modular Display Shelf', price: 3200, originalPrice: 3800, category: 'Storage', rating: 4.8, reviews: 78, vendor: 'Nordic Living', vendorId: vendor1._id.toString(), description: 'Blackened steel frame with adjustable shelving.', inStock: true, approved: true, image: '' },
    { name: 'Curve Dining Chair', price: 680, category: 'Seating', rating: 4.7, reviews: 92, badge: 'New', vendor: 'Atelier Moderne', vendorId: vendor2._id.toString(), description: 'Ergonomic comfort meets sculptural beauty.', inStock: true, approved: true, image: '' },
    { name: 'Mond Sofa — Ivory', price: 4599, category: 'Seating', rating: 4.9, reviews: 44, badge: 'Limited', vendor: 'Nordic Living', vendorId: vendor1._id.toString(), description: 'The iconic Mond in a limited ivory colorway.', inStock: true, approved: true, image: '' },
  ];

  const products = await Product.insertMany(productData);
  console.log('Products seeded');

  // Create orders
  await Order.insertMany([
    {
      customerId: customer._id.toString(), customerName: 'Jane Smith', customerEmail: 'customer@example.com',
      items: [
        { productId: products[0]._id.toString(), productName: 'Mond Sectional Sofa', quantity: 1, price: 4299, vendorId: vendor1._id.toString() },
        { productId: products[3]._id.toString(), productName: 'Zenith Floor Lamp', quantity: 2, price: 890, vendorId: vendor1._id.toString() },
      ],
      total: 6079, status: 'delivered', shippingAddress: '123 Main St, New York, NY',
    },
    {
      customerId: customer._id.toString(), customerName: 'Jane Smith', customerEmail: 'customer@example.com',
      items: [
        { productId: products[1]._id.toString(), productName: 'Luna Lounge Chair', quantity: 1, price: 1890, vendorId: vendor2._id.toString() },
      ],
      total: 1890, status: 'shipped', shippingAddress: '123 Main St, New York, NY',
    },
    {
      customerId: customer._id.toString(), customerName: 'Jane Smith', customerEmail: 'customer@example.com',
      items: [
        { productId: products[2]._id.toString(), productName: 'Aria Coffee Table', quantity: 1, price: 2150, vendorId: vendor1._id.toString() },
        { productId: products[4]._id.toString(), productName: 'Erosion Ceramic Vase', quantity: 3, price: 340, vendorId: vendor2._id.toString() },
      ],
      total: 3170, status: 'processing', shippingAddress: '456 Oak Ave, LA, CA',
    },
  ]);
  console.log('Orders seeded');

  console.log('\n--- Demo Credentials ---');
  console.log('Admin:    admin@maison.com / admin123');
  console.log('Vendor1:  vendor@nordicliving.com / vendor123');
  console.log('Vendor2:  vendor@atelier.com / vendor123');
  console.log('Customer: customer@example.com / customer123');

  await mongoose.disconnect();
  console.log('\nSeed complete!');
}

seed().catch(err => { console.error(err); process.exit(1); });
