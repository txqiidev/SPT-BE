const express = require("express");
const adminDB = require("../db/adminDB");
const { validate } = require("../services/validation/admin/module");
const auth = require("../middleware/authenticator");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

const router = express.Router();

router.get(
  "/all/:id",
  asyncMiddleware(async (req, res) => {
    let results = await adminDB.modulesAll(req.params.id);
    res.json(results);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    let results = await adminDB.moduleOne(req.params.id);
    res.json(results);
  })
);

router.get(
  "/PrerequisiteModules/:id",
  asyncMiddleware(async (req, res) => {
    let results = await adminDB.prerequisiteModules(req.params.id);
    res.json(results);
  })
);

router.put(
  "/URL",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validateURL(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let results = await adminDB.moduleUpdateURL(req.body.id, req.body.url);
    res.json(results);
  })
);

router.put(
  "/HasPrerequisite",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validateHasPrerequisite(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let results = await adminDB.moduleUpdateHasPrerequisite(
      req.body.id,
      req.body.hasPrerequisite
    );
    res.json(results);
  })
);

router.post(
  "/Prerequisite",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validatePrerequisite(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let results = await adminDB.moduleAddPrerequisite(
      req.body.id,
      req.body.idPrerequisite
    );
    res.json(results);
  })
);

router.delete(
  "/Prerequisite",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const { error } = validate.validatePrerequisite(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let results = await adminDB.deletePrerequisite(
      req.body.id,
      req.body.idPrerequisite
    );
    res.json(results);
  })
);

module.exports = router;
