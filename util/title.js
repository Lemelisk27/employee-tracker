const figlet = require('figlet');

function titleScreen () {
    console.log(figlet.textSync('EMPLOYEE', {
        font: 'big'
    }));
    console.log(figlet.textSync('MANAGER', {
        font: 'big'
    }));
}

module.exports = {
    titleScreen,
}