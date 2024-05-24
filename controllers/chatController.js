const { Message, User } = require('../models');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({ include: User });
    res.json(messages);
  } catch (error) {
    res.status(500).send('Error retrieving messages.');
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.session.userId;
    const message = await Message.create({ content, userId });
    res.json(message);
  } catch (error) {
    res.status(500).send('Error creating message.');
  }
};

