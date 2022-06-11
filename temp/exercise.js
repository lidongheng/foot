// var add = (function () {
//   var counter = 0
//   return function () { return counter += 1 }
// })()

// console.log(add())
// console.log(add())
// console.log(add())
// var url = 'http://zq.titan007.com/jsData/playerInfo/player4160.js?version=2022060611'
// // url.split('.js')[0].split('player')[1]

// console.log(url.split('.js').shift().split('player').pop())
// var nowTeamInfo = [['托特纳姆热刺', '1  ', '守门员', '守门员', '守門員', 'Goalkeeper', 'Tottenham Hotspur'], ['法国', '1  ', '守门员', '守门员', '守門員', 'Goalkeeper', 'France']];
// var twoYear
global.a = 5
const fs = require('fs')
const path = require('path')
const data = fs.readFileSync(path.join(__dirname, '../player4160.js'), 'utf8')
// console.log(data)
console.log(data.split('nowTeamInfo').pop().split('twoYear').shift().split("'")[15].trim())
// console.log(data.split('nowTeamInfo').pop().split('twoYear').shift().split("'")[1].trim())
// console.log(data.split('nowTeamInfo').pop().split('twoYear').shift().split(";").shift().split("=").pop().trim())
// var nowTeamInfo = eval(data.split('nowTeamInfo').pop().split('twoYear').shift().split(";").shift().split("=").pop().trim())
// console.log(nowTeamInfo[1][0])
// let time = setInterval(() => {
//   for (let i = 0; i < 20; i++) {
//     console.log(i)
//     if (i === 19) clearInterval(time)
//   }
// }, 1000);

// console.log(global.a)


