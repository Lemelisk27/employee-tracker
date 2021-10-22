const {titleScreen} = require("./util/title")
const prompts = require("./util/prompts")
const mysql = require('mysql2')

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'passw0rd',
      database: 'company_db'
    },
);

titleScreen()

prompts.start()