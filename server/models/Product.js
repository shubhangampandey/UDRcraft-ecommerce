const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  price:         { type: Number, required: true },
  originalPrice: { type: Number },
  image:         { type: String, default: '' },
  hoverImage:    { type: String },
  category:      { type: String, required: true },
  rating:        { type: Number, default: 0 },
  reviews:       { type: Number, default: 0 },
  badge:         { type: String },
  vendor:        { type: String, required: true },
  vendorId:      { type: String, required: true },
  vendorEmail:   { type: String },
  description:   { type: String, default: '' },
  inStock:       { type: Boolean, default: true },
  approved:      { type: Boolean, default: false },

  isImported: {
  type: Boolean,
  default: false,
},
 isBestSeller: {
  type: Boolean,
  default: false,
},

sourceHandle: {
  type: String,
  default: "",
},

discount: {
  type: Number,
  default: 0,
},
}, { timestamps: true });

productSchema.index({ name: 'text', category: 'text', vendor: 'text' });

productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

module.exports = mongoose.model('Product', productSchema);
