const db = require("../../models");
const Emission = db.emissions;

const fs = require("fs");
const csv = require("fast-csv");

const upload = async () => {
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
          })
          .catch((error) => {
            console.log('Failed to import the data ')
        });
      });
  } catch (error) {
    console.log(error);
  }
};

const getEmissions = (req, res) => {
  Emission.findAll()
    .then((data) => {
    //   res.send(data);

      console.log('***********YAHAN SE START HAI RESPONSE ******************************')
      // console.log(data[0].dataValues.country_or_area)
    //   res.send(data[1].dataValues.country_or_area);
      res.send(data);

    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

const checkQueries = (req, res) => {

    let id = req.query.start;
    let start = req.query.start;
    let end = req.query.end;

    Emission.findAll()
      .then((data) => {
      //   res.send(data);
  
        console.log('***********YAHAN SE START HAI RESPONSE ******************************')
        // console.log(data[0].dataValues.country_or_area)
        // res.send(data[1].dataValues.country_or_area);
        res.send(start + end);
  
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });
  };
  

module.exports = {
  upload,
  getEmissions,
  checkQueries
};
