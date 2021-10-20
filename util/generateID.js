//Creats a random 4 digit alphanumeric ID

const generateID = () => {
    const varArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9']
    idArray = []
    for (let i = 0; i < 4; i++) {
        const tempArray = varArray[Math.floor(Math.random()*varArray.length)]
        idArray.push(tempArray)
    }
    return idArray.join("")
  }

  module.exports = {
    generateID
  }