const inquirer = require("inquirer");
const mysql = require('mysql2')
const sqlFunc = require("../util/sql")

function start (pass) {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "start",
                choices: ["Add Information", "Update Information", "View Information", "Quit"]
            }
        ]).then(startAns => {
            if (startAns.start === "Add Information") {
                addInfo(pass)
            }
            if (startAns.start === "Update Information") {
                console.log(startAns.start)
            }
            if (startAns.start === "View Information") {
                console.log(startAns.start)
            }
            if (startAns.start === "Quit") {
                console.log("Goodbye")
                pass.end()
            }
        })
}

function addInfo (pass) {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What do you want to add?",
                name: "addInfoChoice",
                choices: ["Department", "Role", "Employee", "Go Back", "Quit"]
            }
        ]).then(addInfoAns => {
            if (addInfoAns.addInfoChoice === "Department") {
                addDept(pass)
            }
            if (addInfoAns.addInfoChoice === "Role") {
                addRole(pass)
            }
            if (addInfoAns.addInfoChoice === "Employee") {
                console.log(addInfoAns.addInfoChoice)
            }
            if (addInfoAns.addInfoChoice === "Go Back") {
                start(pass)
            }
            if (addInfoAns.addInfoChoice === "Quit") {
                console.log("Goodbye")
                pass.end()
            }
        })
}

function addDept (pass) {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "deptName"
            }
        ]).then(deptNameAns => {
            pass.query("INSERT INTO department (name) VALUES (" + `"`
            + deptNameAns.deptName + `"` + ")")
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Do you want to enter another department?",
                        name: "anotherDept",
                        choices: ["Yes","No"]
                    }
                ]).then(anotherDeptAns => {
                    if (anotherDeptAns.anotherDept === "Yes") {
                        addDept(pass)
                    }
                    if (anotherDeptAns.anotherDept === "No") {
                        addInfo(pass)
                    }
                })
        })
}

function addRole (pass) {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What department is the role a part of?",
                name: "roleDept",
                choices: ["Maybe"]
            }
        ]).then(addRoleAns => {
            console.log(addRoleAns)
            console.log(sqlFunc.getDepartments(pass))
        })
}

module.exports = {
    start,
}