const express = require("express");
const adminDB = require("../db/adminDB");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let results = await adminDB.studyprogrammeNames();
    console.log("alles ok");
    res.json(results);
  } catch (error) {
    console.log("error occured");
    res.status(error.response.status);
    return res.send(error.message);
  }
});

module.exports = router;
