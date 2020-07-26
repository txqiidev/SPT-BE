const express = require('express')
const adminDB = require('../db/adminDB')
const { validate } = require('../services/validation/admin/module')
const auth = require('../middleware/authenticator')
const admin = require('../middleware/admin')

const router = express.Router()

router.get('/all/:id', async (req, res) => {
  try {
    let results = await adminDB.modulesAll(req.params.id)
    res.json(results)
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    let results = await adminDB.moduleOne(req.params.id)
    res.json(results)
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message)
  }
})

router.get('/PrerequisiteModules/:id', async (req, res) => {
  try {
    let results = await adminDB.prerequisiteModules(req.params.id)
    res.json(results)
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message)
  }
})

router.put('/URL', [auth, admin], async (req, res) => {
  const { error } = validate.validateURL(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    let results = await adminDB.moduleUpdateURL(req.body.id, req.body.url)
    res.json(results)
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message)
  }
})

router.put('/HasPrerequisite', [auth, admin], async (req, res) => {
  const { error } = validate.validateHasPrerequisite(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    let results = await adminDB.moduleUpdateHasPrerequisite(
      req.body.id,
      req.body.hasPrerequisite
    )
    res.json(results)
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message)
  }
})

router.post('/Prerequisite', [auth, admin], async (req, res) => {
  const { error } = validate.validatePrerequisite(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    let results = await adminDB.moduleAddPrerequisite(
      req.body.id,
      req.body.idPrerequisite
    )
    res.json(results)
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message)
  }
})

router.delete('/Prerequisite', [auth, admin], async (req, res) => {
  const { error } = validate.validatePrerequisite(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    let results = await adminDB.deletePrerequisite(
      req.body.id,
      req.body.idPrerequisite
    )
    res.json(results)
  } catch (error) {
    res.status(error.response.status)
    return res.send(error.message)
  }
})

module.exports = router
