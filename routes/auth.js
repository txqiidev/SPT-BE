const express = require("express");
const bcrypt = require("bcrypt");
const { validate } = require("../services/validation/user/user");
const userDB = require("../db/userDB");

const router = express.Router();

module.exports = router;
