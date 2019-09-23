const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const User = require('../models/users');
const { ensureAuthenticated } = require('../config/auth');



function checkAdmin(req, res, next){
    console.log('alo');
    console.log(req.user);
    const {username, mail, name, last_name, admin, id} = req.user
    if (!admin)    return res.send({status:false, users:undefined})
    User.findOne({where:{username,mail,name,last_name,id,admin:true}})
    .then(user =>{

        if (!user) {
            return res.send({status:false, users:undefined})
        }
        return next()
    }).catch(err => {
        console.log(err);
        return res.send({status:false, users:undefined})
    })
}
// Login Page
router.get('/admin', [ensureAuthenticated, checkAdmin], (req, res) => {
    console.log('admin get');
    console.log(req.user)
    //if (req.user.username === 'hi') {
    //
        User.findAll( {attributes:{exclude:['password']}})
        .then(users =>{
            res.send({status:true, users: users})
        }).catch(err => {
            console.log(err);
            res.send({status:false, users:undefined})
        })
    //}
});

// Register Page
router.post('/admin', [ensureAuthenticated, checkAdmin], (req, res) => {

    console.log(req.user);
    console.log('admin post');

    console.log(req.body.userdata);
    User.update(
        {aproved: true},
        {where:{id : req.body.userdata.id}}
    )
    .then(rowsUpdated =>{
        res.send({status:true})
    }).catch(err => {
        console.log(err);
        res.send({status:false})
    })
});


router.get('/profile', ensureAuthenticated, (req, res) => {
    console.log('profile get');
    console.log(req.user)
    res.send('ok');
});

router.post('/profile', ensureAuthenticated, (req, res) => {
    console.log('profile post');

    console.log(req.user)
    res.send('ok');
});

module.exports = router;
