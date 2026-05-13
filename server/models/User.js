const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true, minlength: 6 },
  name:             { type: String, required: true, trim: true },
  role:             { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  avatar:           { type: String },
  storeName:        { type: String },
  storeDescription: { type: String },
  phone:            { type: String },
  status:           { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  obj.id = obj._id.toString();
  obj.createdAt = obj.createdAt?.toISOString?.().split('T')[0] || '';
  return obj;
};

module.exports = mongoose.model('User', userSchema);
