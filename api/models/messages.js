const Sequelize = require('sequelize');
const Users = require('./users');
const sequelize = require('./model')



const Messages = sequelize.define('messages', {
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },auctioneer_id: {
      type: Sequelize.INTEGER,
      references: {
     model: Users,
     key: 'id'
   },
      allowNull: false}

},
{
   timestamps: true
});
Messages.belongsTo(Users);
//sequelize.sync().then(() => console.log('Db Connection OK, Messages Table Ready')).catch(err => console.log("DB Err Items: ", err));
module.exports = Messages; ;
