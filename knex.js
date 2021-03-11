const config = require({
    client: "pg",
    connection: process.env.DATABASE_URL + "?sslmode=require",
  },)
const knex = require('knex')(config)

module.exports = knex