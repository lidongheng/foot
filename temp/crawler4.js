const { dateFormat, Queue, service, deepClone } = require('./utils')
const { League } = require('./class')
const {
  qiutanHeaders
} = require('./config/league')
service({
  methods: 'GET',
  url: `http://zq.titan007.com/jsData/matchResult/2022/s25_943.js?version=${dateFormat(new Date().getTime(), 'YYYYMMDDHH')}`,
  headers: qiutanHeaders
}).then(res => {
  var jh = new Object()
  for (let i = 1; i < 45; i++) {
    jh['R_'+i] = []
  }
  eval(res.data)
  parsePrevenientMatch('鹿岛鹿角', '京都不死鸟', 17, arrTeam, jh)
})
function parsePrevenientMatch (hostTeam, awayTeam, round, arrTeam, jh) {
  if (round === 1) return []
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
  const awaySameGradeTeamsArr = League.getSameGradeTeams('JLeague', awayTeam).filter(item => {
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
            obj.odd = jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = hostSerial
            hostPrevenientMatch.push(obj)
          }
        } else {
          let flag = awaySameGradeTeamsSerialArr.includes(jh['R_'+i][j][4])
          if (flag) {
            const obj = {}
            obj.hostTeam = awaySameGradeTeamsObj[jh['R_'+i][j][4]]
            obj.awayTeam = hostTeam
            obj.score = jh['R_'+i][j][6].replace('-', ':')
            obj.odd = jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = hostSerial
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
            obj.odd = jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = awaySerial
            awayPrevenientMatch.push(obj)
          }
        } else {
          let flag = hostSameGradeTeamsSerialArr.includes(jh['R_'+i][j][4])
          if (flag) {
            const obj = {}
            obj.hostTeam = hostSameGradeTeamsObj[jh['R_'+i][j][4]]
            obj.awayTeam = awayTeam
            obj.score = jh['R_'+i][j][6].replace('-', ':')
            obj.odd = jh['R_'+i][j][10]
            obj.matchTime = jh['R_'+i][j][3] + ':00'
            obj.round = i
            obj.belongsToSerial = awaySerial
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