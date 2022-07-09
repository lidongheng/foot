const cheerio = require('cheerio')
const fs = require('fs')
const { service, bubbleSort } = require('./utils')
const {
  detailHeaders
} = require('./config/league')
const data = fs.readFileSync('./qiuyuan.html', 'utf8')
let rounds = fs.readFileSync('./s15_313.js', 'utf8')
var jh = []
eval(rounds)
function delay (fn, time) {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      fn && resolve(fn())
    }, time * 1000)
  })
}
const $ = cheerio.load(data)
const serial = 494
const matchArr = []
const team = {}
// 196 hengbin
// 先获取编号
// 我要遍历196号的所有
for (let i = 1; i < 21; i++) {
  for (let j = 0; j < jh['R_'+i].length; j++) {
    // 找到编号196的球队的match编号
    if (jh['R_'+i][j][4] === serial) {
      let obj = { status: 'home', matchSerial: jh['R_'+i][j][0], round: i }
      matchArr.push(obj)
    }
    if (jh['R_'+i][j][5] === serial) {
      let obj = { status: 'guest', matchSerial: jh['R_'+i][j][0], round: i }
      matchArr.push(obj)
    }
  }
}
// console.log(matchArr)
// 然后，一个个发请求
for (let i = 0; i < matchArr.length; i++) {
  delay(() => {
    service({
      methods: 'GET',
      url: `http://bf.titan007.com/detail/${matchArr[i].matchSerial}cn.htm`,
      headers: detailHeaders
    }).then(res => {
      // console.log(res.data)
      const $1 = cheerio.load(res.data)
      // 阵型
      let lineupNumber = $1(`#matchBox2>.teamNames .${matchArr[i].status}`).html().replace(/(<a.*?>[\s\S]*?<\/a>)/gi, '').trim()
      console.log(lineupNumber)
      console.log(matchArr[i].round)
      let lineupNumberArr = lineupNumber.split('-')
      let positionArr = []
      if (lineupNumber === '4-2-1-3') {
        positionArr = ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CDM', 'CAM', 'LW', 'ST', 'RW']
      } else if (lineupNumber === '4-2-3-1') {
        positionArr = ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CDM', 'LM', 'CAM', 'RM', 'ST']
      } else if (lineupNumber === '3-4-2-1') {
        positionArr = ['GK', 'LCB', 'CB', 'RCB', 'LB', 'CDM', 'CDM', 'RB', 'LM', 'RM', 'ST']
      } else if (lineupNumber === '4-3-3') {
        positionArr = ['GK', 'LB', 'CB', 'CB', 'RB', 'LB', 'CDM', 'RB', 'LW', 'ST', 'RW']
      } else if (lineupNumber === '3-5-2') {
        positionArr = ['GK', 'LCB', 'CB', 'RCB', 'LB', 'CM', 'CDM', 'CM', 'RB', 'ST', 'ST']
      } else if (lineupNumber === '3-4-3') {
        positionArr = ['GK', 'LCB', 'CB', 'RCB', 'LB', 'CDM', 'CDM', 'RB', 'LW', 'ST', 'RW']
      } else if (lineupNumber === '4-4-2') {
        positionArr = ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CDM', 'CDM', 'RM', 'ST', 'ST']
      } else if (lineupNumber === '3-3-2-2') {
        positionArr = ['GK', 'LCB', 'CB', 'RCB', 'CDM', 'CDM', 'CDM', 'LM', 'RM', 'ST', 'ST']
      } else if (lineupNumber === '5-4-1') {
        positionArr = ['GK', 'LB', 'LCB', 'CB', 'RCB', 'RB', 'LM', 'CDM', 'CDM', 'RM', 'ST']
      } else if (lineupNumber === '4-1-3-2') {
        positionArr = ['GK', 'LB', 'LCB', 'CB', 'RCB', 'CDM', 'LM', 'CAM', 'RM', 'ST', 'ST']
      } else if (lineupNumber === '4-1-2-3') {
        positionArr = ['GK', 'LB', 'LCB', 'CB', 'RCB', 'CDM', 'LM', 'RM', 'LW', 'ST', 'RW']
      } else if (lineupNumber === '4-5-1') {
        positionArr = ['GK', 'LB', 'LCB', 'CB', 'RCB', 'LM', 'CM', 'CDM', 'CM', 'RM', 'ST']
      }
      if (matchArr[i].status === 'guest') {
        positionArr.reverse()
      }
      let displayLineup = ''
      // 首发阵容
      $1(`#matchBox2 .plays .${matchArr[i].status} .playBox .play`).each(function(n, i){
        // let goal = 0, assist = 0
        // let goalArr = $1(i).children().children().first().html().match(/1\.png/gi)
        // let penaltyArr = $1(i).children().children().first().html().match(/7\.png/gi)
        // let assistArr = $1(i).children().children().first().html().match(/12\.png/gi)
        // if (goalArr) goal = goal + goalArr.length
        // if (penaltyArr) goal = goal + penaltyArr.length
        // if (assistArr) assist = assist + assistArr.length
        const [goal, assist, subcaps, subs] = goalAndAssist($1, i, false)
        displayLineup = displayLineup + getPlayerInfo($1(i).children().children('.name').children().text(), team, positionArr[n], goal, assist, subcaps, subs, false)
      })
      console.log(displayLineup)
      let displaySubs = '替补：'
      // 替补阵容
      $1(`#matchBox2 .backupPlay .${matchArr[i].status} .play`).each(function(n, i) {
        const [goal, assist, subcaps, subs] = goalAndAssist($1, i, true)
        displaySubs = displaySubs + getPlayerInfo($1(i).children().children('.name').children().text(), team, positionArr[n], goal, assist, subcaps, subs, true)
      })
      console.log(displaySubs)
      
    })
  }, 1)
}
// 封装函数
function goalAndAssist ($1, i, subsflag) {
  let goal = 0, assist = 0, subcaps = 0, subs = 0
  let goalArr = $1(i).children().children().first().html().match(/1\.png/gi)
  let penaltyArr = $1(i).children().children().first().html().match(/7\.png/gi)
  let assistArr = $1(i).children().children().first().html().match(/12\.png/gi)
  let subcapsArr = $1(i).children().children().first().html().match(/4\.png/gi)
  subs = (subsflag && !subcaps) ? 1 : 0
  if (goalArr) goal = goal + goalArr.length
  if (penaltyArr) goal = goal + penaltyArr.length
  if (assistArr) assist = assist + assistArr.length
  if (subcapsArr) subcaps = subcaps + subcapsArr.length
  return [goal, assist, subcaps, subs]
}
// 封装函数
function getPlayerInfo (str, team, position, goal, assist, subcaps, subs, subsflag) {
  let number = str.match(/[\d]+/gi)[0]
  let qname = str.split(number).pop().trim()
  if (!team.hasOwnProperty(number)) {
    team[number] = {}
    team[number].qname = qname
    team[number].number = number
    if (subcaps === 1) {
      team[number].caps = 1
      team[number].lineups = 0
      team[number].subs = 0
    } else if (subs === 1) {
      team[number].caps = 0
      team[number].lineups = 0
      team[number].subs = 1
    } else {
      team[number].caps = 1
      team[number].lineups = 1
      team[number].subs = 0
    }
    team[number].regularPosition = {}
    team[number].goal = goal
    team[number].assist = assist
    if (!subsflag) {
      if (!team[number].regularPosition.hasOwnProperty(position)) {
        team[number].regularPosition[position] = 1
      } else {
        team[number].regularPosition[position] += 1
      }
    }
  } else {
    if (subcaps === 1) {
      team[number].caps += 1
    } else if (subs === 1) {
      team[number].subs += 1
    } else {
      team[number].caps += 1
      team[number].lineups += 1
    }
    if (!subsflag) {
      if (!team[number].regularPosition.hasOwnProperty(position)) {
        team[number].regularPosition[position] = 1
      } else {
        team[number].regularPosition[position] += 1
      }
    }
    team[number].goal += goal
    team[number].assist += assist
  }
  return number + '-' + qname + ','
}

