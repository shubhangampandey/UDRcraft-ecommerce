const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: String, required: true },
  productName: { type: String, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  price:       { type: Number, required: true },
  vendorId:    { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId:      { type: String, required: true },
  customerName:    { type: String, required: true },
  customerEmail:   { type: String, required: true },
  items:           [orderItemSchema],
  total:           { type: Number, required: true },
  status:          { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: { type: String, default: '' },
}, { timestamps: true });

orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.createdAt = obj.createdAt?.toISOString?.().split('T')[0] || '';
  return obj;
};

module.exports = mongoose.model('Order', orderSchema);
