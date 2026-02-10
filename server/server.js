const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db.js');
const checkEnv = require('./config/checkEnv.js');

// Load environment variables
dotenv.config();

// Validate environment variables
checkEnv();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/subcategories', require('./routes/subCategoryRoutes'));
app.use('/api/businesses', require('./routes/businessRoutes'));

app.get('/', (req, res) => {
  res.send('Yellow Pages Clone API is running...');
});

// Error Middleware
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
