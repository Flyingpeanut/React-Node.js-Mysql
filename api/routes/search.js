const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const Users = require('../models/users');
const Items = require('../models/Items');
const Bids  = require('../models/bids');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Categories, Middle} = require('../models/categories');

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');


router.get('/', function(req, res, next) {
    console.log('get search');

    const {searchField} = req.query
    console.log(searchField);
    let curDate = new Date();
    Middle.findAll({
        include:[{
            model: Items,
            required:true,
            where:{finished:false, ended:{[Op.gt]: curDate}, started:{[Op.ne]: null}, name:{[Op.like]:`%${searchField}%`}},
            include:[{
                model: Users,
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
        console.log(itemsInfo);
        let itemData = destructureData(itemsInfo)
        // throw away duplicated joined rows
        let categoriesUnited = uniteCategoriesData(itemData)
        res.send({status:true, items:categoriesUnited})
    })
    .catch(err => {
        console.log(err);
        res.send({status:false, items:[], msg:'Bad request'})
    })


});

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
                        buy_price,
                        user: {
                                dataValues:{
                                    username,
                                    seller_rating
                                }
                        },

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
                description,
                location,
                country,
                num_of_bids,
                curently,
                buy_price,
                username,
                seller_rating,
                categories : [category],
            }
    })
    return data
}


router.get('/singleItem',function(req, res, next) {
    console.log('singleItem');
    const {itemId} = req.query
    let curDate = new Date();
    Middle.findAll({
        include:[{
            model: Items,
            required:true,
            where:{id:itemId,finished:false, ended:{[Op.gt]: curDate}, started:{[Op.ne]: null},},
            include:[{
                model: Users,
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
        let itemData = destructureData(itemsInfo)
        // throw away duplicated joined rows
        let categoriesUnited = uniteCategoriesData(itemData)
        res.send({status:true, item:categoriesUnited[0]})
    })
    .catch(err => {
        console.log(err);
        res.send({status:false, items:[], msg:'Bad request'})
    })

})


router.post('/itemBid', ensureAuthenticated,function(req, res, next) {
    const {id} = req.user
    const {itemId, bidPrice} = req.body
    let curDate = new Date();
    Items.findAll({
        where: {id:itemId,
                finished:false,
                ended:{[Op.gt]: curDate},
                started:{[Op.ne]: null},
                curently:{[Op.lt]: bidPrice},
                userId:{[Op.ne]: id
            }}}).then( result =>{
            //not valid input
            if (!result) {
                return res.send({status: false})
            }
            Bids.create({bid_amount:bidPrice, userId:id, itemId})
            .then(task=>{
                if (task) {
                    Items.update(
                        {curently:bidPrice,
                            num_of_bids: Sequelize.literal(`num_of_bids+1`),},
                        {where:{id:itemId}}
                    ).then(updated =>{
                        if (updated) {
                            return res.send({status: true})
                        }
                        res.send({status: false})
                    })
                }
            })
        }).catch(err =>{
            console.log(err);
            res.send({status: false})
        })
});

router.post('/itemBuy', ensureAuthenticated, function(req, res, next) {
    const {id} = req.user
    const {itemId} = req.body
    let curDate = new Date();
    Items.findAll({
        where: {id:itemId,
            ended:{[Op.gt]: curDate},
            started:{[Op.ne]: null},
            finished:false,
            userId:{[Op.ne]: id
    }}}).then( result =>{
            //not valid input
            if (!result) {
                return res.send({status: false})
            }
            Bids.create({bid_amount:result[0].dataValues.curently, userId:id, itemId})
            .then(task=>{
                if (task) {
                    Items.update(
                        {curently:result[0].dataValues.curently,
                         finished:true,
                         num_of_bids: Sequelize.literal(`num_of_bids+1`),
                        },
                        {where:{id:itemId}}
                    ).then(updated =>{
                        if (updated) {
                            return res.send({status: true})
                        }
                        res.send({status: false})
                    })
                }
                else{
                    res.send({status: false})
                }
            })
        }).catch(err =>{
            console.log(err);
            res.send({status: false})
        })
});


module.exports = router;
