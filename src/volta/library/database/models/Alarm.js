const { DataTypes } = require('sequelize');


const Alarm = {
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

module.exports = Alarm;