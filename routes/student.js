const express = require("express");
const studentDB = require("../db/studentDB");
const auth = require("../middleware/authenticator");
const { validate } = require("../services/validation/student");
const asyncMiddleware = require("../middleware/async");

const router = express.Router();

router.get(
  "/modules/:id",
  asyncMiddleware(async (req, res) => {
    let results = await studentDB.modulesAll(req.params.id);
    res.json(results);
  })
);

router.get(
  "/modulegroups/:id",
  asyncMiddleware(async (req, res) => {
    let results = await studentDB.moduleGroups(req.params.id);
    res.json(results);
  })
);

router.get(
  "/plan/:id",
  [auth],
  asyncMiddleware(async (req, res) => {
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
  })
);

router.post(
  "/addToPlan",
  [auth],
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validatePlan(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let results = await studentDB.addToPlan(
      req.body.email,
      req.body.idSemester,
      req.body.idModule
    );
    res.json(results);
  })
);

router.delete(
  "/deleteFromPlan",
  [auth],
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validatePlan(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let results = await studentDB.deleteFromPlan(
      req.body.email,
      req.body.idSemester,
      req.body.idModule
    );
    res.json(results);
  })
);

router.get(
  "/semester/:id",
  [auth],
  asyncMiddleware(async (req, res) => {
    let results = await studentDB.semester(req.params.id);
    res.json(results);
  })
);

router.post(
  "/addSemester",
  [auth],
  asyncMiddleware(async (req, res) => {
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
  })
);

router.delete(
  "/deleteSemester",
  [auth],
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validatePlan(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let results = await studentDB.deleteSemester(
      req.body.email,
      req.body.idSemester
    );
    res.json(results);
  })
);

router.put(
  "/hasPassed",
  [auth],
  asyncMiddleware(async (req, res) => {
    let results = await studentDB.hasPassed(
      req.body.email,
      req.body.idModule,
      req.body.hasPassed
    );
    res.json(results);
  })
);

module.exports = router;
