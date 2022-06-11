const { service } = require('./utils')
const cheerio = require('cheerio')
const fs = require('fs')
// http://zq.titan007.com/analysis/2127351sb.htm
const BASE_URL = 'http://zq.titan007.com/jsData/'
const leagueCode = '25'
const season = '2022'
const qiutanHeaders = {
  'Referer': `http://zq.titan007.com/cn/${season.indexOf('-') > -1 ? 'League/' + leagueCode : 'SubLeague/' + leagueCode}.html`,
  'Host': 'zq.titan007.com'
}
let object = {
  history: [],
  hostRecent: [],
  awayRecent: [],
  hostFuture: [],
  awayFuture: []
}
service({
  methods: 'GET',
  url: 'http://zq.titan007.com/analysis/2127351sb.htm',
  headers: qiutanHeaders
}).then(res => {
  const $ = cheerio.load(res.data)
  eval($('#webmain script').first().text())

  for (let i = 0; i < Math.min(h_data.length, 6); i++) {
    let obj = {}
    obj.hostTeam = cheerio.load(h_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.awayTeam = cheerio.load(h_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.score = h_data[i][8] + ':' + h_data[i][9]
    obj.odd = (-1 * h_data[i][11]) >= 0 ? '+' + (-1 * h_data[i][11]) : '' + (-1 * h_data[i][11])
    obj.matchTime = '20' + h_data[i][0]
    obj.league = h_data[i][2]
    object.hostRecent.push(obj)
    // console.log(h_data[i][0], h_data[i][2], cheerio.load(h_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), cheerio.load(h_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), h_data[i][8] + '-' + h_data[i][9], -1 * h_data[i][11])
  }

  for (let i = 0; i < Math.min(a_data.length, 6); i++) {
    let obj = {}
    obj.hostTeam = cheerio.load(a_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.awayTeam = cheerio.load(a_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.score = a_data[i][8] + ':' + a_data[i][9]
    obj.odd = (-1 * a_data[i][11]) >= 0 ? '+' + (-1 * a_data[i][11]) : '' + (-1 * a_data[i][11])
    obj.matchTime = '20' + a_data[i][0]
    obj.league = a_data[i][2]
    object.awayRecent.push(obj)
    // console.log(a_data[i][0], a_data[i][2], cheerio.load(a_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), cheerio.load(a_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), a_data[i][8] + '-' + a_data[i][9], -1 * a_data[i][11])
  }

  for (let i = 0; i < Math.min(v_data.length, 6); i++) {
    let obj = {}
    obj.hostTeam = cheerio.load(v_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.awayTeam = cheerio.load(v_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.score = v_data[i][8] + ':' + v_data[i][9]
    obj.odd = (-1 * v_data[i][11]) >= 0 ? '+' + (-1 * v_data[i][11]) : '' + (-1 * v_data[i][11])
    obj.matchTime = '20' + v_data[i][0]
    obj.league = v_data[i][2]
    object.history.push(obj)
    // console.log(v_data[i][0], v_data[i][2], cheerio.load(v_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), cheerio.load(v_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), v_data[i][8] + '-' + v_data[i][9], -1 * v_data[i][11])
  }

  let obj = new Object()
  $('#porlet_20>table>tbody>tr>td:first>TABLE>tbody>tr:gt(1)>td').each(function(n, i) {
    // 0-5 6-11 12-17 18-23 24-29 0 1 2 5
    if (n%6 === 0) {
      obj.matchTime = '2022-' + $(i).html().trim()
    } else if (n%6 === 1) {
      obj.league = $(i).html().trim()
    } else if (n%6 === 2) {
      let strArr = $(i).html().trim().split('-')
      obj.hostTeam = strArr[0].trim()
      obj.awayTeam = strArr[1].trim()
    } else if (n%6 === 5) {
      obj.day = $(i).html().trim()
      object.hostFuture.push(obj)
      obj = new Object()
    }
  })
  $('#porlet_20>table>tbody>tr>td:last>TABLE>tbody>tr:gt(1)>td').each(function(n, i) {
    // 0-5 6-11 12-17 18-23 24-29 0 1 2 5
    if (n%6 === 0) {
      obj.matchTime = '2022-' + $(i).html().trim()
    } else if (n%6 === 1) {
      obj.league = $(i).html().trim()
    } else if (n%6 === 2) {
      let strArr = $(i).html().trim().split('-')
      obj.hostTeam = strArr[0].trim()
      obj.awayTeam = strArr[1].trim()
    } else if (n%6 === 5) {
      obj.day = $(i).html().trim()
      object.hostFuture.push(obj)
      obj = new Object()
    }
  })
  for (let key in object) {
    for (let i = 0; i < object[key].length; i++) {
      console.log(object[key][i].matchTime, object[key][i].league, object[key][i].hostTeam, object[key][i].score, object[key][i].awayTeam, object[key][i].odd, object[key][i].day)
    }
  }
})
