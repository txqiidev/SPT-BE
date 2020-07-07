const express = require("express");
const adminDB = require("../db/adminDB");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let results = await adminDB.all();
    console.log("alles ok");
    res.json(results);
  } catch (error) {
    console.log("error occured");
    res.status(error.response.status);
    return res.send(error.message);
  }

  // res.json({ test: "test" });
});

router.get("/:id", (req, res) => {
  //const course = course.find(c => c.id == parseInt(req.params.id))
  //if (!course) return res.status(404).send(`Module ${req.params.id} not found`)
  res.send(req.params.id);
});

router.post("/", (req, res) => {
  // req.body.name
  res.send(req.body.name);
});

router.put("/:id", (req, res) => {
  // Look up the course
  // if not exisiting, return 404
  // Validate course --> schema
  //if Invalid, return 400 - bad request
  //Everything is good --> update course --> module.name = req.body.name;
  //return the updated course
});

router.delete("/:id", (req, res) => {
  // Look up the course
  // if not exisiting, return 404
  // Delete
  // Return the same cours
});

module.exports = router;
