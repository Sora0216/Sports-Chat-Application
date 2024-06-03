//module.exports = (sequelize, DataTypes) => {
  //const User = sequelize.define('User', {
  //  username: {
     // type: DataTypes.STRING,
     // allowNull: false,
     // unique: true
    //},
    //password: {
    //  type: DataTypes.STRING,
     // allowNull: false
   // }
  //});

  //return User;
//};


const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }

  },

  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }

  );

module.exports = User;