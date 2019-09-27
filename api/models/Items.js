const Sequelize = require('sequelize');
const Users = require('./users');
const sequelize = require('./model')




const Items = sequelize.define('items', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(1234),
    allowNull: false
  },location: {
    type: Sequelize.STRING,
    allowNull: false
  },country: {
    type: Sequelize.STRING,
    allowNull: false
},num_of_bids: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },curently: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },buy_price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },first_bid: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },ongoing: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
   },started: {
    type: Sequelize.DATE,
    defaultValue: null,
    },ended: {
    type: Sequelize.DATE,
    defaultValue: null,
  },finished: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
},{
   timestamps: true
});
Items.belongsTo(Users);
sequelize.sync().then(() => console.log('Db Connection OK, Items Table Ready')).catch(err => console.log("DB Err Items: ", err));

module.exports = Items;
