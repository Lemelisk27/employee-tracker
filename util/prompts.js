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
                updateInfo()
            }
            if (startAns.start === "Delete Information") {
                deleteInfo()
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
                addRole()
            }
            if (newAddAns.newAdd === "Employee") {
                addEmp()
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
                console.log("Department Added")
                addInfo()
            })
        })
}

const addRole = () => {
    db.query(`select name from department`,(err,data)=>{
        if (err) {
            console.log
        }
        else {
            const tempArray = []
            for (let i = 0; i < data.length; i++) {
                tempArray.push(data[i].name)                
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "What department is the role a part of?",
                        name: "roleDept",
                        choices: tempArray
                    },
                    {
                        type: "input",
                        message: "What is the title of the new role?",
                        name: "roleTitle"
                    },
                    {
                        type: "input",
                        message: "What is the salary for the new role?",
                        name: "roleSalary"
                    }
                ]).then((roleDeptAns)=>{
                    db.query(`SELECT id FROM department where name = "${roleDeptAns.roleDept}"`,(err,data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else {
                            db.query(`INSERT INTO role (title,salary,department_id) VALUES ("${roleDeptAns.roleTitle}","${roleDeptAns.roleSalary}",${data[0].id})`,(err,data) => {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log("Role Added")
                                    addInfo()
                                }
                            })
                        }
                    })
                })
        }
    })
}

