const mysql = require('mysql')
require('dotenv').config()

// Config of the Study Planning Tool DB
const dbConfig = {
  connectionLimit: 10, // default 10
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
}

// Connection pool to reuse connections and enhance the performance of executing commands.
const pool = mysql.createPool(dbConfig)

module.exports = pool
