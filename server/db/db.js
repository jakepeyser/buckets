const debug = require('debug')('sql');
const chalk = require('chalk');
const Sequelize = require('sequelize');

const dbName = process.env.DB_NAME +
  (process.env.NODE_ENV === 'testing' ? '_test' : '');
const url = process.env.DB_URL || `postgres://localhost:5432/${dbName}`

// create the database instance
console.log(chalk.yellow(`Opening database connection to ${url}`));
module.exports = new Sequelize(url, {
  logging: debug, // export DEBUG=sql in the environment to get SQL queries
  define: {
    underscored: true,       // use snake_case rather than camelCase column names
    freezeTableName: true,   // don't change table names from the one specified
    timestamps: true         // automatically include timestamp columns
  }
});
