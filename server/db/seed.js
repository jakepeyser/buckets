if (process.env.NODE_ENV !== 'production')
  require('dotenv').config();
const db = require('./');
const chalk = require('chalk');

const goals = [
  { name: 'Test Goal' }
]

// Associate all test data with its corresponding table
const	tables = {
  goal: goals
}

// helper function for create data to tatabase
const seedFunc = function(table) {
  return () => db.Promise.map(tables[table], result => db.model(table).create(result))
}

db.didSync
	.then(() => db.sync({force: true}))
	.then(seedFunc('goal'))
	.then(() => console.log(chalk.green('Database seeded')))
	.catch(error => console.log(chalk.red(error)))
	.finally(() => db.close())
