const express = require('express');
const router = express.Router();
const { User } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users.');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found.');
    }
  } catch (error) {
    res.status(500).send('Error retrieving user.');
  }
});

module.exports = router;
