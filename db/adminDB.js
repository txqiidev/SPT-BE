const mysql = require("mysql");
const pool = require("./index");

let stpdbAdmin = {};

stpdbAdmin.all = () => {
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

module.exports = stpdbAdmin;
