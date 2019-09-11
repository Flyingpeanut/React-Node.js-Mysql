var express = require('express');
var router = express.Router();
const db = require('../schema/model')
const User = require('../schema/User')
/* GET users listing. */
router.get('/', function(req, res, next) {
    User.findAll()
    .then(data => {
        console.log(data)
        res.render('users', {page:'User', menuId:'users', content:'Hello world'})
    })
    .catch(err => console.log(err))

});

module.exports = router;
