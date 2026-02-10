const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  icon: {
    type: String,
    default: 'briefcase' // Lucide icon name
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
}, { timestamps: true });

// Pre-save to handle slug if not provided (though it should be handled in controller)
categorySchema.pre('validate', function() {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().split(' ').join('-');
  }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
