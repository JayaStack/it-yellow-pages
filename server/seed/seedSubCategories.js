const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Business = require('../models/Business');

dotenv.config({ path: path.join(__dirname, '../.env') });

const subCategoryMapping = {
  'Energy & Power': ['Solar Energy', 'Generators', 'UPS & Inverters', 'Wind Energy', 'Batteries'],
  'Chemicals': ['Industrial Chemicals', 'Agricultural Chemicals', 'Laboratory Chemicals', 'Water Treatment Chemicals'],
  'Shopping': ['Clothing & Apparel', 'Electronics & Gadgets', 'Footwear', 'Home Appliances', 'Grocery Stores'],
  'Livestock & Agriculture': ['Dairy Farming', 'Poultry Farming', 'Organic Farming', 'Seeds & Fertilizers', 'Farm Machinery'],
  'Electricals': ['Electrical Switches', 'Cables & Wires', 'Lighting & Fixtures', 'Electric Motors', 'Transformers'],
  'Machinery & Tools': ['Industrial Machinery', 'Power Tools', 'Constructon Equipment', 'Textile Machinery', 'Packaging Machinery'],
  'Food & Dining': ['Fine Dining', 'Fast Food', 'Cafes & Bakeries', 'South Indian', 'Multi-Cuisine', 'Catering Services'],
  'Health & Medical': ['Hospitals', 'Diagnostic Centers', 'Pharmacies', 'Dental Clinics', 'Ayurvedic Centers'],
  'Education': ['Schools', 'Colleges', 'Coaching Centers', 'Training Institutes', 'Play Schools'],
  'Real Estate': ['Residential Builders', 'Commercial Property', 'Real Estate Agents', 'Interior Designers', 'Architects']
};

const seedSubCategories = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // 1. Fetch all categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.error('No categories found. Run utils/seed.js first.');
      process.exit(1);
    }

    // 2. Clear existing subcategories
    console.log('Clearing existing subcategories...');
    await SubCategory.deleteMany();

    // 3. Create subcategories based on mapping
    console.log('Seeding realistic subcategories...');
    const createdSubCategories = [];

    for (const cat of categories) {
      const subNames = subCategoryMapping[cat.name] || ['General ' + cat.name];
      for (const name of subNames) {
        const sub = await SubCategory.create({
          name,
          category: cat._id
        });
        createdSubCategories.push(sub);
      }
    }

    console.log(`${createdSubCategories.length} subcategories created successfully!`);

    // 4. Link existing businesses to new subcategories (important to avoid validation errors on existing data)
    console.log('Linking existing businesses to valid subcategories...');
    const businesses = await Business.find();
    
    for (const biz of businesses) {
      const validSubs = createdSubCategories.filter(s => s.category.toString() === biz.category.toString());
      if (validSubs.length > 0) {
        // Find one that matches closest or just pick first
        const randomSub = validSubs[Math.floor(Math.random() * validSubs.length)];
        biz.subCategory = randomSub._id;
        await biz.save();
      }
    }
    
    console.log(`Updated ${businesses.length} businesses with valid subcategory references.`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedSubCategories();
