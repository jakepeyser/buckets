const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session')
const path = require('path');
const PATHS = {
  indexHTML: path.join(__dirname, '../browser/build/index.html'),
  build: path.join(__dirname, '../browser/build'),
  bootstrap: path.resolve(__dirname, '..', 'node_modules/bootstrap/dist/css')
}
const PORT = process.env.PORT || 3000;
const chalk = require('chalk');
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing')
  require('dotenv').config();

// Logging, static, body-parser and session middleware
if (process.env.NODE_ENV !== 'testing')
  app.use(morgan('dev'));
app.use(express.static(PATHS.bootstrap));
app.use(express.static(PATHS.build));
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}))

// Handle API and all browser requests
app.use('/api', require('./routes'));
app.get('/*', (req, res) => res.sendFile(PATHS.indexHTML));

// Error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'testing') {
    console.error(chalk.red(err));
    console.error(chalk.red(err.stack))
  }
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

// Start server, oly if not testing (indicated by Supertest agent as parent)
if (!module.parent) {
  app.listen(PORT, () =>
    console.log(chalk.blue(`Server started on port ${chalk.magenta(PORT)}`))
  );
}

module.exports = app;
