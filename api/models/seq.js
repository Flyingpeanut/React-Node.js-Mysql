
const Sequelize = require('sequelize');

const db = require('./model')


const Items = require('./Items');
const Users = require('./users');
const Messages = require('./messages');
const Bids = require('./bids');
const {Categories,Middle} = require('./categories');

Bids.belongsTo(Users);
Bids.belongsTo(Items);
Middle.belongsTo(Items);
Middle.belongsTo(Categories);
Items.belongsTo(Users);
Users.hasMany(Bids, {foreignKey: 'userId'})
Users.hasMany(Items, {foreignKey: 'userId'})
Categories.hasMany(Middle, {foreignKey: 'categoryId'})
Items.hasMany(Middle, {foreignKey: 'itemId'})
Items.hasMany(Bids, {foreignKey: 'itemId'})
db.sync();
db.authenticate()
.then(() => console.log('connected'))
.catch(err => console.log('error: '+ err))
