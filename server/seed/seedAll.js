const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Business = require('../models/Business');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    // 2. Seed Admin User
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    let adminId;
    if (!existingAdmin) {
      const admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'password123',
        role: 'admin'
      });
      adminId = admin._id;
      console.log('Admin user created successfully.');
    } else {
      adminId = existingAdmin._id;
      console.log('Admin user already exists.');
    }

    // 3. Seed Categories & SubCategories
    // Clear existing data (optional, but requested to "restore", so maybe better to clear or skip duplicates)
    // For this script, we'll check if they exist or just clear them to ensure a fresh demo state.
    // Given the task is to "restore missing data", let's clear them first to avoid mess.
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await Business.deleteMany({});
    console.log('Cleared existing Categories, SubCategories, and Businesses.');

    const categoriesData = [
      {
        name: 'Technology',
        icon: 'laptop',
        subCategories: ['Software Development', 'Web Design', 'IT Consulting', 'Mobile Apps']
      },
      {
        name: 'Healthcare',
        icon: 'heart',
        subCategories: ['Hospitals', 'Dental Clinics', 'Pharmacies', 'Diagnostics']
      },
      {
        name: 'Education',
        icon: 'graduation-cap',
        subCategories: ['Universities', 'Schools', 'Online Courses', 'Tutors']
      },
      {
        name: 'Real Estate',
        icon: 'home',
        subCategories: ['Property Management', 'Real Estate Agency', 'Architecture', 'Interior Design']
      },
      {
        name: 'Automotive',
        icon: 'car',
        subCategories: ['Car Dealers', 'Auto Repair', 'Car Rental', 'Spare Parts']
      },
      {
        name: 'Food & Dining',
        icon: 'utensils',
        subCategories: ['Restaurants', 'Cafes', 'Bakeries', 'Fast Food']
      }
    ];

    for (const cat of categoriesData) {
      const category = await Category.create({
        name: cat.name,
        icon: cat.icon,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-')
      });

      console.log(`Created Category: ${category.name}`);

      for (const subName of cat.subCategories) {
        const subCategory = await SubCategory.create({
          name: subName,
          category: category._id
        });
        console.log(`  Created SubCategory: ${subCategory.name}`);

        // 4. Seed Businesses for each SubCategory
        for (let i = 1; i <= 2; i++) {
          await Business.create({
            name: `${subName} Pro ${i}`,
            description: `High quality ${subName} services provided by ${subName} Pro ${i}. We specialize in providing the best solutions for our clients in the ${cat.name} industry.`,
            address: {
              street: `${100 * i} Main St`,
              area: 'Central Business District',
              city: 'Tech City',
              state: 'Innovation State',
              zip: '12345'
            },
            phoneNumbers: [`+1-555-010${i}`, `+1-555-020${i}`],
            email: `info@${subName.toLowerCase().replace(/\s+/g, '')}${i}.com`,
            website: `https://www.info@${subName.toLowerCase().replace(/\s+/g, '')}${i}.com`,
            category: category._id,
            subCategory: subCategory._id,
            rating: 4 + Math.random(),
            numReviews: Math.floor(Math.random() * 100),
            owner: adminId,
            status: 'approved',
            isFeatured: i === 1,
            images: [`https://picsum.photos/seed/${subName}${i}/800/600`],
            logo: `https://picsum.photos/seed/${subName}${i}logo/200/200`
          });
        }
      }
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
