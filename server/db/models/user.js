const db = require('../db');
const bcrypt = require('bcrypt-nodejs')
const DataTypes = db.Sequelize;

const setEmailAndPassword = user => {
  user.email = user.email && user.email.toLowerCase()
  if (!user.password) return Promise.resolve(user)

  return new Promise((resolve, reject) =>
    bcrypt.hash(user.get('password'), null, null, (err, hash) => {
      if (err) reject(err)
      user.set('password_digest', hash)
      resolve(user)
    })
  )
}

module.exports = db.define('user', {
  first_name: {
    type: DataTypes.STRING(),
    allowNull: false,
    set: function(val) {
      this.setDataValue('first_name', val.trim());
    }
  },
  last_name: {
    type: DataTypes.STRING(),
    allowNull: false,
    set: function(val) {
      this.setDataValue('last_name', val.trim());
    }
  },
  is_private: {
    type: DataTypes.BOOLEAN(),
    defaultValue: false
  },
  email: {
    type: DataTypes.STRING(),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password_digest: DataTypes.STRING(),
  password: DataTypes.VIRTUAL(),
  about: {
    type: DataTypes.TEXT(),
    set: function(val) {
      this.setDataValue('about', val.trim());
    }
  },
  profile_pic_url: {
    type: DataTypes.STRING(),
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  location: {
    type: DataTypes.STRING()
  }
}, {
  hooks: {
    beforeCreate: setEmailAndPassword,
    beforeUpdate: setEmailAndPassword
  },
  instanceMethods: {
    authenticate(plaintext) {
      return new Promise((resolve, reject) =>
        bcrypt.compare(plaintext, this.password_digest,
          (err, result) =>
            err ? reject(err) : resolve(result))
        )
    },
    fullName() {
      return `${this.first_name} ${this.last_name}`;
    }
  }
});
