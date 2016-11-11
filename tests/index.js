if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();

// Run all tests
require('./goal.test.js');
