const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validate } = require("../services/validation/user/user");
const userDB = require("../db/userDB");
const auth = require("../middleware/authenticator");
const asyncMiddleware = require("../middleware/async");

require("dotenv").config();

const router = express.Router();

router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    try {
      let user = await userDB.findUser(req.user);
      res.json(user);
    } catch (error) {
      res.status(error.response.status);
      return res.send(error.message);
    }
  })
);

router.post(
  "/registration",
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validateRegistration(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let results = await userDB.findUser(req.body);
    if (!results.length) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      let results = await userDB.addUser(req.body);

      if (req.body.isAdmin === 1) {
        const token = jwt.sign(
          {
            email: results.email,
            lastname: results.lastname,
            isAdmin: results.isAdmin,
          },
          process.env.PK
        );
        return res
          .header("x-auth-token", token)
          .header("access-control-expose-headers", "x-auth-token")
          .send(token);
      }
      if (req.body.isAdmin === 0) {
        let resultsStudent = await userDB.addStudent(req.body);
        const tokenStudent = jwt.sign(
          {
            email: resultsStudent.email,
            lastname: resultsStudent.lastname,
            isAdmin: resultsStudent.isAdmin,
            studyprogramme: resultsStudent.studyprogramme,
          },
          process.env.PK
        );
        return res
          .header("x-auth-token", tokenStudent)
          .header("access-control-expose-headers", "x-auth-token")
          .send(tokenStudent);
      }
    } else if (results[0].email === req.body.email) {
      return res.status(400).send("User already registered");
    }
  })
);

router.post(
  "/authentication",
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validateAuthentication(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let results = await userDB.findUser(req.body, true);
    if (!results.length) {
      return res.status(400).send("Invalid email or password.");
    } else if (results[0].email === req.body.email) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        results[0].PasswordHash
      );
      if (!validPassword) {
        return res.status(400).send("Invalid email or password.");
      } else {
        const token = jwt.sign(
          {
            email: results[0].email,
            lastname: results[0].Lastname,
            isAdmin: results[0].IsAdmin,
            studyprogramme:
              results[0].studyprogramme && results[0].studyprogramme,
          },
          process.env.PK
        );

        res.send(token);
      }
    }
  })
);

module.exports = router;
