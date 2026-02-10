const express = require('express');
const router = express.Router();
const { getSubCategoriesByCategory, createSubCategory } = require('../controllers/subCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:categoryId', getSubCategoriesByCategory);
router.post('/', protect, admin, createSubCategory);

module.exports = router;
