const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const Items = require('../models/Items');
const Bids = require('../models/bids');

const Categories= require('../models/categories');
const { ensureAuthenticated } = require('../config/auth');







router.get('/user', ensureAuthenticated, (req, res) => {
    console.log('user!!! get');
    //console.log(req.user)
    const id=req.user.id;
        User.findOne( {where:{id}})
        .then(users =>{
          console.log(users.dataValues.username);
            res.send({status:true, users: users})
        }).catch(err => {
            console.log(err);
            res.send({status:false, users:undefined})
        })
    //}
});















router.post('/add', ensureAuthenticated, (req, res, next) => {
    console.log('abiout time');
      console.log(req.body);
        console.log('!!!!!');
            console.log(req.user);
            console.log('!!!!!');
    const { name, description,  location, first_bid,buy_price } = req.body.posted_data;
  const { country,  id} = req.user

    Items.create({
      name, description, country, location, first_bid,buy_price,userId:id,curently:first_bid
    })
      //.then(gig => res.redirect('/profile'))
      .catch(err => console.log(err));
 });






router.get('/extra', ensureAuthenticated, (req, res, next) => {

        console.log('!!!!!get user');
            console.log(req.user);
            console.log('!!!!!');
  //  const { name, description,  location, first_bid,buy_price } = req.body.posted_data;
const id=req.user.id;



      Items.findAll({where: {userId:id }})
      .then(items =>{
          res.send({status:true, items: items})
      }).catch(err => {
          console.log(err);
          res.send({status:false, items:undefined})
      })
 });


 router.get('/ongoing', ensureAuthenticated, (req, res, next) => {
 const id=req.user.id;

       Items.findAll({where: {userId:id ,ongoing:1}})
       .then(items =>{
           res.send({status:true, items: items})
       }).catch(err => {
           console.log(err);
           res.send({status:false, items:undefined})
       })
  });


  router.get('/finished', ensureAuthenticated, (req, res, next) => {
  const id=req.user.id;

        Items.findAll({where: {userId:id ,ongoing:0,started:1}})
        .then(items =>{
            res.send({status:true, items: items})
        }).catch(err => {
            console.log(err);
            res.send({status:false, items:undefined})
        })
   });









module.exports = router;
