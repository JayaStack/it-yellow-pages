const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusinessStatus,
  getFeaturedBusinesses,
  getLatestBusinesses,
  getModerationList
} = require('../controllers/businessController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getBusinesses);
router.get('/featured', getFeaturedBusinesses);
router.get('/latest', getLatestBusinesses);
router.get('/moderation', protect, admin, getModerationList);
router.get('/:id', getBusinessById);
router.post('/', protect, createBusiness);
router.put('/:id/status', protect, admin, updateBusinessStatus);

module.exports = router;
