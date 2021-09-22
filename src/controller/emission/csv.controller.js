const db = require("../../models");
const Emission = db.emissions;
const sequelize = db.sequelize;

const fs = require("fs");
const csv = require("fast-csv");

const upload = async (req, res) => {
  var obj = {};
  try {
    let emissions = [];
    let path = __basedir + "/resources/static/assets/greenhouse_cleaned.csv";

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        console.log(row)
        emissions.push(row);
      })
      .on("end", () => {
        Emission.bulkCreate(emissions)
          .then(() => {
              console.log('Imported the data successfully')
              obj.success = true
              obj.size = data.length
              obj.MESSAGE = "Imported the data successfully"

              res.send(obj)
          })
          .catch((error) => {
            obj.success = false
            obj.size = data.length
            obj.MESSAGE = "Failed to import the data."

            console.log('Failed to import the data ')
            console.log(error)
            res.send(obj)
        });
      });
  } catch (error) {
    console.log(error);
  }
};

const getEmissions = (req, res) => {
  var obj = {}
  Emission.findAll()
    .then((data) => {
      obj.success = true
      obj.size = data.length
      obj.MESSAGE = "Fetched whole table contents"
      obj.data = data

      res.status(200).send(obj);
    })
    .catch((err) => {
      obj.success = false
      obj.MESSAGE = err.message || "Some error occurred while retrieving data"

      res.send(obj)

      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while retrieving tutorials.",
      // });
    });
};

const getSpecificEmissions = (req, res) => {
    let id = req.params.id;
    let startYear = req.query.start;
    let endYear = req.query.end;
    let gases = req.query.gases
    let arr = gases.replace(' ', ' and ')
    console.log(arr)

    var obj = {}
    const sql = `
    SELECT country_or_area, year, value, category
    FROM emissions
    WHERE year BETWEEN :start AND :end AND ids = :ids AND category=:gas;
    `
    sequelize.query(sql,
    { replacements: { start: startYear, end: endYear, ids: id, gas: gases}, type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        obj.success = true
        obj.size = data.length
        obj.MESSAGE = "It worked"
        obj.data = data

        res.status(200).send(obj);
      })
      .catch((err) => {
        obj.success = false
        obj.MESSAGE = err.message || "Some error occurred while retrieving data"

        res.send(obj)

        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while retrieving data",
        // });
      });
  };

  const getCountries = (req, res) => {
    var obj = {}
    const sql = `
      WITH TEMP AS (
        SELECT
        country_or_area as ca,
        category as c,
        MAX(year) AS MAX_YEAR,
        MIN(year) AS MIN_YEAR
        FROM emissions
        GROUP BY country_or_area, category
        )
        SELECT country_or_area, ids, year, category FROM emissions 
        inner join TEMP
        ON (year =  TEMP.MIN_YEAR OR year = TEMP.MAX_YEAR) AND country_or_area = TEMP.ca and category = TEMP.c
      `
    sequelize.query(sql, {model: Emission})
      .then((data) => {

        obj.success = true
        obj.size = data.length
        obj.MESSAGE = "It worked"
        obj.data = data

        res.send(obj);
      })
      .catch((err) => {
        obj.success = false
        obj.MESSAGE = err.message || "Some error occurred while retrieving data"

        res.status(200).send(obj);

        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while retrieving data",
        // });
      });
  };
  

module.exports = {
  upload,
  getEmissions,
  getSpecificEmissions,
  getCountries
};
