if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();

// Run all tests
const tests = [
  'goal',
  'user',
  'snippet'
]

tests.forEach(test => require(`./${test}.test.js`))
