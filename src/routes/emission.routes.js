const express = require("express");
const router = express.Router();
const csvController = require("../controller/emission/csv.controller");

let routes = (app) => {

  router.get("/upload", csvController.upload); //Seeds the initial DB

  router.get("/emissions", csvController.getEmissions); // gets all the data in db. 

  router.get("/countries", csvController.getCountries);

  router.get("/country/id=:id", csvController.getSpecificEmissions);

  app.use("/", router);
};

module.exports = routes;
