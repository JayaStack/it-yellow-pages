const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Business = require('../models/Business');

dotenv.config();

const countFeatured = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');
    const total = await Business.countDocuments({});
    const featured = await Business.countDocuments({ isFeatured: true });
    const approvedFeatured = await Business.countDocuments({ isFeatured: true, status: 'approved' });
    
    console.log('Total Businesses:', total);
    console.log('Featured Businesses (any status):', featured);
    console.log('Approved Featured Businesses:', approvedFeatured);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

countFeatured();
