const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('snippet', {
  title: {
    type: DataTypes.STRING(),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT(),
    allowNull: false
  }
}, {
  classMethods: {
    getGoalSnippets(goalId) {
      return this.findAll({
        where: { goal_id: goalId }
      });
    }
  }
});
