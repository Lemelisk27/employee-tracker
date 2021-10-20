const inquirer = require("inquirer")
const department = require("./util/department")
const roles = require("./util/roles")
const deptDB = require("./db/department.json")

start()

//Asks the user how they would like to start.

function start () {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "start",
                choices: ["Add Information", "Update Information", "Quit"]
            }
        ]).then(startAns => {
            if (startAns.start === "Add Information") {
                addInfo()
            }
            if (startAns.start === "Update Information") {
                console.log(startAns.start)
            }
            if (startAns.start === "Quit") {
                console.log("Goodbye")
            }
        })
}

//If the user selected add it asks them what kind of information they want to add.

function addInfo () {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to add?",
                name: "addInfo",
                choices: ["Add Department", "Add Role", "Add Employee", "Go Back", "Quit"]
            }
        ]).then(addInfoAns => {
            if (addInfoAns.addInfo === "Add Department") {
                addDept()
            }
            if (addInfoAns.addInfo === "Add Role") {
                addRole()
            }
            if (addInfoAns.addInfo === "Add Employee") {
                console.log(addInfoAns.addInfo)
            }
            if (addInfoAns.addInfo === "Go Back") {
                start()
            }
            if (addInfoAns.addInfo === "Quit") {
                console.log("Goodbye")
            }
        })
}

//Asks the user to name the new department.

function addDept () {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "departName"
            }
        ]).then(departNameAns => {
            department.newDept(departNameAns)
            start()
        })
}

//Asks the user the information for the new role.

function addRole () {
    const deptArray = []
    for (let i = 0; i < deptDB.length; i++) {
        deptArray.push(deptDB[i].name)        
    }
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "roleName"
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary"
            },
            {
                type: "list",
                message: "Which department does this role belong to?",
                name: "roleDept",
                choices: deptArray
            }
        ]).then(roleAns => {
            roles.newRole(roleAns)
            start()
        })
}