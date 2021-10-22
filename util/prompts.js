const inquirer = require("inquirer");

function start () {
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
                addInfo()
            }
            if (startAns.start === "Update Information") {
                console.log(startAns.start)
            }
            if (startAns.start === "View Information") {
                console.log(startAns.start)
            }
            if (startAns.start === "Quit") {
                console.log("Goodbye")
            }
        })
}

function addInfo () {
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
                addDept()
            }
            if (addInfoAns.addInfoChoice === "Role") {
                console.log(addInfoAns.addInfoChoice)
            }
            if (addInfoAns.addInfoChoice === "Employee") {
                console.log(addInfoAns.addInfoChoice)
            }
            if (addInfoAns.addInfoChoice === "Go Back") {
                start()
            }
            if (addInfoAns.addInfoChoice === "Quit") {
                console.log("Goodbye")
            }
        })
}

function addDept () {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "deptName"
            }
        ]).then(deptNameAns => {
            console.log(deptNameAns.deptName)
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
                        addDept()
                    }
                    if (anotherDeptAns.anotherDept === "No") {
                        addInfo()
                    }
                })
        })
}

module.exports = {
    start,
}