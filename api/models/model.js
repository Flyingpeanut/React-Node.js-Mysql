var Sequelize = require('sequelize');

// put them in config file and import values!

module.exports = new Sequelize('ted', 'jim', 'Eleoc123', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
          timestamps: false
      },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

// Or you can simply use a connection uri
//var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
/*

});*/
