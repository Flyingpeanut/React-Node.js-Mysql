const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/users');
const Items = require('../models/Items');

const { forwardAuthenticated } = require('../config/auth');

router.get('/', function(req, res, next) {
    console.log('get search');
    console.log(req.params);
    Items.findAll({where:{ongoing:true}})
    .then((items) => {
        console.log(items);
        res.send({status:true, items})
    })
    .catch(err => {
        console.log(err);
        res.send({status:false, items:[], msg:'Bad request'})
    })

});

router.post('/',function(req, res, next) {
    console.log('post search');
    res.send({status: true})
});

module.exports = router;
