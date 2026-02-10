const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Business = require('../models/Business');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const categories = [
  { name: 'Energy & Power', icon: 'zap' },
  { name: 'Chemicals', icon: 'flask-conical' },
  { name: 'Shopping', icon: 'shopping-bag' },
  { name: 'Livestock & Agriculture', icon: 'leaf' },
  { name: 'Electricals', icon: 'plug' },
  { name: 'Machinery & Tools', icon: 'settings' },
  { name: 'Food & Dining', icon: 'utensils' },
  { name: 'Health & Medical', icon: 'heart-pulse' },
  { name: 'Education', icon: 'graduation-cap' },
  { name: 'Real Estate', icon: 'home' }
];

const seedData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Business.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded!');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('Admin user seeded!');

    // Add some sample subcategories for Energy & Power
    const energyId = createdCategories.find(c => c.name === 'Energy & Power')._id;
    await Category.insertMany([
      { name: 'Solar Energy', parentCategory: energyId },
      { name: 'Generators', parentCategory: energyId },
      { name: 'UPS & Inverters', parentCategory: energyId }
    ]);

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
