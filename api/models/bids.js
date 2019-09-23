const Sequelize = require('sequelize');
const Users = require('./users');
const Items = require('./Items');

const sequelize = require('./model')

const Bids = sequelize.define('bids', {

bid_amount: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
}, {
   timestamps: true
});
Bids.belongsTo(Users);
Bids.belongsTo(Items);

//sequelize.sync().then(() => console.log('Db Connection OK, Bids Table Ready')).catch(err => console.log("DB Err Bids: ", err));

module.exports = Bids;
