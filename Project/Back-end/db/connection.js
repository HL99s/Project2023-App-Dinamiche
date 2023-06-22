const {Client} = require('pg')

const db = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "rootuser",   //TODO: change to your password
    database: "dvdrental"
})

module.exports = {db};
