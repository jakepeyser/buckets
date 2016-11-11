const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('goal', {
  name: {
    type: DataTypes.STRING(),
    allowNull: false,
    set: function(val) {
      this.setDataValue('name', val.trim());
    }
  },
  banner_pic_url: {
    type: DataTypes.STRING(),
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  price_range: {
    type: DataTypes.INTEGER(),
    validate: {
      min: 1,
      max: 4
    }
  },
  location: {
    type: DataTypes.STRING()
  },
  lat: {
    type: DataTypes.FLOAT(),
    validate: {
      isFloat: true,
      min: -90,
      max: 90
    }
  },
  lon: {
    type: DataTypes.FLOAT(),
    validate: {
      isFloat: true,
      min: -180,
      max: 180
    }
  },
  date: {
    type: DataTypes.DATE()
  }
});
