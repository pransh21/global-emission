const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const con = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
});

const db = {};

db.Sequelize = Sequelize;
db.con = con;

db.emissions = require("./emissions.model.js")(con, Sequelize);

module.exports = db;