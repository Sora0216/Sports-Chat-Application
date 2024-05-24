const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });

    req.flash('success', 'Thank you for signing up!');

    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error registering new user:', error); 
    res.status(500).send('Error registering new user.');
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      res.redirect('/chat');
    } else {
      res.status(401).send('Invalid credentials.');
    }
  } catch (error) {
    res.status(500).send('Error logging in.');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
};
