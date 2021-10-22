const mysql = require('mysql2')
const util = require('util')

const testFunction = async () => {
    const first = await "first"
    console.log(first)
    const second = await "second"
    console.log(second)
}

// testFunction()

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'passw0rd',
      database: 'company_db'
    },
  );

const tempArray = []

const newTest = () => {
    db.query('SELECT name FROM department', function (err, results) {
        // console.log(results)
        for (let i = 0; i < results.length; i++) {
            tempArray.push(results[i].name)           
            // console.log(i)
        }
        console.log(tempArray)
        db.end()
    })
}

// console.log(tempArray)

const newTestProm = util.promisify(newTest)

newTestProm().then((tempArray)=>{
    console.log(tempArray)
})