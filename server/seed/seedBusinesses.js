const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Business = require('../models/Business');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedBusinesses = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // 2. Fetch dependencies
    const categories = await Category.find();
    const subCategories = await SubCategory.find();
    
    if (categories.length === 0 || subCategories.length === 0) {
      console.error('No categories or subcategories found. Run utils/seed.js and seed/seedSubCategories.js first.');
      process.exit(1);
    }

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please run local seed/utils/seed.js first.');
      process.exit(1);
    }

    // 3. Clear existing non-essential businesses (optional)
    // await Business.deleteMany({ owner: adminUser._id });

    // 4. Generate 50 realistic records
    const businesses = [];
    console.log('Generating 50 business records...');

    for (let i = 0; i < 50; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const validSubCats = subCategories.filter(s => s.category.toString() === randomCategory._id.toString());
      const randomSubCat = validSubCats[Math.floor(Math.random() * validSubCats.length)];
      
      const businessData = {
        name: faker.company.name(),
        description: faker.commerce.productDescription() + '. ' + faker.company.catchPhrase(),
        address: {
          street: faker.location.streetAddress(),
          area: faker.location.secondaryAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode()
        },
        phoneNumbers: [faker.phone.number()],
        email: faker.internet.email().toLowerCase(),
        website: faker.internet.url(),
        category: randomCategory._id,
        subCategory: randomSubCat._id,
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        numReviews: faker.number.int({ min: 0, max: 200 }),
        owner: adminUser._id,
        status: 'approved',
        isFeatured: faker.datatype.boolean(0.2), // 20% chance of being featured
        images: [
          `https://picsum.photos/seed/${faker.string.alphanumeric(5)}/800/600`,
          `https://picsum.photos/seed/${faker.string.alphanumeric(5)}/800/600`
        ],
        createdAt: faker.date.past({ years: 2 })
      };

      businesses.push(businessData);
    }

    // 5. Bulk insert
    console.log('Inserting into database...');
    await Business.insertMany(businesses);

    // 6. Bonus: Ensure Text Index (Though defined in model, indexing happens on connection)
    console.log('Building text indexes...');
    await Business.createIndexes();

    console.log('Successfully seeded 50 businesses!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedBusinesses();
