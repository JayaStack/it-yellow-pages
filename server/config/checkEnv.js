const checkEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing environment variables: ${missing.join(', ')}`);
    console.error('Check your .env file or deployment settings.');
    process.exit(1);
  }
};

module.exports = checkEnv;
