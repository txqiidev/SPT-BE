const mysql = require("mysql");
const pool = require("./index");

let stpdbAdmin = {};

stpdbAdmin.modulesAll = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT idModule, Name, URL, HasPrerequisite FROM module",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

stpdbAdmin.moduleOne = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT URL FROM module where idModule = ?",
      id,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

stpdbAdmin.moduleUpdateURL = (id, url) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE module SET URL=? where idModule = ?",
      [url, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

stpdbAdmin.moduleUpdateHasPrerequisite = (id, hasPrerequisite) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE module SET HasPrerequisite = ? where idModule = ?",
      [hasPrerequisite, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

stpdbAdmin.moduleAddPrerequisite = (id, idPrerequisite) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO prerequisite_module (Module_idModule, Module_idModule_Prerequisite) VALUES (?, ?)",
      [id, idPrerequisite],
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
