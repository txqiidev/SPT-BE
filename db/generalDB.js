const mysql = require("mysql");
const pool = require("./index");

let stpdbGeneral = {};

stpdbGeneral.studyprogrammeNames = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT idStudyProgramme,Name, Credits FROM studyprogramme",
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbGeneral.locations = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT l.idLocation, c.ZIP, c.Name FROM Location as l JOIN City as c on l.City_ZIP = c.ZIP",
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

module.exports = stpdbGeneral;