const addEmp = () => {
    db.query(`SELECT title FROM role`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            const tempArray = []
            for (let i = 0; i < data.length; i++) {
                tempArray.push(data[i].title)                
            }
            db.query(`SELECT id, CONCAT(first_name," ",last_name) AS name FROM employee WHERE manager_id IS NULL`,(err,data)=> {
                if (err) {
                    console.log(err)
                }
                else {
                    const mgrArray = ["None"]
                    const newArray = []
                    for (let i = 0; i < data.length; i++) {
                        mgrArray.push(data[i].name)
                        newArray.push(data[i])
                    }
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Please select a role for the new employee.",
                                name: "empRole",
                                choices: tempArray
                            },
                            {
                                type: "input",
                                message: "What is their first name?",
                                name: "empFirst"
                            },
                            {
                                type: "input",
                                message: "What is their last name?",
                                name: "empLast"
                            },
                            {
                                type: "list",
                                message: "Who is their manager?",
                                name: "empMgr",
                                choices: mgrArray
                            }
                        ]).then((empAns) => {
                            let mgrId = null
                            for (let i = 0; i < newArray.length; i++) {
                                if (newArray[i].name === empAns.empMgr) {
                                    mgrId = newArray[i].id
                                }                          
                            }
                            db.query(`SELECT id FROM role WHERE title = "${empAns.empRole}"`,(err,data)=>{
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ("${empAns.empFirst}","${empAns.empLast}",${data[0].id},${mgrId})`,(err,data) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            console.log("Employee Added")
                                            addInfo()
                                        }
                                    })
                                }
                            })
                        })

                }
            })
        }
    })
}

const updateInfo = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to update?",
                name: "update",
                choices: ["Department","Role","Employee","Go Back","Quit"]                
            }
        ]).then((updateAns) => {
            if (updateAns.update === "Department") {
                upDept()
            }
            if (updateAns.update === "Role") {
                upRole()
            }
            if (updateAns.update === "Employee") {
                upEmp()
            }
            if (updateAns.update === "Go Back") {
                start()
            }
            if (updateAns.update === "Quit") {
                console.log("Goodbye")
                db.end()
            }
        })
}

const upDept = () => {
    const tempArray = []
    const deptArray = []
    db.query(`SELECT * FROM department`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                tempArray.push(data[i].name)                
                deptArray.push(data[i])
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which department do you want to update?",
                        name: "deptUp",
                        choices: tempArray
                    },
                    {
                        type: "input",
                        message: "What do you want the new department name to be?",
                        name: "deptName"
                    }
                ]).then((deptUpAns)=>{
                    let deptID
                    for (let i = 0; i < deptArray.length; i++) {
                        if (deptUpAns.deptUp === deptArray[i].name) {
                            deptID = deptArray[i].id
                        }
                    }
                    db.query(`UPDATE department SET name = "${deptUpAns.deptName}" WHERE id = ${deptID}`,(err,data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(`Department name changed to: ${deptUpAns.deptName}`)
                            start()
                        }
                    })
                })
        }
    })
}

const upRole = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Would would you like to change about this Role?",
                name: "upRoleChange",
                choices: ["Name","Salary","Assigned Department","Go Back","Quit"]
            }
        ]).then((upRoleAns)=>{
            if (upRoleAns.upRoleChange === "Name") {
                upRoleName()
            }
            if (upRoleAns.upRoleChange === "Salary") {
                upRoleSalary()
            }
            if (upRoleAns.upRoleChange === "Assigned Department") {
                upRoleDept()
            }
            if (upRoleAns.upRoleChange === "Go Back") {
                updateInfo()
            }
            if (upRoleAns.upRoleChange === "Quit") {
                console.log("Goodbye")
                db.end()
            }
        })
}

const upRoleName = () => {
    const roleArray = []
    const roleNameArray = []
    db.query(`SELECT id, title FROM role`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i])
                roleNameArray.push(data[i].title)
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which role do you want to change?",
                        name: "roleChoice",
                        choices: roleNameArray
                    },
                    {
                        type: "input",
                        message: "What do you want to change the name to?",
                        name: "newRoleName"
                    }
                ]).then((roleNameAns)=>{
                    let selectRole
                    for (let i = 0; i < roleArray.length; i++) {
                        if (roleNameAns.roleChoice === roleArray[i].title) {
                            selectRole = roleArray[i].id
                        }
                    }
                    db.query(`UPDATE role SET title = "${roleNameAns.newRoleName}" WHERE id = ${selectRole}`,(err,data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(`Role name updated to: ${roleNameAns.newRoleName}`)
                            start()
                        }
                    })
                })
        }
    })
}

const upRoleSalary = () => {
    const roleArray = []
    const roleNameArray = []
    db.query(`SELECT id, title FROM role`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                roleArray.push(data[i])
                roleNameArray.push(data[i].title)
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which role do you want to change?",
                        name: "roleChoice",
                        choices: roleNameArray
                    },
                    {
                        type: "input",
                        message: "What do you want to change the salary to?",
                        name: "roleSalary"
                    }
                ]).then((roleSalaryAns) => {
                    let roleID
                    for (let i = 0; i < roleArray.length; i++) {
                        if (roleSalaryAns.roleChoice === roleArray[i].title) {
                            roleID = roleArray[i].id
                        }
                    }
                    db.query(`UPDATE role SET salary = ${roleSalaryAns.roleSalary} WHERE id = ${roleID}`,(err,data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(`${roleSalaryAns.roleChoice}'s salary changed to: ${roleSalaryAns.roleSalary}`)
                            start()
                        }
                    })
                })
        }
    })
}

const upRoleDept = () => {
    const deptArray = []
    const deptNameArray = []
    db.query(`SELECT * FROM department`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                deptArray.push(data[i])
                deptNameArray.push(data[i].name)
            }
            const roleArray = []
            const roleNameArray = []
            db.query(`SELECT id, title FROM role`,(err,data)=>{
                if (err) {
                    console.log(err)
                }
                else {
                    for (let i = 0; i < data.length; i++) {
                        roleArray.push(data[i])
                        roleNameArray.push(data[i].title)
                    }
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Which role do you want to change?",
                                name: "roleChange",
                                choices: roleNameArray
                            },
                            {
                                type: "list",
                                message: "Which departemnt do you want to assign it to?",
                                name: "roleDept",
                                choices: deptNameArray
                            }
                        ]).then((roleDeptAns) => {
                            let deptID
                            let roleID
                            for (let i = 0; i < deptArray.length; i++) {
                                if (roleDeptAns.roleDept === deptArray[i].name){
                                    deptID = deptArray[i].id
                                }
                            }
                            for (let i = 0; i < roleArray.length; i++) {
                                if (roleDeptAns.roleChange === roleArray[i].title) {
                                    roleID = roleArray[i].id
                                }
                            }
                            db.query(`UPDATE role SET department_id = ${deptID} WHERE id = ${roleID}`,(err,data)=>{
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log(`${roleDeptAns.roleChange} changed to the ${roleDeptAns.roleDept} department.`)
                                    start()
                                }
                            })
                        })
                }
            })
        }
    })
}

