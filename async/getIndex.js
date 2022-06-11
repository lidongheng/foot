const cheerio = require('cheerio')
const request = require('axios')

function delay (fn, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn && resolve(fn())
    }, time * 1000)
  })
}

async function loadIndex (time) {
  const html = await delay(() => request('https://blog.yaojunrong.com'), time)
  const $ = cheerio.load(html)
  const readMoreLinks = []
  $('.read-more').each((_index, item) => {
    readMoreLinks.push($(item).attr('href'));
  })
  return readMoreLinks
}

async function loadOne (href) {
  return await request(href)
}

exports.delay = delay
exports.loadIndex = loadIndex
exports.loadOne = loadOne
