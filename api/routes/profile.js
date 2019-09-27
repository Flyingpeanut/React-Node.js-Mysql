const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('../models/users');
const Items = require('../models/Items');
const Bids = require('../models/bids');
const  {Categories, Middle} = require('../models/categories');

const { ensureAuthenticated } = require('../config/auth');







router.get('/user', ensureAuthenticated, (req, res) => {
    console.log('user!!! get');
    console.log(req.user)
    //const {id} = req.user;
        User.findOne( {where:{id}})
        .then(users =>{
            if (!users) {
                return res.send({status:false, users: undefined})
            }
          console.log(users.dataValues);
            res.send({status:true, users: users.dataValues})
        }).catch(err => {
            console.log(err);
            res.send({status:false, users:undefined})
        });
});

router.post('/create',ensureAuthenticated, (req, res) => {
    console.log('profile!!! create');
    console.log(req.body)
    console.log(req.user);
    const {userId, country} = req.user;
    const location =req.user.address
    const {buy_price, categories, description, first_bid, itemName} = req.body

    let categoriesArray = categories.toLowerCase().split(' ');

    //first create categories if not found
     Categories.findAll({where:{
         category:{[Op.or] : categoriesArray}
     }})
        .then(duplicates =>{
            let categoriesInDb = duplicates.map(dup => {return dup.dataValues.category  })
            let filtered = categoriesArray.filter((cat) =>{ return categoriesInDb.indexOf(cat) < 0 })
            let bulkCreateObject = filtered.map(cat =>{ return {category:cat}})
            Categories.bulkCreate(bulkCreateObject)
                   .then(() =>{
                           return Categories.findAll({where:{
                               category:{[Op.or] : categoriesArray}
                           }})
                           .then((userCategories) =>{
                               let newItem = {buy_price, categories, description, first_bid,
                                      name:itemName ,userId, location, country}

                                            console.log(newItem);                      //create Item
                               return Items.create(newItem)
                                    .then((created)=>{
                                        console.log(created);
                                        let itemId = created.id
                                        let middleBulkCreateArray =  userCategories.map((cat) =>{
                                                return {itemId, categoryId: cat.dataValues.id}
                                        })
                                        console.log(created);
                                        // connect item with its categories
                                        return Middle.bulkCreate(middleBulkCreateArray).then(()=>{
                                                res.send({status:true})
                                        })

                               })

                           })
                   })

        }).catch(err =>{
            console.log(err);
            res.send({status:false})

        })
    /*   */
    /// 2nd createItem
    /// bind item with categories
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
