// 策略：关于最近6次交手、主队近6场和客队近6场、主队未来3场和客队未来3场。对战和近6场用JS数据，未来3场用解析器

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

// function getImageUrl (target_url, containerElement) {
//   let result_list = []
//   const res = await axios.get(target_url)
//   const html = res.data
//   const $ = cheerio.load(html)
//   const result_list = []
//   $(containerEelment).each((element) => {
//     result_list.push($(element).find('img').attr('src'))
//   })
//   return result_list
// }
// const $ = cheerio.load(data)
// console.log($('#webmain').text())

// var html = '<ul id="fruits"><li class="apple">Apple</li><li class="orange">Orange</li><li class="pear">Pear</li></ul><ul>haha</ul>'
// var $ = cheerio.load(html)
// $有啥方法？html xml text parseHTML root contains merge load
// html() -- 把你的这段string转成一个网页
// text() -- 提取你这段string的所有网页可见文字

// 选择器 $(selector, [context], [root])
// console.log($('li[class="orange"]').text())
// console.log($('.apple', '#fruits').text())
// console.log($('ul .pear').text())
// $('ul li').each(function(n, i) {
//   console.log(n)
//   console.log($(i).text())
// })
// console.log($('ul li').first().text())
// console.log($('ul').last().text())

// 属性 $(selector).attr(name, value)

const html = fs.readFileSync('./1.html', 'utf8')
const $ = cheerio.load(html)
eval($('#webmain script').first().text())
// console.log(h_data[0])
// 接着写！ 0 - 日期\ 2 - saishi\ 5 - zhudui\ 7 - kedui\ 8and9 - score 11 - pankou
// console.log(h_data[1])
// for (let i = 0; i < Math.min(h_data.length, 6); i++) {
//   console.log(h_data[i][0], h_data[i][2], cheerio.load(h_data[i][5]).text().trim(), cheerio.load(h_data[i][7]).text().trim(), h_data[i][8] + '-' + h_data[i][9], -1 * h_data[i][11])
// }

// console.log(v_data[1])
// for (let i = 0; i < Math.min(v_data.length, 6); i++) {
//   console.log(v_data[i][0], v_data[i][2], cheerio.load(v_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), cheerio.load(v_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), v_data[i][8] + '-' + v_data[i][9], -1 * v_data[i][11])
// }
// console.log(v_data[1][7])
// console.log(cheerio.load(v_data[1][7])('span').first().html().replace(/<.*>*<.*>|\s/g, ""))
let str = ''
$('#porlet_20>table>tbody>tr>td:first>TABLE>tbody>tr:gt(1)>td').each(function(n, i) {
  // 0-5 6-11 12-17 18-23 24-29 0 1 2 5
  if (n%6 !== 3 && n%6 !== 4) {
    str = str + $(i).html().trim()
  }
  if (n%6 === 5) {
    console.log(str)
    str = ''
  }
})
str = ''
$('#porlet_20>table>tbody>tr>td:last>TABLE>tbody>tr:gt(1)>td').each(function(n, i) {
  // 0-5 6-11 12-17 18-23 24-29 0 1 2 5
  if (n%6 !== 3 && n%6 !== 4) {
    str = str + $(i).html().trim()
  }
  if (n%6 === 5) {
    console.log(str)
    str = ''
  }
})