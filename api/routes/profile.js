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
    const {id, country, address} = req.user;
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
                                      name:itemName ,userId:id, location:address, country}

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

                               }).catch(err =>{
                                   console.log(err);
                                   res.send({status:false})

                               })

                           })
                   })

        }).catch(err =>{
            console.log(err);
            res.send({status:false})

        })

});


router.get('/manage',ensureAuthenticated, (req, res) => {
    console.log('profile!!! create');

    const {id} = req.user;
    console.log(req.user);
    Items.findAll({where:{userId:id,started:null},include:[Bids]})
            .then((auctions)=>{
                console.log(auctions);
                res.send({status:true, auctions})

            }).catch(err =>{
                console.log(err);
                res.send({status:false, auctions:[]})
            })

})


router.post('/manage/:itemId',ensureAuthenticated, (req, res) => {
    console.log('profile!!! post manage id');

    console.log(req.params);
    // fields user can edit
    const updateFields = [ 'name', 'description', 'first_bid', 'buy_price', 'categories', 'started', 'ended']
    const {id} = req.user;
    const {itemId} = req.params;
    const { name, description, first_bid, buy_price, categories, startDate, endDate} = req.body;
    const {body:{...updateObj}} = req
    let finalObj = {}
    for (let [key, value] of Object.entries(updateObj)) {
        if (updateFields.includes(key) && value !== '' && value !== undefined) {
            finalObj[key] = value
        }
    }
    console.log(finalObj);
    if ((!finalObj.started && finalObj.ended) || finalObj.started && !finalObj.ended) {
        return res.send({status:false, message: 'both dates are needed'})
    }
    console.log(req.user);
    Items.update(finalObj,{where:{id:itemId, userId:id, started:null}})
            .then(([affectedCount, affectedRows])=>{
                console.log(affectedCount);
                console.log(affectedRows);
                if (affectedCount > 0) {
                    return res.send({status:true})
                }
                return res.send({status:false, message: 'nothing to update ... weird'})

            }).catch(err =>{
                console.log(err);
                res.send({status:false, message: 'server error try again later'})
            })

})

router.get('/fetch/notStartedAuction/:itemId',ensureAuthenticated, (req, res) => {
    console.log('profile!!! notStartedAuction');
    const {itemId} = req.params;

    const {id} = req.user;
    console.log(id, itemId);
    Middle.findAll({
        include:[{
            model: Items,
            required:true,
            where:{id:itemId, userId:id, started:null },
            include:[{
                model: User,
                required:true,
            }]
        },
        {
            model: Categories,
            required:true
        },
    ]})
    .then((itemsInfo) => {
        // reformat data from query
        console.log(itemsInfo[0]);
        console.log('!!!!!!!!!!!!!!!!');
        console.log(itemsInfo[0].middle);

        res.send({status:true, item:itemsInfo})
    })
    .catch(err => {
        console.log(err);
        res.send({status:false, item:[], msg:'Bad request'})
    })

})






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
