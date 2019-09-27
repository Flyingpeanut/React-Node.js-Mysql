const Sequelize = require('sequelize');
const Items = require('./Items');
const sequelize = require('./model')



const Categories = sequelize.define('categories', {
  category: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true
    }

},{
   timestamps: false
});

const Middle = sequelize.define('middle', {


},{
   timestamps: false
});

sequelize.sync().then(() => console.log('Db Connection OK, Category Tables Ready')).catch(err => console.log("DB Err Items: ", err));

module.exports = {Categories,Middle}; ;
