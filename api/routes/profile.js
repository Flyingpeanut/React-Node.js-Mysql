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
                               let newItem = {buy_price, categories, description,curently:first_bid, first_bid,
                                      name:itemName ,userId:id, location:address, country}

                               return Items.create(newItem)
                                    .then((created)=>{
                                        let itemId = created.id
                                        let middleBulkCreateArray =  userCategories.map((cat) =>{
                                                return {itemId, categoryId: cat.dataValues.id}
                                        })
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

router.delete('/manage/:itemId',ensureAuthenticated, (req, res) => {
    console.log('delete');
    const {id} = req.user;
    const {itemId} = req.params;
    console.log(id,itemId);
    Items.destroy({where:{ id:itemId, userId:id, started :null}})
    .then((data)=>{
        Middle.destroy({where:{itemId:null}})
        .then( (info) =>{
            res.send({status:true})
        })
    }).catch(err =>{
        console.log(err);
        res.send({status:false, message: err})
    })
})

router.post('/manage/:itemId',ensureAuthenticated, (req, res) => {
    console.log('profile!!! post manage id');

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
    Items.update(finalObj,{where:{id:itemId, userId:id, started:null}})
            .then(([affectedCount, affectedRows])=>{
                //console.log(affectedCount);
                //console.log(affectedRows);
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


router.get('/fetch/startedAuction/:itemId',ensureAuthenticated, (req, res) => {
    console.log('profile!!! startedAuction');
    const {itemId} = req.params;
    const {id} = req.user;
    console.log(id, itemId);
    let curDate = new Date()
    Items.findAll({
        where:{
            id:itemId,
            userId:id,
            finished:false,
            ended:{[Op.gt]: curDate},
            started:{[Op.ne]: null},
        },
        include:[{
            model: Bids,
            required:true,
            include:[{
                model: User,
                required:true,
            }]
        },

    ]})
    .then((itemsInfo) => {
        console.log(itemsInfo);
        // reformat data from query
        if (!itemsInfo) {
                res.send({status:false, item:[],msg:'Nothing found'})
        }

        res.send({status:true, item:itemsInfo})
    })
    .catch(err => {
        console.log(err);
        res.send({status:false, item:[], msg:'Bad request'})
    })

})

router.get('/fetch/userActiveAuctions',ensureAuthenticated, (req, res) => {
    const {id} = req.user;
    let curDate = new Date()
    Items.findAll({where:{userId:id, finished:false,ended:{[Op.gt]: curDate}, started:{[Op.ne]: null},} })
    .then((itemsInfo) => {
        // reformat data from query
        console.log(itemsInfo);
        if (!itemsInfo) {
            res.send({status:false, auctions:[], msg:'No live auctions'})
        }

        res.send({status:true, auctions:itemsInfo})
    })
    .catch(err => {
        console.log(err);
        res.send({status:false, item:[], msg:'Bad request'})
    })
})


// joined rows have duplicated items for differenct categories
// return object array has distinct items with all their categories
function uniteCategoriesData(itemData){

    let prev_id = 0 // ids start at 1
    let data = []

    for (let i = 0; i < itemData.length; i++) {
        let cur_id = itemData[i].id

        if (prev_id === cur_id)             data[data.length - 1].categories.push(itemData[i].categories[0])

        else{
            data.push(itemData[i])
            prev_id = cur_id
        }
    }
    console.log(data);
    return data
}
    //s destructing query data !!
    // query return object to complicated
    // simplifies it !!
function destructureData(itemsInfo){
    let data = itemsInfo.map(itemInfo => {

        const  {
            item :{
                    dataValues: {
                        id,
                        name,
                        description,
                        location,
                        country,
                        num_of_bids,
                        curently,
                        first_bid,
                        buy_price,
                        user: {
                                dataValues:{
                                    username,
                                    seller_rating
                                }
                        },
                        bids

                    }
            },
            category:{
                    dataValues: {
                        category

                    }
            }
        } = itemInfo

        return {
                id,
                name,
                first_bid,
                description,
                location,
                country,
                num_of_bids,
                curently,
                buy_price,
                username,
                seller_rating,
                categories : [category],
                bids,
            }
    })
    return data
}

module.exports = router;
