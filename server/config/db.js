const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the MONGO_URI from environment variables.
 * Handles production-ready connection options and monitoring.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`🚀 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
