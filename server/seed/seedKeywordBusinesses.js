const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { faker } = require('@faker-js/faker');

// Models
const Business = require('../models/Business');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const keywordData = [
  {
    keyword: 'Web Design',
    categoryName: 'IT Services',
    icon: 'laptop',
    subCategoryName: 'Web Development & Design',
    businesses: [
      { name: 'Creative Web Designs', description: 'Professional web design and development services for small businesses.' },
      { name: 'Pixel Perfect Studios', description: 'High-quality web design, UI/UX, and creative branding.' },
      { name: 'Modern Web Architects', description: 'Building responsive web designs and modern e-commerce solutions.' },
      { name: 'TechVibe Web Solutions', description: 'Strategic web design and digital marketing services.' }
    ]
  },
  {
    keyword: 'Catering',
    categoryName: 'Food & Dining',
    icon: 'utensils',
    subCategoryName: 'Catering Services',
    businesses: [
      { name: 'Elite Catering Services', description: 'Delicious catering for weddings, parties, and corporate events.' },
      { name: 'Spicy Delights Catering', description: 'Authentic South Indian catering services for all occasions.' },
      { name: 'Gourmet Feast Catering', description: 'Premium catering with a wide variety of international cuisines.' },
      { name: 'Home Style Catering', description: 'Healthy and tasty home-style catering for small gatherings.' }
    ]
  },
  {
    keyword: 'Pest Control',
    categoryName: 'Home Services',
    icon: 'home',
    subCategoryName: 'Pest Control Services',
    businesses: [
      { name: 'SafeHome Pest Control', description: 'Eco-friendly pest control services for termites, bed bugs, and more.' },
      { name: 'Quick Kill Pest Experts', description: 'Fast and effective pest control solutions for residential and commercial properties.' },
      { name: 'Termite Shield Services', description: 'Specialized pest control and termite treatment with 5-year warranty.' },
      { name: 'Herbal Pest Solutions', description: 'Safe and organic pest control services for your family and pets.' }
    ]
  },
  {
    keyword: 'Solar',
    categoryName: 'Energy & Power',
    icon: 'zap',
    subCategoryName: 'Solar Energy Solutions',
    businesses: [
      { name: 'Bright Solar Solutions', description: 'Advanced solar panel installation and renewable energy services.' },
      { name: 'Green Power Solar', description: 'Cost-effective solar energy systems for homes and offices.' },
      { name: 'Solar Way Technologies', description: 'Premium solar energy products and maintenance services.' },
      { name: 'SunShift Solar Panels', description: 'Harness the sun with our high-efficiency solar panel designs.' }
    ]
  }
];

const seedKeywords = async () => {
  try {
    console.log('--- REFRESHING KEYWORD-LINKED BUSINESSES ---');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const adminUser = await User.findOne({ role: 'admin' });
    const allKeywordBizNames = keywordData.flatMap(d => d.businesses.map(b => b.name));
    
    console.log('Cleaning up stale keyword data...');
    await Business.deleteMany({ name: { $in: allKeywordBizNames } });

    const city = 'Kumbakonam';

    for (const data of keywordData) {
      console.log(`Keyword: ${data.keyword}`);

      let category = await Category.findOne({ name: data.categoryName });
      if (!category) {
        category = await Category.create({ name: data.categoryName, icon: data.icon });
      }

      let subCategory = await SubCategory.findOne({ name: data.subCategoryName, category: category._id });
      if (!subCategory) {
        subCategory = await SubCategory.create({ name: data.subCategoryName, category: category._id });
      }

      for (const biz of data.businesses) {
          await Business.create({
            name: biz.name,
            description: biz.description,
            address: {
              street: faker.location.streetAddress(),
              area: faker.location.secondaryAddress(),
              city: city,
              state: 'Tamil Nadu',
              zip: faker.location.zipCode()
            },
            phoneNumbers: [faker.phone.number()],
            email: faker.internet.email().toLowerCase(),
            website: faker.internet.url(),
            category: category._id,
            subCategory: subCategory._id,
            rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
            numReviews: faker.number.int({ min: 5, max: 50 }),
            owner: adminUser._id,
            status: 'approved',
            isFeatured: true,
            images: [`https://picsum.photos/seed/${faker.string.alphanumeric(5)}/800/600`]
          });
      }
    }

    console.log('Keyword Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding keyword data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedKeywords();
