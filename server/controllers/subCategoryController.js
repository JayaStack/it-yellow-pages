const SubCategory = require('../models/SubCategory');

// @desc    Get subcategories by category ID
// @route   GET /api/subcategories/:categoryId
// @access  Public
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.categoryId });
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a subcategory
// @route   POST /api/subcategories
// @access  Private/Admin
const createSubCategory = async (req, res) => {
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    return res.status(400).json({ message: 'Please provide name and categoryId' });
  }

  try {
    const subCategory = await SubCategory.create({
      name,
      category: categoryId
    });
    res.status(201).json(subCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getSubCategoriesByCategory,
  createSubCategory
};
