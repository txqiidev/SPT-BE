const express = require("express");
const stpdbGeneral = require("../db/generalDB");
const asyncMiddleware = require("../middleware/async");

const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    let results = await stpdbGeneral.locations();
    res.json(results);
  })
);

module.exports = router;
