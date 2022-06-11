const { bubbleSort } = require('../utils')
const cheerio = require('cheerio')
const { League } = require('../class')

function parseData0(arrTeam, totalScore, homeScore, guestScore) {
  // 第一步，先把球队名字与序号结合
  // arrTeam是个二维数组
  // 先建立个对象数组储存信息
  const clubObjArr = []
  let teamObj = {}
  // 然后建立个对象储存信息 obj = { 208: ['柏太阳神', index]}
  // 根据arrTeam排序
  arrTeam.forEach((item, index) => {
    const obj = {}
    obj.name = item[1]
    obj.serial = item[0]
    obj.totalScore = {}
    obj.homeScore = {}
    obj.guestScore = {}
    teamObj[item[0]] = [item[1], index]
    clubObjArr.push(obj)
  })
  // arrTeam处理完毕，接下来处理赢盘率
  totalScore.forEach(item => {
    // item[0]是盘路排名,1是序号 -- 208  
    // clubObjArr[teamObj[item[1]][1]] 就是那个对象数组
    clubObjArr[teamObj[item[2]][1]].totalScore.rank = item[1]
    clubObjArr[teamObj[item[2]][1]].totalScore.total = item[4]
    clubObjArr[teamObj[item[2]][1]].totalScore.win = item[5]
    clubObjArr[teamObj[item[2]][1]].totalScore.tie = item[6]
    clubObjArr[teamObj[item[2]][1]].totalScore.lost = item[7]
    clubObjArr[teamObj[item[2]][1]].totalScore.goal = item[8]
    clubObjArr[teamObj[item[2]][1]].totalScore.lose = item[9]
    clubObjArr[teamObj[item[2]][1]].totalScore.difference = item[10]
    clubObjArr[teamObj[item[2]][1]].totalScore.score = item[16]
  })
  homeScore.forEach(item => {
    clubObjArr[teamObj[item[1]][1]].homeScore.rank = item[0]
    clubObjArr[teamObj[item[1]][1]].homeScore.total = item[2]
    clubObjArr[teamObj[item[1]][1]].homeScore.win = item[3]
    clubObjArr[teamObj[item[1]][1]].homeScore.tie = item[4]
    clubObjArr[teamObj[item[1]][1]].homeScore.lost = item[5]
    clubObjArr[teamObj[item[1]][1]].homeScore.goal = item[6]
    clubObjArr[teamObj[item[1]][1]].homeScore.lose = item[7]
    clubObjArr[teamObj[item[1]][1]].homeScore.difference = item[8]
    clubObjArr[teamObj[item[1]][1]].homeScore.score = item[14]
  })
  guestScore.forEach(item => {
    clubObjArr[teamObj[item[1]][1]].guestScore.rank = item[0]
    clubObjArr[teamObj[item[1]][1]].guestScore.total = item[2]
    clubObjArr[teamObj[item[1]][1]].guestScore.win = item[3]
    clubObjArr[teamObj[item[1]][1]].guestScore.tie = item[4]
    clubObjArr[teamObj[item[1]][1]].guestScore.lost = item[5]
    clubObjArr[teamObj[item[1]][1]].guestScore.goal = item[6]
    clubObjArr[teamObj[item[1]][1]].guestScore.lose = item[7]
    clubObjArr[teamObj[item[1]][1]].guestScore.difference = item[8]
    clubObjArr[teamObj[item[1]][1]].guestScore.score = item[14]
  })
  return bubbleSort(clubObjArr, 'serial')
}

