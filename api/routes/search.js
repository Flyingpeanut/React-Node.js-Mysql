const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const Users = require('../models/users');
const Items = require('../models/Items');
const {Categories, Middle} = require('../models/categories');

const { forwardAuthenticated } = require('../config/auth');

router.get('/', function(req, res, next) {
    console.log('get search');
    console.log(req.params);


    Middle.findAll({
        include:[{
            model: Items,
            required:true,
            where:{ongoing:true, started:true},
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
        console.log(categoriesUnited);
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

router.post('/',function(req, res, next) {
    console.log('post search');
    res.send({status: true})
});

module.exports = router;
