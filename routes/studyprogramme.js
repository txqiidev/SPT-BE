const express = require("express");
const adminDB = require("../db/adminDB");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let results = await adminDB.studyprogrammeNames();
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

module.exports = router;