function parsePrevenientMatch (hostTeam, awayTeam, round, league, arrTeam, jh) {
  if (round === 1) return []
  if (!League.include(league)) return []
  // 假设我们要找188 和 181 当前是17轮，所以我们要找前16轮的
  let hostSerial = undefined, awaySerial = undefined
  for (let i = 0; i < arrTeam.length; i++) {
    if (arrTeam[i][1] === hostTeam) hostSerial = arrTeam[i][0]
    if (arrTeam[i][1] === awayTeam) awaySerial = arrTeam[i][0]
    if (hostSerial && awaySerial) break
  }
  // 找到主队的序号和客队的序号后
  // 然后要确定主队的档次和客队的档次
  // 主队 ---   START -----------
  /*awaySameGradeTeamsArr 这是确定客队同档次的 */
  const awaySameGradeTeamsArr = League.getSameGradeTeams(league, awayTeam).filter(item => {
    return item !== hostTeam
  })
  const awaySameGradeTeamsStr = awaySameGradeTeamsArr.join(',')
  const awaySameGradeTeamsSerialArr = []
  const awaySameGradeTeamsObj = {}
  // 然后将他们转换成序号
  for (let i = 0; i < arrTeam.length; i++) {
    if (awaySameGradeTeamsStr.indexOf(arrTeam[i][1]) > -1) {
      awaySameGradeTeamsSerialArr.push(arrTeam[i][0])
      awaySameGradeTeamsObj[arrTeam[i][0]] = arrTeam[i][1]
    } 
  }
  // 找完后，遍历jh
  // 比赛时间 下标3 2022-05-28 13:00
  // 主队，下标4 序号 206
  // 客队，下标5 序号 181
  // 完场比分，下标6 1-0
  // 澳门盘口 下标10
  const hostPrevenientMatch = []
  for (let i = 1; i < round; i++) {
    for (let j = 0; j < jh['R_'+i].length; j++) {
      // 先找到有A的队，再找对手是不是同档次的
      if (jh['R_'+i][j][4] === hostSerial || jh['R_'+i][j][5] === hostSerial) {
        // 先看是主队还是客队
        let isHost = jh['R_'+i][j][4] === hostSerial
        if (isHost) {
          // 是不是该收入这场比赛
          let flag = awaySameGradeTeamsSerialArr.includes(jh['R_'+i][j][5])
          if (flag) {
            const obj = {}
            obj.hostTeam = hostTeam
            obj.awayTeam = awaySameGradeTeamsObj[jh['R_'+i][j][5]]
            obj.score = jh['R_'+i][j][6].replace('-', ':')
            obj.odd = -1  * jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = hostSerial
            if (jh['R_'+i][j][6].split('-')[0] - jh['R_'+i][j][6].split('-')[1] + obj.odd > 0) {
              obj.oddResult = '赢'
            } else if (jh['R_'+i][j][6].split('-')[0] - jh['R_'+i][j][6].split('-')[1] + obj.odd === 0) {
              obj.oddResult = '走'
            } else {
              obj.oddResult = '输'
            }
            hostPrevenientMatch.push(obj)
          }
        } else {
          let flag = awaySameGradeTeamsSerialArr.includes(jh['R_'+i][j][4])
          if (flag) {
            const obj = {}
            obj.hostTeam = awaySameGradeTeamsObj[jh['R_'+i][j][4]]
            obj.awayTeam = hostTeam
            obj.score = jh['R_'+i][j][6].replace('-', ':')
            obj.odd = -1 * jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = hostSerial
            if (jh['R_'+i][j][6].split('-')[1] - jh['R_'+i][j][6].split('-')[0] - obj.odd > 0) {
              obj.oddResult = '赢'
            } else if (jh['R_'+i][j][6].split('-')[1] - jh['R_'+i][j][6].split('-')[0] - obj.odd === 0) {
              obj.oddResult = '走'
            } else {
              obj.oddResult = '输'
            }
            hostPrevenientMatch.push(obj)
          }
        }
      }
    }
  }
  // 主队 ---   END -----------
  // 客队 ---   START -----------
  /*hostSameGradeTeamsArr 这是确定主队同档次的 */
  const hostSameGradeTeamsArr = League.getSameGradeTeams('JLeague', hostTeam).filter(item => {
    return item !== awayTeam
  })
  const hostSameGradeTeamsStr = hostSameGradeTeamsArr.join(',')
  const hostSameGradeTeamsSerialArr = []
  const hostSameGradeTeamsObj = {}
  // 然后将他们转换成序号
  for (let i = 0; i < arrTeam.length; i++) {
    if (hostSameGradeTeamsStr.indexOf(arrTeam[i][1]) > -1) {
      hostSameGradeTeamsSerialArr.push(arrTeam[i][0])
      hostSameGradeTeamsObj[arrTeam[i][0]] = arrTeam[i][1]
    } 
  }
  // 找完后，遍历jh
  // 比赛时间 下标3 2022-05-28 13:00
  // 主队，下标4 序号 206
  // 客队，下标5 序号 181
  // 完场比分，下标6 1-0
  // 澳门盘口 下标10
  const awayPrevenientMatch = []
  for (let i = 1; i < round; i++) {
    for (let j = 0; j < jh['R_'+i].length; j++) {
      // 先找到有A的队，再找对手是不是同档次的
      if (jh['R_'+i][j][4] === awaySerial || jh['R_'+i][j][5] === awaySerial) {
        // 先看是主队还是客队
        let isHost = jh['R_'+i][j][4] === awaySerial
        if (isHost) {
          // 是不是该收入这场比赛
          let flag = hostSameGradeTeamsSerialArr.includes(jh['R_'+i][j][5])
          if (flag) {
            const obj = {}
            obj.hostTeam = awayTeam
            obj.awayTeam = hostSameGradeTeamsObj[jh['R_'+i][j][5]]
            obj.score = jh['R_'+i][j][6].replace('-', ':')
            obj.odd = -1 * jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = awaySerial
            if (jh['R_'+i][j][6].split('-')[0] - jh['R_'+i][j][6].split('-')[1] + obj.odd > 0) {
              obj.oddResult = '赢'
            } else if (jh['R_'+i][j][6].split('-')[0] - jh['R_'+i][j][6].split('-')[1] + obj.odd === 0) {
              obj.oddResult = '走'
            } else {
              obj.oddResult = '输'
            }
            awayPrevenientMatch.push(obj)
          }
        } else {
          let flag = hostSameGradeTeamsSerialArr.includes(jh['R_'+i][j][4])
          if (flag) {
            const obj = {}
            obj.hostTeam = hostSameGradeTeamsObj[jh['R_'+i][j][4]]
            obj.awayTeam = awayTeam
            obj.score = jh['R_'+i][j][6].replace('-', ':')
            obj.odd = -1 * jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = awaySerial
            if (jh['R_'+i][j][6].split('-')[1] - jh['R_'+i][j][6].split('-')[0] - obj.odd > 0) {
              obj.oddResult = '赢'
            } else if (jh['R_'+i][j][6].split('-')[1] - jh['R_'+i][j][6].split('-')[0] - obj.odd === 0) {
              obj.oddResult = '走'
            } else {
              obj.oddResult = '输'
            }
            awayPrevenientMatch.push(obj)
          }
        }
      }
    }
  }
  // 客队 ---   END -----------
  // 输出下日志
  for (let i = 0; i < hostPrevenientMatch.length; i++) {
    console.log(hostPrevenientMatch[i].matchTime, '第'+hostPrevenientMatch[i].round+'轮', hostPrevenientMatch[i].hostTeam, hostPrevenientMatch[i].score, hostPrevenientMatch[i].awayTeam, hostPrevenientMatch[i].odd)
  }
  for (let i = 0; i < awayPrevenientMatch.length; i++) {
    console.log(awayPrevenientMatch[i].matchTime, '第'+awayPrevenientMatch[i].round+'轮', awayPrevenientMatch[i].hostTeam, awayPrevenientMatch[i].score, awayPrevenientMatch[i].awayTeam, awayPrevenientMatch[i].odd)
  }
  return [hostPrevenientMatch, awayPrevenientMatch]
}

