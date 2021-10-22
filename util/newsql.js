const mysql = require('mysql2')
let serverRunning = true
const tempArray = []
let newArray = []

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'passw0rd',
        database: 'company_db'
    },
);

let departmentSelect = () => {
    db.query("SELECT name FROM department", function (err, results) {
        for (let i = 0; i < results.length; i++) {
            tempArray.push(results[i].name)                           
        }
    })
}

let getDepartments = (work) =>{
    return new Promise((resolve,reject)=>{
        if(serverRunning){
            setTimeout(()=>{
                resolve(work)
            },0500)
        }
        else {
            reject(console.log("The database isn't connected"))
        }
    })
}

getDepartments(departmentSelect())
.then(()=>{
    return getDepartments(console.log(tempArray))
})
.catch(()=>{
    console.log("Database not connected!")
})
.finally(()=>{
    db.end()
})