// const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/db/pollution.db'
});

// const con = new Sequelize(dbConfig, {
//   dialect: 'sqlite',
//   operatorsAliases: false,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
// });

const db = {};

db.Sequelize = Sequelize;
// db.con = con;

db.sequelize = sequelize;

db.emissions = require("./emissions.model.js")(sequelize, Sequelize);

module.exports = db;