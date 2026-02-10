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

const categoryData = {
  'IT Services': {
    icon: 'zap',
    subs: ['Software Development', 'Web Hosting', 'IT Consultancy'],
    businesses: ['CodeCraft Solutions', 'Elite IT Consulting', 'Cloud Stream Hosting', 'Secure Net IT']
  },
  'Health & Medical': {
    icon: 'heart-pulse',
    subs: ['Clinics & Hospitals', 'Pharmacies', 'Diagnostic Labs'],
    businesses: ['Lifeline Medical Center', 'MediCare Pharmacy', 'Precision Diagnostics', 'Wellness Clinic']
  },
  'Education': {
    icon: 'graduation-cap',
    subs: ['Professional Training', 'Schools', 'Coaching Centers'],
    businesses: ['Academy of Excellence', 'Future Scholars School', 'Tech Master Institute', 'Success Coaching']
  },
  'Real Estate': {
    icon: 'home',
    subs: ['Residential Properties', 'Commercial Real Estate', 'Property Management'],
    businesses: ['Horizon Builders', 'Blue Sky Realty', 'Prime Urban Properties', 'Safe Hands Management']
  },
  'Food & Dining': {
    icon: 'utensils',
    subs: ['Fine Dining', 'Quick Service Restaurants', 'Catering Services'],
    businesses: ['Golden Platter', 'Spice Route', 'Urban Bites', 'Elite Feast Catering']
  },
  'Shopping': {
    icon: 'shopping-bag',
    subs: ['Retail Stores', 'Fashion Boutiques', 'Electronics Outlets'],
    businesses: ['Trendy Trends', 'Metro Mart', 'Glow Fashion', 'Smart Gizmo Hub']
  },
  'Energy & Power': {
    icon: 'plug',
    subs: ['Solar Power Systems', 'Electrical Generators', 'Power Backup Solutions'],
    businesses: ['Bright Sun Solar', 'Volt Power Systems', 'Eco Energy Solutions', 'Ultra Generators']
  },
  'Machinery & Tools': {
    icon: 'settings',
    subs: ['Industrial Machinery', 'Power Tools', 'Construction Equipment'],
    businesses: ['Heavy Duty Machining', 'Precision Tools Co', 'BuildFast Equipment', 'Iron Master Tools']
  },
  'Livestock & Agriculture': {
    icon: 'leaf',
    subs: ['Dairy Farms', 'Organic Produce', 'Poultry Equipment'],
    businesses: ['Healthy Harvest Farms', 'Pure Milk Dairy', 'Green Field Organic', 'Poultry Pro Solutions']
  },
  'Chemicals': {
    icon: 'flask-conical',
    subs: ['Industrial Chemicals', 'Specialty Chemicals', 'Agro Chemicals'],
    businesses: ['PureChem Solutions', 'Industrial Bond Ltd', 'AgroShield Chemicals', 'Apex Specialty Lab']
  }
};

const seedCategoryBusinesses = async () => {
  try {
    console.log('--- CLEAN SEEDING CATEGORY-LINKED BUSINESSES ---');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
        // Create admin if missing
        console.log('Admin user missing. Seeding admin...');
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin created.');
    }
    const adminRef = await User.findOne({ role: 'admin' });

    const city = 'Kumbakonam';
    const report = [];

    // TO ENSURE DATA INTEGRITY, WE WILL:
    // 1. Delete all categories, subcategories and businesses for a fresh start
    console.log('Clearing old data...');
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await Business.deleteMany({}); // Delete all for a fresh demo restart
    console.log('Data cleared.');

    for (const [catName, details] of Object.entries(categoryData)) {
      console.log(`\nProcessing: ${catName}`);

      // Create Category
      const category = await Category.create({
        name: catName,
        icon: details.icon || 'briefcase',
        slug: catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
      });
      console.log(`  + Category: ${catName} (${category.icon})`);


      // Create Subcategories
      const subCategoryIds = [];
      for (const subName of details.subs) {
        const sub = await SubCategory.create({
          name: subName,
          category: category._id
        });
        subCategoryIds.push(sub._id);
      }

      // Create Businesses
      let addedCount = 0;
      for (const bizName of details.businesses) {
        const randomSubId = subCategoryIds[Math.floor(Math.random() * subCategoryIds.length)];
        
        await Business.create({
          name: bizName,
          description: `Trusted experts in ${catName}. Specialist in ${details.subs[0]} and other industrial solutions. Certified and reliable services in ${city}.`,
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
          subCategory: randomSubId,
          rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
          numReviews: faker.number.int({ min: 20, max: 300 }),
          owner: adminRef._id,
          status: 'approved',
          isFeatured: true, // Make them prominent
          featured: true,
          images: [`https://picsum.photos/seed/${faker.string.alphanumeric(12)}/1200/800`]
        });
        addedCount++;
      }
      report.push({ category: catName, businessesAdded: addedCount, categoryId: category._id });
      console.log(`  √ Added ${addedCount} businesses`);
    }

    console.log('\n--- FINAL MAPPING REPORT ---');
    console.table(report);
    
    console.log('\nClean Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('SEEDING FAILED:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedCategoryBusinesses();
