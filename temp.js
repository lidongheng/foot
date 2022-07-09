const cheerio = require('cheerio')
const fs = require('fs')
const data = fs.readFileSync('./qiuyuan.html', 'utf8')

const $1 = cheerio.load(data)

// $1(`#matchBox2 .plays .home .playBox .play`).each(function(n, i) {
//     console.log($1(i).children().children('.name').children().text())
//     console.log($1(i).children().children().first().html().match(/1\.png/gi))
// })

$1(`#matchBox2 .backupPlay .home .play`).each(function(n, i) {
    console.log($1(i).children().children('.name').children().text())
    console.log($1(i).children().children().first().html().match(/1\.png/gi))
})

$1(`#matchBox2 .backupPlay .home .playBox .play`).each(function(n, i){
    let goal = 0, assist = 0
    let goalArr = $1(i).children().children().first().html().match(/1\.png/gi)
    let penaltyArr = $1(i).children().children().first().html().match(/7\.png/gi)
    let assistArr = $1(i).children().children().first().html().match(/12\.png/gi)
    if (goalArr) goal = goal + goalArr.length
    if (penaltyArr) goal = goal + penaltyArr.length
    if (assistArr) assist = assist + assistArr.length
    cosnole.log($1(i).children().children('.name').children().text())
  })