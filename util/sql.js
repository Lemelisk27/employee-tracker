const mysql = require('mysql2')

const pass = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'passw0rd',
      database: 'company_db'
    },
  );

// db.query('SELECT name FROM department', function (err, results) {
//     for (let i = 0; i < results.length; i++) {
//         tempArray.push(results[i].name)
//     }
// })


function getDepartments (pass) {
    const tempArray = []
    pass.query("SELECT name FROM department", function (err, results) {
        // console.log(results)
        for (let i = 0; i < results.length; i++) {
            tempArray.push(results[i].name)                           
        }
        pass.end()
        // return tempArray
    })
    return tempArray
}

console.log(getDepartments(pass))
// getDepartments(pass)

module.exports = {
    getDepartments,
}