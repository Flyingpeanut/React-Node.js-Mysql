
var express = require('express');
var router = express.Router();
const db = require('../schema/model')
const User = require('../schema/User')

/* GET users listing. */
router.get('/', function(req, res, next) {

    res.render('login', {page:'Register', menuId:'register', content:'Register plz'})

});
router.post('/', function(req, res, next) {
    console.log(req.body);
    let {username, password} = req.body.posted_data
    User.findOne({ where:{username, password }
    })
    .then(result => res.send('successful login'))
    .catch(err => console.error(err))
});
module.exports = router;
