const mysql = require("mysql");
const pool = require("./index");

let stpdbAdmin = {};

stpdbAdmin.modulesAll = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT Name, URL, HasPrerequisite FROM module",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

stpdbAdmin.studyprogrammeNames = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT idStudyProgramme,Name FROM studyprogramme",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = stpdbAdmin;
