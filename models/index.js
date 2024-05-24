const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const User = require('./User')(sequelize, DataTypes);
const Message = require('./Message')(sequelize, DataTypes);

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync();

module.exports = { sequelize, User, Message };
