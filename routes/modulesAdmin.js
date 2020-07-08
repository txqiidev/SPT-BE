const express = require("express");
const Joi = require("joi");
const adminDB = require("../db/adminDB");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let results = await adminDB.modulesAll();
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
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

router.put("/URL", async (req, res) => {
  const schema = {
    id: Joi.string().required(),
    url: Joi.string().uri().required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  try {
    let results = await adminDB.moduleUpdateURL(req.body.id, req.body.url);
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.put("/HasPrerequisite", async (req, res) => {
  const schema = {
    id: Joi.string().required(),
    hasPrerequisite: Joi.required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  try {
    let results = await adminDB.moduleUpdateHasPrerequisite(
      req.body.id,
      req.body.hasPrerequisite
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.post("/Prerequisite", async (req, res) => {
  const schema = {
    id: Joi.string().required(),
    idPrerequisite: Joi.string().required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  try {
    let results = await adminDB.moduleAddPrerequisite(
      req.body.id,
      req.body.idPrerequisite
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.delete("/:id", (req, res) => {
  // Look up the course
  // if not exisiting, return 404
  // Delete
  // Return the same cours
});

module.exports = router;
