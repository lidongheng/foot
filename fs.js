const fs = require('fs')
// let obj = {
//   name: '李东恒',
//   age: 28,
//   height: 165,
//   weight: 60
// }
// fs.writeFileSync('./append.json', JSON.stringify(obj), 'utf8')
// fs.appendFileSync('./append.txt', 'efgh', 'utf8')
// let data = fs.readFileSync('./append.json', 'utf8')
// data = JSON.parse(data)
// data.company = '美的'
// fs.writeFileSync('./append.json', JSON.stringify(data), 'utf8')
const localData = JSON.parse(fs.readFileSync('./a.json', 'utf8'))
console.log(localData.nation['EuropeLeague']['法国'].players)