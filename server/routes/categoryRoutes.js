const express = require('express');
const router = express.Router();
const { getCategories, getSubcategories, createCategory, getCategoryBySlug } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.get('/:id/subcategories', getSubcategories);
router.get('/slug/:slug', getCategoryBySlug);
router.post('/', protect, admin, createCategory);

module.exports = router;
