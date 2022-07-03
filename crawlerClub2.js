const cheerio = require('cheerio')
const fs = require('fs')
const { service, dateFormat, Queue } = require('./utils')
const { League } = require('./class')
const {
  qiutanHeaders
} = require('./config/league')
global.serial = '2255'
global.name = '萨普斯堡'
service({
  methods: 'GET',
  url: `http://zq.titan007.com/jsData/teamInfo/teamDetail/tdl${global.serial}.js?version=${dateFormat(new Date().getTime(), 'YYYYMMDDHH')}`,
  headers: qiutanHeaders
}).then((res) => {
  eval(res.data)
  // rearguard 后卫 vanguard 前锋 goalkeeper 门将 midfielder 中场
  let players = parsePlayer(rearguard, vanguard, goalkeeper, midfielder, lineupDetail)
  return players
}).then(async (players) => {
  // 组一个请求队列
  const sub_urls = []
  players.forEach(item => {
    const obj = {}
    const url = `http://zq.titan007.com/jsData/playerInfo/player${item.serial}.js?version=${dateFormat(new Date().getTime(), 'YYYYMMDDHH')}`
    const playerHeaders = {
      'Referer': `http://zq.titan007.com/cn/team/player/${global.serial}/${item.serial}.html`,
      'Host': 'zq.titan007.com'
    }
    obj.url = url
    obj.playerHeaders = playerHeaders
    sub_urls.push(obj)
  })
  // 分别请求
  var add = (function () {
    var counter = 0
    return function () { return counter += 1 }
  })()
  const queue = new Queue(null)
  for (let i = 0; i < sub_urls.length; i++) {
    await delay(() => {
      service({
        methods: 'GET',
        url: sub_urls[i].url,
        headers: sub_urls[i].playerHeaders
      }).then(res => {
        const serial = Number(res.config.url.split('.js').shift().split('player').pop())
        for (let k = 0; k < players.length; k++) {
          if (players[k].serial == serial) {
            let club = ''
            if (res.data.split('nowTeamInfo').pop().split('twoYear').shift().split("'")[1].trim() === global.name) {
              console.log(players[k].name)
              club = res.data.split('nowTeamInfo').pop().split('twoYear').shift().split("'")[15].trim()
              console.log('club =', club)
            }else {
              console.log(players[k].name)
              club = res.data.split('nowTeamInfo').pop().split('twoYear').shift().split("'")[1].trim()
              console.log('club =', club)
            } 
            players[k].club = club
            break
          }
        }
        if (add() === sub_urls.length) {
          const standardPlayers = outputPlayer(players)
          console.log('清除了', global.serial, '.json')
          fs.writeFileSync(`./${global.serial}.json`, JSON.stringify(standardPlayers), 'utf8')
        }
      }).catch(err => {
        if (add() === sub_urls.length) {
          const standardPlayers = outputPlayer(players)
          console.log('清除了', global.serial, '.json')
          fs.writeFileSync(`./${global.serial}.json`, JSON.stringify(standardPlayers), 'utf8')
        }
      })
    }, 1)
  }
})

function parsePlayer (rearguard, vanguard, goalkeeper, midfielder, lineupDetail) {
  const players = []
  let mapObj = {}
  goalkeeper.forEach(item => {
    const obj = {}
    obj.number = Number(item[1])
    obj.name = item[2]
    obj.ename = item[4]
    obj.attrDes = "GK"
    players.push(obj)
  })
  rearguard.forEach(item => {
    const obj = {}
    obj.number = Number(item[1])
    obj.name = item[2]
    obj.ename = item[4]
    obj.attrDes = "DF"
    players.push(obj)
  })
  midfielder.forEach(item => {
    const obj = {}
    obj.number = Number(item[1])
    obj.name = item[2]
    obj.ename = item[4]
    obj.attrDes = "MF"
    players.push(obj)
  })
  vanguard.forEach(item => {
    const obj = {}
    obj.number = Number(item[1])
    obj.name = item[2]
    obj.ename = item[4]
    obj.attrDes = "FW"
    players.push(obj)
  })
  players.forEach((item, index) => {
    mapObj[item.name] = index
  })
  for (let i = 0; i < lineupDetail.length; i++) {
    if (lineupDetail[i][8] === '主教练') continue
    // 找网页
    const serial = lineupDetail[i][0]
    // 找号码
    const number = Number(lineupDetail[i][1].trim())
    // 找名字
    const name = lineupDetail[i][2].trim()
    // 找年龄
    const age = new Date().getFullYear() - lineupDetail[i][5].trim().split('-')[0]
    // 找身高
    const height = Number(lineupDetail[i][6].trim())
    // 找国籍
    const nation = lineupDetail[i][9].trim()
    // 根据名字找Players数组下标
    if (mapObj.hasOwnProperty(name)) {
      const idx = mapObj[name]
      if (players[idx].number === number) {
        players[idx].serial = serial
        players[idx].age = age
        players[idx].height = height
        players[idx].nation = nation
      }
    }
  }
  // 输出
  players.forEach(item => {
    console.log(item.serial, item.name, item.nation, item.attrDes, item.number, item.age, item.height, item.ename)
  })
  return players
}

function outputPlayer (players) {
  // 标准化返回
  const standardPlayers = []
  players.forEach(item => {
    const obj = {}
    obj.name = item.name
    obj.club = item.club
    obj.nation = item.nation
    obj.stats = 0
    obj.position = [""]
    obj.staff = item.attrDes
    obj.attr = item.attrDes
    obj.attrDes = item.attrDes
    obj.caps = 0
    obj.lineups = 0
    obj.age = item.age
    obj.number = item.number
    obj.height = item.height
    obj.ename = item.ename
    standardPlayers.push(obj)
  })
  return standardPlayers
}

function delay (fn, time) {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      fn && resolve(fn())
    }, time * 1000)
  })
}