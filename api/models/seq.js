
const Sequelize = require('sequelize');

const db = require('./model')


const Items = require('./Items');
const Users = require('./users');
const Messages = require('./messages');
const Bids = require('./bids');
const Categories = require('./categories');

db.sync();
db.authenticate()
.then(() => console.log('connected'))
.catch(err => console.log('error: '+ err))
