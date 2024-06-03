//const { DataTypes } = require('sequelize');
//const sequelize = require('../config/connection');

//const User = require('./User')(sequelize, DataTypes);
//const Message = require('./Message')(sequelize, DataTypes);

//User.hasMany(Message, { foreignKey: 'userId' });
//Message.belongsTo(User, { foreignKey: 'userId' });

//sequelize.sync();

//module.exports = { sequelize, User, Message };


const User = require('./User');
const Message = require('./Message');

// A user can have many messages
User.hasMany(Message, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  
  // A Message belongs to a single reader
  Message.belongsTo(User, {
    foreignKey: 'user_id',
  });

module.exports = {User, Message};