function parseData1 (arrTeam, TotalPanLu, HomePanLu, GuestPanLu) {
  // 第一步，先把球队名字与序号结合
  // arrTeam是个二维数组
  // 先建立个对象数组储存信息
  const clubObjArr = []
  let teamObj = {}
  // 然后建立个对象储存信息 obj = { 208: ['柏太阳神', index]}
  // 根据arrTeam排序
  arrTeam.forEach((item, index) => {
    const obj = {}
    obj.name = item[1]
    obj.serial = item[0]
    obj.totalPanlu = {}
    obj.homePanlu = {}
    obj.guestPanlu = {}
    teamObj[item[0]] = [item[1], index]
    clubObjArr.push(obj)
  })
  // arrTeam处理完毕，接下来处理赢盘率
  TotalPanLu.forEach(item => {
    // item[0]是盘路排名,1是序号 -- 208  
    // clubObjArr[teamObj[item[1]][1]] 就是那个对象数组
    clubObjArr[teamObj[item[1]][1]].totalPanlu.panRanking = item[0]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.totalpanNumber = item[2]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.shangpanNumber = item[3]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.pingpanNumber = item[4]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.xiapanNumber = item[5]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.yingpanNumber = item[6]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.zoupanNumber = item[7]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.shupanNumber = item[8]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.jingpanNumber = item[9]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.yingpanPercent = item[10]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.zoupanPercent = item[11]
    clubObjArr[teamObj[item[1]][1]].totalPanlu.shupanPercent = item[12]
  })
  HomePanLu.forEach(item => {
    clubObjArr[teamObj[item[1]][1]].homePanlu.panRanking = item[0]
    clubObjArr[teamObj[item[1]][1]].homePanlu.totalpanNumber = item[2]
    clubObjArr[teamObj[item[1]][1]].homePanlu.shangpanNumber = item[3]
    clubObjArr[teamObj[item[1]][1]].homePanlu.pingpanNumber = item[4]
    clubObjArr[teamObj[item[1]][1]].homePanlu.xiapanNumber = item[5]
    clubObjArr[teamObj[item[1]][1]].homePanlu.yingpanNumber = item[6]
    clubObjArr[teamObj[item[1]][1]].homePanlu.zoupanNumber = item[7]
    clubObjArr[teamObj[item[1]][1]].homePanlu.shupanNumber = item[8]
    clubObjArr[teamObj[item[1]][1]].homePanlu.jingpanNumber = item[9]
    clubObjArr[teamObj[item[1]][1]].homePanlu.yingpanPercent = item[10]
    clubObjArr[teamObj[item[1]][1]].homePanlu.zoupanPercent = item[11]
    clubObjArr[teamObj[item[1]][1]].homePanlu.shupanPercent = item[12]
  })
  GuestPanLu.forEach(item => {
    clubObjArr[teamObj[item[1]][1]].guestPanlu.panRanking = item[0]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.totalpanNumber = item[2]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.shangpanNumber = item[3]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.pingpanNumber = item[4]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.xiapanNumber = item[5]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.yingpanNumber = item[6]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.zoupanNumber = item[7]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.shupanNumber = item[8]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.jingpanNumber = item[9]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.yingpanPercent = item[10]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.zoupanPercent = item[11]
    clubObjArr[teamObj[item[1]][1]].guestPanlu.shupanPercent = item[12]
  })
  return bubbleSort(clubObjArr, 'serial')
}

