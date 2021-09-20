const express = require("express");
const router = express.Router();
const csvController = require("../controller/emission/csv.controller");
// const upload = require("../middlewares/upload");

let routes = (app) => {
//   router.post("/upload", upload.single("file"), csvController.upload);

  router.post("/upload", csvController.upload);



  router.get("/emissions", csvController.getEmissions);


  router.get("/country/id", csvController.checkQueries);

  app.use("/api/csv", router);
};

module.exports = routes;
