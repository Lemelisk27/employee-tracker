const mysql = require('mysql2')
const util = require('util');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'passw0rd',
        database: 'company_db'
    },
);

const newQuery = (sql) => {
    db.query(sql, function(err,results) {
        if (err) {
            throw(err)
        }
        else {
            // console.log(results)
            return results
        }
    })
}

// newQuery("select * from employee")

const newQueryProm = util.promisify(newQuery)

const waitEmployee = async () => {
    const employee = await newQueryProm("select * from employee")
    return employee
}

const newEmployee = waitEmployee()
console.log(newEmployee)