function parseData2 (arrTeam, TotalBs, HomeBs, GuestBs) {
  // 第一步，先把球队名字与序号结合
  // arrTeam是个二维数组
  // 先建立个对象数组储存信息
  const clubObjArr = []
  let teamObj = {}
  // 然后建立个对象储存信息 obj = { 208: ['柏太阳神', index]}
  // 根据arrTeam排序
  arrTeam.forEach((item, index) => {
    const obj = {}
    obj.name = item[1]
    obj.serial = item[0]
    obj.totalBs = {}
    obj.homeBs = {}
    obj.guestBs = {}
    teamObj[item[0]] = [item[1], index]
    clubObjArr.push(obj)
  })
  // arrTeam处理完毕，接下来处理赢盘率
  TotalBs.forEach(item => {
    // item[0]是盘路排名,1是序号 -- 208  
    // clubObjArr[teamObj[item[1]][1]] 就是那个对象数组
    clubObjArr[teamObj[item[1]][1]].totalBs.panRanking = item[0]
    clubObjArr[teamObj[item[1]][1]].totalBs.totalpanNumber = item[2]
    clubObjArr[teamObj[item[1]][1]].totalBs.bigpanNumber = item[3]
    clubObjArr[teamObj[item[1]][1]].totalBs.pingpanNumber = item[4]
    clubObjArr[teamObj[item[1]][1]].totalBs.smallpanNumber = item[5]
    clubObjArr[teamObj[item[1]][1]].totalBs.bigpanPercent = item[6]
    clubObjArr[teamObj[item[1]][1]].totalBs.zoupanPercent = item[7]
    clubObjArr[teamObj[item[1]][1]].totalBs.smallpanPercent = item[8]
  })
  HomeBs.forEach(item => {
    clubObjArr[teamObj[item[1]][1]].homeBs.panRanking = item[0]
    clubObjArr[teamObj[item[1]][1]].homeBs.totalpanNumber = item[2]
    clubObjArr[teamObj[item[1]][1]].homeBs.bigpanNumber = item[3]
    clubObjArr[teamObj[item[1]][1]].homeBs.pingpanNumber = item[4]
    clubObjArr[teamObj[item[1]][1]].homeBs.smallpanNumber = item[5]
    clubObjArr[teamObj[item[1]][1]].homeBs.bigpanPercent = item[6]
    clubObjArr[teamObj[item[1]][1]].homeBs.zoupanPercent = item[7]
    clubObjArr[teamObj[item[1]][1]].homeBs.smallpanPercent = item[8]
  })
  GuestBs.forEach(item => {
    clubObjArr[teamObj[item[1]][1]].guestBs.panRanking = item[0]
    clubObjArr[teamObj[item[1]][1]].guestBs.totalpanNumber = item[2]
    clubObjArr[teamObj[item[1]][1]].guestBs.bigpanNumber = item[3]
    clubObjArr[teamObj[item[1]][1]].guestBs.pingpanNumber = item[4]
    clubObjArr[teamObj[item[1]][1]].guestBs.smallpanNumber = item[5]
    clubObjArr[teamObj[item[1]][1]].guestBs.bigpanPercent = item[6]
    clubObjArr[teamObj[item[1]][1]].guestBs.zoupanPercent = item[7]
    clubObjArr[teamObj[item[1]][1]].guestBs.smallpanPercent = item[8]
  })
  return bubbleSort(clubObjArr, 'serial')
}

