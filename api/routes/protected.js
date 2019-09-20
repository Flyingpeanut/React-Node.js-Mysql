const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');


// Login Page
router.get('/admin', ensureAuthenticated, (req, res) => {
    console.log('admin get');
    console.log(req.user)
    if (req.user.username === 'hi') {
    //    {attributes:{exclude:['password']}}
        User.findAll()
        .then(users =>{
            res.send({status:true, users: users})
        }).catch(err => {
            console.log(err);
            res.send({status:false, users:undefined})
        })
    }
});

// Register Page
router.post('/admin', ensureAuthenticated, (req, res) => {
    console.log('admin post');

    console.log(req.user)
    res.send('ok');
});


// Login Page
router.get('/profile', ensureAuthenticated, (req, res) => {
    console.log('profile get');
    console.log(req.user)
    res.send('ok');
});

// Register Page
router.post('/profile', ensureAuthenticated, (req, res) => {
    console.log('profile post');

    console.log(req.user)
    res.send('ok');
});

module.exports = router;
