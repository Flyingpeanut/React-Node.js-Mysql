const Sequelize = require('sequelize');

const sequelize = require('./model')

const Users = sequelize.define('users', {

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false
  },seller_rating: {
    type: Sequelize.INTEGER
  },bider_rating: {
    type: Sequelize.INTEGER
  },username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true
  },password: {
    type: Sequelize.STRING,
    allowNull: false
  },address: {
    type: Sequelize.STRING,
    allowNull: false

  },mail: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
            isEmail: true
        }
  },country: {
    type: Sequelize.STRING,
    allowNull: false
  },aproved: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue:false
  },have_messg: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue:false
  },admin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue:false
  },AFM: {
    type: Sequelize.BIGINT(11),
    allowNull: false
  }
}, {
   timestamps: false
});


//sequelize.sync().then(() => console.log('Db Connection OK, Users Table Ready')).catch(err => console.log("DB Err Users: ", err));

module.exports = Users;
