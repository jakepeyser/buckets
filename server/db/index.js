const db = module.exports = require('./db');
const chalk = require('chalk');
require('./models'); // Require all the models

// Sync the db, creating it if necessary
const isTest = process.env.NODE_ENV === 'testing';
const sync = (force = isTest) => {
  return db.sync({force})
    .then(ok => console.log(chalk.green(`Synced models to database ${db.config.database}`)))
    .catch(fail => {
      // If Prod, do not create new DBs
      // if (!isTest) {
      //   return chalk.red(fail)
      // }
      // Otherwise, do this autocreate nonsense
      console.log(chalk.yellow(`Creating database ${db.config.database}...`))
      return new Promise((resolve, reject) =>
        require('child_process').exec(`createdb "${db.config.database}"`, resolve)
      ).then(() => sync(true))
    })
}

db.didSync = sync();
