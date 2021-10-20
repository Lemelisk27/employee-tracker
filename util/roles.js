const roles = require("../db/roles.json")
const departments = require("../db/department.json")
const {generateID} = require("./generateID")
const fs = require("fs")

//Adds a new role

function newRole (resp) {
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === resp.roleName) {
            console.log("This Role Already Exists!")
            return
        }      
    }
    let deptID = ""
    for (let i = 0; i < departments.length; i++) {
        if (resp.roleDept === departments[i].name) {
            deptID = departments[i].id
        }
    }
    const newRole = {
        name: resp.roleName,
        salary: resp.roleSalary,
        departmentID: deptID,
        id: generateID()
    }
    roles.push(newRole)
    fs.writeFile('./db/roles.json',JSON.stringify(roles,null,4),
    function (error) {
        if (error) {
            console.log(error)
        }
    })
}

module.exports = {
    newRole,
}