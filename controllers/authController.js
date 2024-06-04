const bcrypt = require('bcrypt');
const { User } = require('../models');
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Registering user:', username);
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      req.flash('error', 'Username already exists.');
      console.log('Username already exists');
      return res.redirect('/auth/register');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    req.flash('success', 'Thank you for signing up!');
    console.log('User registered successfully');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error registering new user:', error);
    res.status(500).send('Error registering new user.');
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Attempting login for:', username);
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      req.session.username = user.username;
      req.flash('success', 'Successfully logged in.');
      console.log('User logged in successfully:', username);
      res.redirect('/chat');
    } else {
      req.flash('error', 'Invalid credentials.');
      console.log('Invalid credentials for:', username);
      res.redirect('/auth/login');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.redirect('/chat');
    }
    res.redirect('/auth/login');
  });
};