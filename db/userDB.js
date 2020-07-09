const pool = require("./index");

let stpdbUser = {};

stpdbUser.findUser = (user, pw) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT email, Firstname, Lastname, IsAdmin ${
        pw ? ", PasswordHash" : ""
      } FROM User where email = ?`,
      user.email,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

stpdbUser.addUser = (user) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO User (email, Firstname, Lastname, IsAdmin, PasswordHash) VALUES (?, ?, ?, ?, ?)",
      [user.email, user.firstname, user.lastname, user.isAdmin, user.password],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(user);
      }
    );
  });
};

module.exports = stpdbUser;