const upEmp = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What do you want to change about this employee?",
                name: "empChange",
                choices: ["Name","Role","Manager","Go Back","Quit"]
            }
        ]).then((empChangeAns)=>{
            if (empChangeAns.empChange === "Name") {
                upEmpName()
            }
            if (empChangeAns.empChange === "Role") {
                upEmpRole()
            }
            if (empChangeAns.empChange === "Manager") {
                upEmpMgr()
            }
            if (empChangeAns.empChange === "Go Back") {
                updateInfo()
            }
            if (empChangeAns.empChange === "Quit") {
                console.log("Goodbye")
                db.end()
            }
        })
}

const upEmpName = () => {
    const empArray = []
    const empNameArray = []
    db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                empArray.push(data[i])
                empNameArray.push(data[i].name)
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which employee do you want to update?",
                        name: "empChange",
                        choices: empNameArray
                    },
                    {
                        type: "input",
                        message: "What's their first name?",
                        name: "empFirst"
                    },
                    {
                        type: "input",
                        message: "What's their last name?",
                        name: "empLast"
                    }
                ]).then((empNameAns)=>{
                    let empID
                    for (let i = 0; i < empArray.length; i++) {
                        if (empNameAns.empChange === empArray[i].name){
                            empID = empArray[i].id
                        }
                    }
                    db.query(`UPDATE employee SET first_name = "${empNameAns.empFirst}", last_name = "${empNameAns.empLast}" WHERE id = ${empID}`,(err,data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(`${empNameAns.empChange}'s name changed to ${empNameAns.empFirst} ${empNameAns.empLast}`)
                            start()
                        }
                    })
                })
        }
    })
}

const upEmpRole = () => {
    const empArray = []
    const empNameArray = []
    db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name, role_id AS role FROM employee`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                empArray.push(data[i])
                empNameArray.push(data[i].name)
            }
            const roleArray = []
            const roleNameArray = []
            db.query(`SELECT id, title FROM role`,(err,data)=>{
                if (err) {
                    console.log(err)
                }
                else {
                    for (let i = 0; i < data.length; i++) {
                        roleArray.push(data[i])
                        roleNameArray.push(data[i].title)
                    }
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Which employee do you want to change?",
                                name: "empChange",
                                choices: empNameArray
                            },
                            {
                                type: "list",
                                message: "What do you want to change their role to?",
                                name: "empRole",
                                choices: roleNameArray
                            }
                        ]).then((empRoleAns)=>{
                            let empID
                            for (let i = 0; i < empArray.length; i++) {
                                if (empRoleAns.empChange === empArray[i].name) {
                                    empID = empArray[i].id
                                }
                            }
                            let roleID
                            for (let i = 0; i < roleArray.length; i++) {
                                if (empRoleAns.empRole === roleArray[i].title) {
                                    roleID = roleArray[i].id
                                }
                            }
                            db.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${empID}`,(err,data)=>{
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log(`${empRoleAns.empChange}'s role changed to ${empRoleAns.empRole}`)
                                    start()
                                }
                            })
                        })
                }
            })
        }
    })
}

