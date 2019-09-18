var express = require('express');
var router = express.Router();
//const {ensureAuthenticated} = require('../config/auth')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});
router.get('/dashboard',function(req, res, next) {

  res.render('dashboard',{username: req.user.name});
});

module.exports = router;
