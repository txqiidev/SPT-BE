const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validate } = require("../services/validation/user/user");
const userDB = require("../db/userDB");
const auth = require("../middleware/authenticator");

require("dotenv").config();

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    console.log("this shit:", req.user);

    let user = await userDB.findUser(req.user);
    res.json(user);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.post("/registration", async (req, res) => {
  const { error } = validate.validateRegistration(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let results = await userDB.findUser(req.body);
    if (!results.length) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        let results = await userDB.addUser(req.body);
        const token = jwt.sign(
          {
            email: results.email,
            lastname: results.lastname,
            isAdmin: results.isAdmin,
          },
          process.env.PK
        );
        res.header("x-auth-token", token).send(results);
      } catch (error) {
        res.status(error.response.status);
        return res.send(error.message);
      }
    } else if (results[0].email === req.body.email) {
      return res.status(400).send("User already registered");
    }
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.post("/authentication", async (req, res) => {
  const { error } = validate.validateAuthentication(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
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
          },
          process.env.PK
        );

        res.send(token);
      }
    }
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

module.exports = router;
