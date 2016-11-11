const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('goal', {
  name: {
    type: DataTypes.STRING(),
    allowNull: false,
    set: function(val) {
      this.setDataValue('name', val.trim());
    }
  }

});
