const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('tag', {
  tag: {
    type: DataTypes.STRING(),
    allowNull: false
  }
});
