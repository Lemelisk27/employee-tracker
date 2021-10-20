const departments = require("../db/department.json")
const {generateID} = require("./generateID")
const fs = require("fs")

//Adds a new department

function newDept (resp) {
    for (let i = 0; i < departments.length; i++) {
        if (departments[i].name === resp.departName) {
            console.log("This Department Already Exists!")
            return
        }      
    }
    const newDept = {
        name: resp.departName,
        id: generateID()
    }
    departments.push(newDept)
    fs.writeFile('./db/department.json',JSON.stringify(departments,null,4),
    function (error) {
        if (error) {
            console.log(error)
        }
    })
}

module.exports = {
    newDept,
}