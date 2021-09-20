const express = require("express");
const app = express();
const db = require("./models");
const initRoutes = require("./routes/emission.routes");

global.__basedir = __dirname + "/..";

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

db.con.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

let port = 8080;
app.listen(process.env.PORT || port, () => {
  console.log(`Running at localhost:${port}`)});