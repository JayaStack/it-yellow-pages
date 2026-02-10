const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Business description is required']
  },
  address: {
    street: String,
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zip: String
  },
  phoneNumbers: [{
    type: String,
    required: true
  }],
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  website: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: [true, 'Sub-category is required']
  },
  images: [String],
  logo: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for search and filtering
businessSchema.index({ name: 'text', description: 'text', 'address.city': 'text', 'address.area': 'text' });
businessSchema.index({ category: 1 });
businessSchema.index({ subCategory: 1 });

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
