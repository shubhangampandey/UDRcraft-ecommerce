const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const xlsx = require('xlsx');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../config/cloudinary");
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { fetchProducts } = require("../services/supplierService");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg","png","webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" }
    ],
  },
});


const upload = multer({ storage });
const fileUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/products/bulk-upload — vendor-only CSV/XLSX import
router.post('/bulk-upload', protect, authorize('vendor'), fileUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File upload is required' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!['.csv', '.xls', '.xlsx'].includes(ext)) {
      return res.status(400).json({ message: 'Only CSV and XLSX files are supported' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer', raw: false });
    if (!workbook.SheetNames.length) {
      return res.status(400).json({ message: 'Uploaded file contains no sheets' });
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    const rows = rawRows.filter(row => Object.values(row).some(value => value !== '' && value !== null && value !== undefined));

    const failedRows = [];
    const validProducts = [];

    const groupedProducts = {};

rows.forEach((row) => {
  const handle = row['Handle'];

  if (!handle) return;

  if (!groupedProducts[handle]) {
    const productCategory = row['Product Category']
      ? row['Product Category'].split('>').pop().trim()
      : '';

    groupedProducts[handle] = {
      name: row['Title'] || 'Untitled Product',
      description: row['Body (HTML)']
        ? String(row['Body (HTML)']).replace(/<[^>]*>/g, '')
        : '',
      category: row['Type'] || productCategory || 'General',
      price: Number(row['Variant Price']) || 0,
      originalPrice: row['Variant Compare At Price']
        ? Number(row['Variant Compare At Price'])
        : undefined,
      images: [],
      handle,
    };
  }

  if (row['Image Src']) {
    groupedProducts[handle].images.push(row['Image Src']);
  }
});

Object.values(groupedProducts).forEach((item) => {
  validProducts.push({
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice,
    image: item.images[0] || '',
    hoverImage: item.images[1] || item.images[0] || '',
    category: item.category,
    description: item.description,
    vendor: req.user.storeName || req.user.name,
    vendorId: req.user._id.toString(),
    vendorEmail: req.user.email,
    inStock: true,
    approved: false,
    sourceHandle: item.handle,

    rating: Number((Math.random() * 1 + 4).toFixed(1)),
    reviews: Math.floor(Math.random() * 450 + 50),
  });
});

    const insertedProducts = [];

for (const productData of validProducts) {
  const existing = await Product.findOne({
    vendorId: req.user._id.toString(),
    sourceHandle: productData.sourceHandle,
  });

  if (existing) {
    const updated = await Product.findByIdAndUpdate(
      existing._id,
      productData,
      { new: true }
    );

    insertedProducts.push(updated);
  } else {
    const created = await Product.create(productData);
    insertedProducts.push(created);
  }
}

    return res.json({
      totalRows: rows.length,
      successCount: insertedProducts.length,
      failedRows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products — public, returns approved products only
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ approved: true }).sort({ createdAt: -1 });

    const formatted = products.map(p => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/all — admin only, returns all products
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const formatted = products.map(p => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/vendor/:vendorId
router.get('/vendor/:vendorId', protect, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/import", protect, authorize('admin'), async (req, res) => {
  try {
    const formatted = await fetchProducts();

    const inserted = await Product.insertMany(formatted);

    res.json({
      success: true,
      count: inserted.length,
      message: 'Imported supplier products successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/delete-imported', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await Product.deleteMany({
      isImported: true
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: 'Imported products deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/search?q=sofa
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';

    const products = await Product.find({
      approved: true,
      name: { $regex: q, $options: 'i' }
    }).sort({ createdAt: -1 });

    const formatted = products.map(p => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — vendor creates product with optional image upload
router.post('/', protect, authorize('vendor'), upload.single('image'), async (req, res) => {
  try {
    
    const product = await Product.create({
  name: req.body.name,
  price: Number(req.body.price),
  originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
  image: req.file ? req.file.path : "",
  category: req.body.category,
  description: req.body.description || '',
  vendor: req.user.storeName || req.user.name,
  vendorId: req.user._id.toString(),
  vendorEmail: req.user.email,
  badge: req.body.badge,
  discount: req.body.discount ? Number(req.body.discount) : 0,   
  inStock: true,
  approved: false,

  rating: Number((Math.random() * 1 + 4).toFixed(1)),
reviews: Math.floor(Math.random() * 450 + 50),
});
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category,
      description: req.body.description,
    };

    // if new image uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/delete-all', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await Product.deleteMany({});

    res.json({
      success: true,
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete all products error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while deleting products',
    });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id/approve — admin toggle approval
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.approved = !product.approved;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch('/approve-all', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await Product.updateMany(
      { approved: false },
      { $set: { approved: true } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} products approved successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Approve all products error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while approving products',
    });
  }
});
router.patch('/reject-all', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await Product.updateMany(
      {},
      { $set: { approved: false } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} products rejected successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Reject all products error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while rejecting products',
    });
  }
});


router.patch("/:id/best-seller", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    product.isBestSeller = !product.isBestSeller;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
