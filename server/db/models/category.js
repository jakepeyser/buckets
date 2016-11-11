const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('category', {
  category: {
    type: DataTypes.STRING(),
    allowNull: false
  }
});
