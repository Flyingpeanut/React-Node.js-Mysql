var Sequelize = require('sequelize');

const db = require('./model')

var User = db.define('users', {
    user_id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
    },
    last_name: {
        type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    mail: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    aproved: {
      type: Sequelize.BOOLEAN,
    },
    AFM: {
      type: Sequelize.INTEGER ,
    },
    seller_rating: {
      type: Sequelize.INTEGER ,
    },
    bider_rating: {
      type: Sequelize.INTEGER ,
    },
},
{
  freezeTableName: true // Model tableName will be the same as the model name
});

/*User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'

});
}*/
module.exports = User
