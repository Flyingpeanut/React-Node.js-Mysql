var Sequelize = require('sequelize');

const sequelize = new Sequelize('ted', 'jim', 'Eleoc123', {
  host: 'localhost',
  dialect: 'mysql',/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql'*/

  pool: {
    max: 5,
    min: 0,
    acquire: 8080,
    idle: 10000
  },
  timestamps: false

});

module.exports = sequelize;
