const express = require("express");
const router = express.Router();
const controller = require("../controller/emission/controller");

let routes = (app) => {

  router.get("/", controller.loadApiSpecFile);

  router.get("/display", controller.displayApiSpecFile);

  router.get("/download", controller.downloadOverview);

  router.get("/upload", controller.upload); //Seeds the initial DB

  router.get("/emissions", controller.getEmissions); // gets all the data in db. 

  router.get("/countries", controller.getCountries);

  router.get("/country/id=:id", controller.getSpecificEmissions);

  app.use("/", router);
};

module.exports = routes;
