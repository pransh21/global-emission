const db = require("../../models");
const Emission = db.emissions;
const sequelize = db.sequelize;

const fs = require("fs");
const csv = require("fast-csv");
var path = require('path');

const upload = async (req, res) => {
  var obj = {};
  try {
    let emissions = [];
    let p = __basedir + "/resources/static/assets/greenhouse_cleaned.csv";

    fs.createReadStream(p)
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
              obj.MESSAGE = "Imported the data successfully"

              res.status(200).send(obj)
          })
          .catch((error) => {
            obj.success = false
            obj.MESSAGE = "Failed to import the data. DB is not empty."

            console.log('Failed to import the data ')
            console.log(error)
            res.status(400).send(obj)
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
      // obj.success = true
      obj.size = data.length
      obj.MESSAGE = data.length > 0 ? "Fetched whole table contents" : "DB is empty. Please go to https://arcane-basin-50951.herokuapp.com/upload to seed the DB"
      obj.data = data

      res.status(200).send(obj);
    })
    .catch((err) => {
      obj.success = false
      obj.MESSAGE = err.message || "Some error occurred while retrieving data"

      res.status(400).send(obj)
    });
};

const getSpecificEmissions = (req, res) => {

    let code = req.params.id.toUpperCase();
    let startYear = req.query.start;
    let endYear = req.query.end;
    let gases = req.query.gases.toLowerCase();
    var obj = {};

    try{
      var gasArr = gases.split(',')
    }
    catch(err){
      console.log('Error in gases array')
    }

    if(!/^\d+$/.test(startYear) || !/^\d+$/.test(endYear)){
      obj.success = false
      obj.MESSAGE = "Data not found for the given parameters. Please recheck input."
      return res.status(400).send(obj)
    }

    const sql = `
    SELECT *
    FROM emissions
    WHERE year BETWEEN :start AND :end AND code = :code AND category in (:gas) ORDER BY category;
    `
    sequelize.query(sql,
    { replacements: { start: startYear, end: endYear, code: code, gas: gasArr}, type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        obj.size = data.length
        obj.success = data.length > 0 ?  true : false
        obj.MESSAGE = data.length > 0 ? "Data has been retrieved" : "Data not found for the given parameters. Please recheck input."
        obj.data = data

        res.status(200).send(obj);
      })
      .catch((err) => {
        obj.success = false
        obj.MESSAGE = err.message || "Some error occurred while retrieving data"

        res.status(400).send(obj)
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
        SELECT country_or_area, code, year, category FROM emissions 
        inner join TEMP
        ON (year =  TEMP.MIN_YEAR OR year = TEMP.MAX_YEAR) AND country_or_area = TEMP.ca and category = TEMP.c
      `
    sequelize.query(sql, {model: Emission})
      .then((data) => {
        obj.size = data.length
        obj.success = data.length > 0 ? true : false
        obj.MESSAGE = data.length > 0 ? "Data has been retrieved" : "DB is empty. Please go to https://arcane-basin-50951.herokuapp.com/upload to seed the DB."
        obj.data = data

        res.status(200).send(obj);
      })
      .catch((err) => {
        obj.success = false
        obj.MESSAGE = err.message || "Some error occurred while retrieving data"
        res.status(400).send(obj);

      });
  };

const loadApiSpecFile = (req, res) => {
  res.send(
  `<html>
    <head>
        <script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </head>
    <body>
      <p>Hi there! Please click on the button below to display OpenAPI specification file.</p>
          <button id = "btn_download" style="background-color: #4CAF50">Display</button><br><br>
          <p>Please click on the button below to download project overview.</p>
          <button id = "btn_download1" style="background-color: #4CAF50">Download</button><br><br>

          <script type="text/javascript">
          $("#btn_download").click(function(){
              window.open('/display');
          })
          $("#btn_download1").click(function(){
            window.open('/download');
        })
        </script>
          <p>Also, please refer to the link below to get standard 2-letter country codes for api queries. (For European Union, it is assumed to be 'EU' for now).</p>
          <a href="https://www.nationsonline.org/oneworld/country_code_list.htm" target="_blank">Country Codes</a><br><br>
    </body>
  </html>`)

};

const displayApiSpecFile = (req, res) => {
  let p = "/resources/static/assets/apiSpecs.yaml";
  res.sendFile(path.resolve(__basedir + p));
};

const downloadOverview = (req, res) => {
  let p = "/resources/static/assets/blue-sky-documentation.doc";
  res.sendFile(path.resolve(__basedir + p));
};

module.exports = {
  upload,
  getEmissions,
  getSpecificEmissions,
  getCountries,
  loadApiSpecFile,
  displayApiSpecFile,
  downloadOverview
};
