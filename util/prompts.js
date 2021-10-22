const inquirer = require("inquirer");
const mysql = require('mysql2')
var columnify = require('columnify')

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'passw0rd',
      database: 'company_db'
    },
);

const start = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "start",
                choices: ["View Information","Add Information","Update Information","Delete Information","Quit"]
            }
        ]).then((startAns) => {
            if (startAns.start === "View Information") {
                firstView()
            }
            if (startAns.start === "Add Information") {
                addInfo()
            }
            if (startAns.start === "Update Information") {
                console.log(startAns.start)
            }
            if (startAns.start === "Delete Information") {
                console.log(startAns.start)
            }
            if (startAns.start === "Quit") {
                console.log("Goodbye")
                db.end()
            }
        })
}

const firstView = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to view?",
                name: "firstView",
                choices: ["Departments","Roles","Employees","Go Back","Quit"]
            }
        ]).then((firstViewAns) => {
            if (firstViewAns.firstView === "Departments") {
                db.query(`SELECT id AS ID, name AS Department FROM department`,(err,data) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("  ")
                        console.log(columnify(data))
                        console.log("  ")
                        firstView()
                    }
                })
            }
            if (firstViewAns.firstView === "Roles") {
                db.query(`SELECT role.id AS ID, role.title as "Job Title", department.name AS Department, role.salary AS Salary
                FROM role
                JOIN department ON role.department_id = department.id`,(err,data) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("  ")
                        console.log(columnify(data))
                        console.log("  ")
                        firstView()
                    }
                })
            }
            if (firstViewAns.firstView === "Employees") {
                db.query(`SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee,role.title AS "Job Title",department.name AS Department,role.salary AS Salary,CONCAT(e.first_name, " ", e.last_name) as Manager
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee e ON employee.manager_id = e.id;`,(err,data) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("  ")
                        console.log(columnify(data))
                        console.log("  ")
                        firstView()
                    }
                })
            }
            if (firstViewAns.firstView === "Go Back") {
                start()
            }
            if (firstViewAns.firstView === "Quit") {
                console.log("Goodbye")
                db.end()
            }
        })
}

const addInfo = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to add?",
                name: "newAdd",
                choices: ["Department","Role","Employee","Go Back","Quit"]
            }
        ]).then((newAddAns) => {
            if (newAddAns.newAdd === "Department") {
                addDept()
            }
            if (newAddAns.newAdd === "Role") {
                console.log(newAddAns.newAdd)
            }
            if (newAddAns.newAdd === "Employee") {
                console.log(newAddAns.newAdd)
            }
            if (newAddAns.newAdd === "Go Back") {
                start()
            }
            if (newAddAns.newAdd === "Quit") {
                console.log("Goodbye")
                db.end()
            }
        })
}

const addDept = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the new department?",
                name: "newDept"
            }
        ]).then((newDeptAns) => {
            db.query(`INSERT INTO department (name) VALUES ("${newDeptAns.newDept}")`,(err,data) => {
                if (err) {
                    console.log(err)
                }
                addInfo()
            })
        })
}

module.exports = {
    start,
}