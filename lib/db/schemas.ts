import mongoose, { Schema } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // In production, this would be hashed
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

// Product Spec Schema
const ProductSpecSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

// Product Schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  images: [{ type: String, required: true }],
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  specs: [ProductSpecSchema]
});

// Order Item Schema
const OrderItemSchema = new Schema({
  product: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

// Order Schema
const OrderSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  shippingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// Compile or retrieve models safely (preventing re-compilation in development)
export const DBUser = mongoose.models.User || mongoose.model('User', UserSchema);
export const DBProduct = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const DBOrder = mongoose.models.Order || mongoose.model('Order', OrderSchema);
