const { User } = require('../models');
const socketIdToUserMap = new Map();
const addUser = (socketId, userId) => {
  socketIdToUserMap.set(socketId, userId);
};
const removeUser = (socketId) => {
  socketIdToUserMap.delete(socketId);
};
const getUser = async (socketId) => {
  const userId = socketIdToUserMap.get(socketId);
  if (!userId) return null;
  try {
    const user = await User.findByPk(userId);
    return user ? user.dataValues : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
module.exports = { addUser, removeUser, getUser };