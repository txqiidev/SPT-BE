const mysql = require("mysql");
const pool = require("./index");

let stpdbAdmin = {};

stpdbAdmin.modulesAll = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT idModule, Name, URL, HasPrerequisite FROM module ${
        id !== "All" ? "WHERE StudyProgramme_idStudyProgramme = ?" : ""
      }`,
      id,
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbAdmin.prerequisiteModules = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT p.Module_idModule_Prerequisite as idModule, m.Name FROM prerequisite_module as p JOIN module as m on p.Module_idModule_Prerequisite = m.idModule WHERE p.Module_idModule = ?",
      id,
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbAdmin.moduleOne = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT idModule, Name, URL, HasPrerequisite FROM module where idModule = ?",
      id,
      (err, results) => (err ? reject(err) : resolve(results[0]))
    );
  });
};

stpdbAdmin.moduleUpdateURL = (id, url) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE module SET URL=? where idModule = ?",
      [url, id],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbAdmin.moduleUpdateHasPrerequisite = (id, hasPrerequisite) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE module SET HasPrerequisite = ? where idModule = ?",
      [hasPrerequisite, id],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbAdmin.moduleAddPrerequisite = (id, idPrerequisite) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO prerequisite_module (Module_idModule, Module_idModule_Prerequisite) VALUES (?, ?)",
      [id, idPrerequisite],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbAdmin.deletePrerequisite = (id, idPrerequisite) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM prerequisite_module WHERE Module_idModule = ? AND Module_idModule_Prerequisite = ?",
      [id, idPrerequisite],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

module.exports = stpdbAdmin;
