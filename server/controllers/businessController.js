const Business = require('../models/Business');

// @desc    Get all approved businesses with filters
// @route   GET /api/businesses
// @access  Public
const getBusinesses = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const searchKeyword = req.query.keyword || req.query.q;
  const keyword = searchKeyword ? {
    $or: [
      { name: { $regex: searchKeyword, $options: 'i' } },
      { description: { $regex: searchKeyword, $options: 'i' } }
    ]
  } : {};

  const city = req.query.city ? { 'address.city': { $regex: req.query.city, $options: 'i' } } : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const featured = req.query.featured === 'true' ? { $or: [{ isFeatured: true }, { featured: true }] } : {};

  const count = await Business.countDocuments({ ...keyword, ...city, ...category, ...featured, status: 'approved' });
  const businesses = await Business.find({ ...keyword, ...city, ...category, ...featured, status: 'approved' })
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({ businesses, page, pages: Math.ceil(count / pageSize), count });
};

// @desc    Get business by ID
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = async (req, res) => {
  const business = await Business.findById(req.params.id)
    .populate('category', 'name icon')
    .populate('subCategory', 'name icon');

  if (business) {
    res.json(business);
  } else {
    res.status(404);
    throw new Error('Business not found');
  }
};

// @desc    Create a business
// @route   POST /api/businesses
// @access  Private
const createBusiness = async (req, res) => {
  const {
    name, description, area, city, state, zip,
    phoneNumbers, email, website, category, subCategory,
    images, logo
  } = req.body;

  if (!category || !subCategory || subCategory.trim() === '') {
    res.status(400);
    throw new Error('Both Category and Sub-category are required');
  }

  const business = new Business({
    name,
    description,
    address: { area, city, state, zip },
    phoneNumbers,
    email,
    website,
    category,
    subCategory,
    images,
    logo,
    owner: req.user._id,
    status: 'pending' // Default to pending for moderation
  });

  const createdBusiness = await business.save();
  res.status(201).json(createdBusiness);
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private/Admin
const updateBusinessStatus = async (req, res) => {
  const { status, isFeatured } = req.body;

  const business = await Business.findById(req.params.id);

  if (business) {
    business.status = status !== undefined ? status : business.status;
    business.isFeatured = isFeatured !== undefined ? isFeatured : business.isFeatured;

    const updatedBusiness = await business.save();
    res.json(updatedBusiness);
  } else {
    res.status(404);
    throw new Error('Business not found');
  }
};

// @desc    Get featured businesses
// @route   GET /api/businesses/featured
// @access  Public
const getFeaturedBusinesses = async (req, res) => {
  const businesses = await Business.find({ isFeatured: true, status: 'approved' })
    .populate('category', 'name')
    .limit(6);
  res.json(businesses);
};

// @desc    Get latest businesses
// @route   GET /api/businesses/latest
// @access  Public
const getLatestBusinesses = async (req, res) => {
  const businesses = await Business.find({ status: 'approved' })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(6);
  res.json(businesses);
};

// @desc    Get businesses for moderation (Admin)
// @route   GET /api/businesses/admin/moderation
// @access  Private/Admin
const getModerationList = async (req, res) => {
  const businesses = await Business.find({ status: 'pending' })
    .populate('category', 'name')
    .populate('owner', 'name email');
  res.json(businesses);
};

module.exports = {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusinessStatus,
  getFeaturedBusinesses,
  getLatestBusinesses,
  getModerationList
};