setTimeout(() => {
    // for (let key in team) {
    //   let str = team[key].number + '-' + team[key].qname + ' ' + team[key].caps + '场' + team[key].lineups + '首发,'
    //   if (team[key].goal != 0) str = str + team[key].goal + '球'
    //   if (team[key].assist != 0) str = str + team[key].assist + '助,'
    //   str = str + JSON.stringify(team[key].regularPosition)
    //   console.log(str)
    // }
    // 最后，是常用阵型算法，最多出场数的GK和前10个最常首发的人
    // 找到门将
    let gkLineup = []
    for (let key in team) {
      if (team[key].regularPosition.hasOwnProperty('GK')) {
        if ((gkLineup.length > 0 && gkLineup[0].lineups < team[key].regularPosition['GK'].lineups) || gkLineup.length === 0) {
          gkLineup = []
          gkLineup.push(team[key])
        }
      }
    }
    // 找到首发数字最多10个人
    let otherLineup = []
    const best = []
    for (let key in team) {
      // 1.一个一个遍历
      // 2.排除regularPosition没有GK的和没位置的
      if (team[key].regularPosition.hasOwnProperty('GK') || JSON.stringify(team[key].regularPosition) === '{}') continue
      // 3.一个一个加入数组中
      best.push(team[key])
    }
    // 4.从小到大排序
    const best2 = bubbleSort(best, 'lineups')
    best2.reverse()
    best2.forEach(item => {
      console.log(item.number+'-'+item.qname+' '+item.caps+'场'+item.lineups+'首发, '+item.goal+'球'+item.assist+'助, '+ JSON.stringify(item.regularPosition))
    })
    const df = []
    const mf = []
    const fw = []
    for (let j = 0; j < 10; j++) {
      let position = '', count = 0
      for (let k in best2[j].regularPosition) {
        let tempPosition = k
        let tempCount = best2[j].regularPosition[k]
        if ((tempCount > count) || (position === '' && count === 0)) {
          position = tempPosition
          count = tempCount
        }
      }
      best2[j].position = position
      if (position.indexOf('B') > -1) {
        df.push(best2[j])
      } else if (position.indexOf('M') > -1) {
        mf.push(best2[j])
      } else {
        fw.push(best2[j])
      }
    }
    console.log('常用阵型:', df.length, mf.length, fw.length)
    let tempStr = gkLineup[0].number + '-' + gkLineup[0].qname + '/'
    for (let l = 0; l < df.length; l++) {
      tempStr = tempStr + df[l].number + '-' + df[l].qname + ','
    }
    tempStr = tempStr.substring(0, tempStr.length - 1) + '/'
    for (let l = 0; l < mf.length; l++) {
      tempStr = tempStr + mf[l].number + '-' + mf[l].qname + ','
    }
    tempStr = tempStr.substring(0, tempStr.length - 1) + '/'
    for (let l = 0; l < fw.length; l++) {
      tempStr = tempStr + fw[l].number + '-' + fw[l].qname + ','
    }
    tempStr = tempStr.substring(0, tempStr.length - 1)
    console.log(tempStr)
}, 4000)


// console.log($('#matchBox2>.teamNames a').first().html())
// console.log($('#matchBox2>.teamNames a').last().html())


// console.log($('#matchBox2>.teamNames .home').html().replace(/(<a.*?>[\s\S]*?<\/a>)/gi, '').trim())
// console.log($('#matchBox2>.teamNames .guest').html().replace(/(<a.*?>[\s\S]*?<\/a>)/gi, '').trim())

// // 先把所有人都截取出来
// $('#matchBox2 .plays .home .playBox .play a').each(function(n, i) {
//   console.log($(i).text())
// })

// $('#matchBox2 .plays .guest .playBox .play a').each(function(n, i) {
//   console.log($(i).text())
// })