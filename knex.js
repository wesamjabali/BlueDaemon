const config = require({
    client: "pg",
    connection: process.env.DATABASE_URL + "?sslmode=require",
    migrations: {
      directory: __dirname + "/database/migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  },)
const knex = require('knex')(config)

module.exports = knex