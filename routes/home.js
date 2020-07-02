const express = require('express')

const router = express.Router()

// parameters 1. path 2. callback function with req & resp
router.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = router
