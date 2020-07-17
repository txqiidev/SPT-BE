const express = require("express");
const studentDB = require("../db/studentDB");
const auth = require("../middleware/authenticator");
const { validate } = require("../services/validation/student");

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

router.get("/plan/:id", [auth], async (req, res, next) => {
  try {
    let resultsPlan = await studentDB.plan(req.params.id);
    let resultsSemester = await studentDB.semester(req.params.id);

    let plan = [];

    for (const [key, value] of Object.entries(resultsPlan)) {
      plan.push({
        idSemester: key,
        modules: value.map(
          ({ Semester_idSemester, ...keepAttrs }) => keepAttrs
        ),
      });
    }

    resultsSemester
      .filter(
        (rs) =>
          !plan
            .map((sa) => parseInt(sa.idSemester))
            .includes(rs.Semester_idSemester)
      )
      .map((x) =>
        plan.push({
          idSemester: x.Semester_idSemester,
          modules: [],
        })
      );

    res.json(plan);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.post("/addToPlan", [auth], async (req, res) => {
  const { error } = validate.validatePlan(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let results = await studentDB.addToPlan(
      req.body.email,
      req.body.idSemester,
      req.body.idModule
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.delete("/deleteFromPlan", [auth], async (req, res) => {
  const { error } = validate.validatePlan(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let results = await studentDB.deleteFromPlan(
      req.body.email,
      req.body.idSemester,
      req.body.idModule
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.get("/semester/:id", [auth], async (req, res, next) => {
  try {
    let results = await studentDB.semester(req.params.id);
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.post("/addSemester", [auth], async (req, res) => {
  const { error } = validate.validatePlan(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let results = await studentDB.addSemester(
      req.body.email,
      req.body.idSemester
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.delete("/deleteSemester", [auth], async (req, res) => {
  const { error } = validate.validatePlan(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let results = await studentDB.deleteSemester(
      req.body.email,
      req.body.idSemester
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

router.put("/hasPassed", [auth], async (req, res) => {
  try {
    let results = await studentDB.hasPassed(
      req.body.email,
      req.body.idModule,
      req.body.hasPassed
    );
    res.json(results);
  } catch (error) {
    res.status(error.response.status);
    return res.send(error.message);
  }
});

module.exports = router;