function parseInfo (h_data, a_data, v_data, $) {
  let object = {
    history: [],
    hostRecent: [],
    awayRecent: [],
    hostFuture: [],
    awayFuture: []
  }
  for (let i = 0; i < Math.min(h_data.length, 6); i++) {
    let obj = {}
    obj.hostTeam = cheerio.load(h_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.hostSerial = h_data[i][4]
    obj.awayTeam = cheerio.load(h_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.awaySerial = h_data[i][6]
    obj.score = h_data[i][8] + ':' + h_data[i][9]
    obj.odd = (-1 * h_data[i][11]) >= 0 ? '+' + (-1 * h_data[i][11]) : '' + (-1 * h_data[i][11])
    obj.matchTime = '20' + h_data[i][0]
    obj.league = League.leagueChineseToEnglish(h_data[i][2])
    object.hostRecent.push(obj)
    // console.log(h_data[i][0], h_data[i][2], cheerio.load(h_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), cheerio.load(h_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), h_data[i][8] + '-' + h_data[i][9], -1 * h_data[i][11])
  }

  for (let i = 0; i < Math.min(a_data.length, 6); i++) {
    let obj = {}
    obj.hostTeam = cheerio.load(a_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.hostSerial = a_data[i][4]
    obj.awayTeam = cheerio.load(a_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.awaySerial = a_data[i][6]
    obj.score = a_data[i][8] + ':' + a_data[i][9]
    obj.odd = (-1 * a_data[i][11]) >= 0 ? '+' + (-1 * a_data[i][11]) : '' + (-1 * a_data[i][11])
    obj.matchTime = '20' + a_data[i][0]
    obj.league = League.leagueChineseToEnglish(a_data[i][2])
    object.awayRecent.push(obj)
    // console.log(a_data[i][0], a_data[i][2], cheerio.load(a_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), cheerio.load(a_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), a_data[i][8] + '-' + a_data[i][9], -1 * a_data[i][11])
  }

  for (let i = 0; i < Math.min(v_data.length, 6); i++) {
    if (v_data[i][2] === '球会友谊') {
      continue
    }
    let obj = {}
    obj.hostTeam = cheerio.load(v_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.hostSerial = v_data[i][4]
    obj.awayTeam = cheerio.load(v_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim()
    obj.awaySerial = v_data[i][6]
    obj.score = v_data[i][8] + ':' + v_data[i][9]
    obj.odd = (-1 * v_data[i][11]) >= 0 ? '+' + (-1 * v_data[i][11]) : '' + (-1 * v_data[i][11])
    obj.matchTime = '20' + v_data[i][0]
    obj.league = League.leagueChineseToEnglish(v_data[i][2])
    object.history.push(obj)
    // console.log(v_data[i][0], v_data[i][2], cheerio.load(v_data[i][5])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), cheerio.load(v_data[i][7])('span').first().html().replace(/<.*>*<.*>|\s/g, "").trim(), v_data[i][8] + '-' + v_data[i][9], -1 * v_data[i][11])
  }

  let obj = new Object()
  $('#porlet_20>table>tbody>tr>td:first>TABLE>tbody>tr:gt(1)>td').each(function(n, i) {
    // 0-5 6-11 12-17 18-23 24-29 0 1 2 5
    if (n%6 === 0) {
      obj.matchTime = '2022-' + $(i).html().trim()
    } else if (n%6 === 1) {
      obj.league = League.leagueChineseToEnglish($(i).html().trim())
    } else if (n%6 === 2) {
      let strArr = $(i).html().trim().split('-')
      obj.hostTeam = strArr[0].trim()
      obj.awayTeam = strArr[1].trim()
      obj.match = obj.hostTeam + 'vs' + obj.awayTeam
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
      obj.league = League.leagueChineseToEnglish($(i).html().trim())
    } else if (n%6 === 2) {
      let strArr = $(i).html().trim().split('-')
      obj.hostTeam = strArr[0].trim()
      obj.awayTeam = strArr[1].trim()
      obj.match = obj.hostTeam + 'vs' + obj.awayTeam
    } else if (n%6 === 5) {
      obj.day = $(i).html().trim()
      object.awayFuture.push(obj)
      obj = new Object()
    }
  })
  return object
}

module.exports = {
  parseData0,
  parseData1,
  parseData2,
  parseInfo,
  parsePrevenientMatch
}
