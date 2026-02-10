const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({ parentCategory: null });
  res.json(categories);
};

// @desc    Get subcategories of a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
const getSubcategories = async (req, res) => {
  const subcategories = await Category.find({ parentCategory: req.params.id });
  res.json(subcategories);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, icon, parentCategory } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    icon,
    parentCategory: parentCategory || null
  });

  res.status(201).json(category);
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
};

module.exports = {
  getCategories,
  getSubcategories,
  createCategory,
  getCategoryBySlug
};
