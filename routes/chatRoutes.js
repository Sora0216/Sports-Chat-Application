const express = require('express');
const router = express.Router();
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/auth/login');
};
router.get('/', isAuthenticated, (req, res) => {
  res.render('chat', { username: req.session.username });
});
module.exports = router;
