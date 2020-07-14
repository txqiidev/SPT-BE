const express = require("express");
const studentDB = require("../db/studentDB");

const router = express.Router();

router.get("/modules/:id", async (req, res, next) => {
  try {
    let results = await studentDB.modulesAll(req.params.id);
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.get("/modulegroups/:id", async (req, res, next) => {
  try {
    let results = await studentDB.moduleGroups(req.params.id);
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

module.exports = router;