const upEmpMgr = () => {
    const mgrArray = []
    const mgrNameArray = []
    db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id IS NULL`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                mgrArray.push(data[i])
                mgrNameArray.push(data[i].name)
            }
            const empArray = []
            const empNameArray = []
            db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee`,(err,data)=>{
                if (err) {
                    console.log(err)
                }
                else {
                    for (let i = 0; i < data.length; i++) {
                        empArray.push(data[i])
                        empNameArray.push(data[i].name)
                    }
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Which employee do you want to change?",
                                name: "empChange",
                                choices: empNameArray
                            },
                            {
                                type: "list",
                                message: "Which manager do you want to assign this employee to?",
                                name: "empMgr",
                                choices: mgrNameArray
                            }
                        ]).then((empMgrAns)=>{
                            let empID
                            for (let i = 0; i < empArray.length; i++) {
                                if (empMgrAns.empChange === empArray[i].name) {
                                    empID = empArray[i].id
                                }
                            }
                            let mgrId
                            for (let i = 0; i < mgrArray.length; i++) {
                                if (empMgrAns.empMgr === mgrArray[i].name) {
                                    mgrId = mgrArray[i].id
                                }
                            }
                            db.query(`UPDATE employee SET manager_id = ${mgrId} WHERE id = ${empID}`,(err,data)=>{
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log(`${empMgrAns.empChange} is now assigned to ${empMgrAns.empMgr}`)
                                    start()
                                }
                            })
                        })
                }
            })
        }
    })
}

const deleteInfo = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What do you want to delete?",
                name: "delChoice",
                choices: ["Department","Role","Employee","Go Back","Quit"]
            }
        ]).then((delChoiceAns)=>{
            if (delChoiceAns.delChoice === "Department") {
                delDept()
            }
            if (delChoiceAns.delChoice === "Role") {
                console.log(delChoiceAns.delChoice)
            }
            if (delChoiceAns.delChoice === "Employee") {
                console.log(delChoiceAns.delChoice)
            }
            if (delChoiceAns.delChoice === "Go Back") {
                start()
            }
            if (delChoiceAns.delChoice === "Quit") {
                console.log("Goodbye")
                db.end()
            }
        })
}

const delDept = () => {
    const deptArray = []
    const deptNameArray = []
    db.query(`SELECT * FROM department`,(err,data)=>{
        if (err) {
            console.log(err)
        }
        else {
            for (let i = 0; i < data.length; i++) {
                deptArray.push(data[i])
                deptNameArray.push(data[i].name)
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which department do you want to delete?",
                        name: "delDept",
                        choices: deptNameArray
                    }
                ]).then((delDeptAns)=>{
                    const newArray = []
                    db.query(`SELECT name FROM department WHERE name NOT IN ("${delDeptAns.delDept}")`,(err,data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else {
                            for (let i = 0; i < data.length; i++) {
                                newArray.push(data[i].name)
                            }
                            inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        message: "If there are any roles assigned to this department which department do you want to assign them to?",
                                        name: "newDept",
                                        choices: newArray
                                    },
                                    {
                                        type: "list",
                                        message: "Are you sure you want to delete this department?",
                                        name: "deptConfirm",
                                        choices: ["Yes","No"]
                                    }
                                ]).then((newDeptAns)=>{
                                    if (newDeptAns.deptConfirm === "No") {
                                        console.log("No changes made.")
                                        deleteInfo()
                                    }
                                    else {
                                        let newDeptId
                                        let delDeptId
                                        for (let i = 0; i < deptArray.length; i++) {
                                            if(newDeptAns.newDept === deptArray[i].name){
                                                newDeptId = deptArray[i].id
                                            }
                                        }
                                        for (let i = 0; i < deptArray.length; i++) {
                                            if (delDeptAns.delDept === deptArray[i].name) {
                                                delDeptId = deptArray[i].id
                                            }
                                        }
                                        db.query(`UPDATE role SET department_id = ${newDeptId} WHERE department_id = ${delDeptId}`,(err,data)=>{
                                            if (err) {
                                                console.log(err)
                                            }
                                            else {
                                                db.query(`DELETE FROM department WHERE id = ${delDeptId}`,(err,data)=>{
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log(`The ${delDeptAns.delDept} department has been deleted. Roles re-assigned to ${newDeptAns.newDept}.`)
                                                        start()
                                                    }
                                                })
                                            }
                                        })                                      
                                    }
                                })
                        }
                    })
                })
        }
    })
}

module.exports = {
    start,
}