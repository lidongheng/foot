const cheerio = require('cheerio')
const fs = require('fs')
const localData = JSON.parse(fs.readFileSync('./a.json', 'utf8'))
const { dateFormat, Queue, service, deepClone, findMostValOfArr } = require('./utils')
const { parseData0, parseData1, parseData2, parseInfo } = require('./tool/parseData')
const {
  qiutanHeaders,
  start_urls,
  matchTimeAddObj,
  host,
  away,
  league,
  hostFormations,
  awayFormations
} = require('./config/cup')
const { Player, Club, League, Match }  = require('./class')

// 组织已经决定让你当主程序了
Array.prototype.getMost = function () {
  var obj = this.reduce((p,n) => (p[n]++ || (p[n] = 1),
              (p.max = p.max >= p[n] ? p.max : p[n]),
              (p.key = p.max > p[n] ? p.key : n), p), {})
  return obj.key   
}
var jh = []
// 定义一个二维数组[[{}, {}], [], []]
function crawler (start_urls, headers = {}) {
  if (!Array.isArray(start_urls)) return
  if (Array.isArray(start_urls) && start_urls.length === 0) return
  const queue = new Queue(null)
  for (let i = 0; i < start_urls.length; i++) {
    console.log('当前请求的url:', start_urls[i])
    let request = service({
      methods: 'GET',
      url: start_urls[i],
      headers: headers
    })
    queue.enqueue(request)
  }
  Promise.all(queue.toArray())
    .then(res => {
      const data = [[], [], [], {}]
      for (let i = 0; i < queue.size(); i++) {
        // if (i === 0) {
        //   let html = res[i].data
        //   eval(html)
        //   const listData0 = parseData0(arrTeam, totalScore, homeScore, guestScore)
        //   data[0][0] = listData0
        // }
        if (i === 0) {
          let html = res[i].data
          eval(html)
          const listData1 = parseData1(arrTeam, TotalPanLu, HomePanLu, GuestPanLu)
          data[0][0] = listData1
        }
        if (i === 1) {
          let html = res[i].data
          eval(html)
          const listData2 = parseData2(arrTeam, TotalBs, HomeBs, GuestBs)
          data[0][1] = listData2
        }
        if (i === 2) {
          const $ = cheerio.load(res[i].data)
          eval($('#webmain script').first().text())
          const listData3 = parseInfo(h_data, a_data, v_data, $)
          data[0][2] = listData3
        }
      }
      return data
    }).then(data => {
      // 然后将这个三维数组合并
      // 先自己实现深拷贝
      // 现在老子实现完深拷贝了，速度写下去！
      let newData = []
      for (let i = 0; i < data[0][0].length; i++) {
        let obj = Object.assign({}, data[0][0][i], data[0][1][i])
        let cloneObj = deepClone(obj)
        newData.push(cloneObj)
      }
      // 然后打印下第一个信息
      // for (let key in newData[0]) {
      //   console.log(key, newData[0][key])
      // }
      for (let key in data[0][2]) {
        for (let i = 0; i < data[0][2][key].length; i++) {
          console.log(data[0][2][key][i].matchTime, data[0][2][key][i].league, data[0][2][key][i].hostTeam, data[0][2][key][i].score, data[0][2][key][i].awayTeam, data[0][2][key][i].odd, data[0][2][key][i].day)
        }
      }
      newData.push(data[0][2])
      return newData
    }).then(data => {
      // match.js的内容要引入到这里生成
      // 由于近6场和未来3场没有时分秒，你要加上去
      // 现在拥有了20队的盘口、积分榜数据，主客两队的交锋、近期、未来数据
      // 就是说，复盘里面的4点，第2点做完了
      // 下一步要改进的地方：列出和同档次球队联赛交手的记录
      // 加上战意描述、心得体会描述
      const info = data.pop()
      // 要对时间做补充
      for (let key in info) {
        if (key != 'history') {
          info[key].forEach((item, index) => {
            item.matchTime = item.matchTime + ' ' + matchTimeAddObj[key][index].matchTime
          })
        }
      }
      // 现在还有个问题，把这两个队的上下盘和大小球抽出来
      // 先确定主队序号和客队序号
      let serialArr = []
      info.hostRecent.forEach(item => {
        serialArr.push(item.hostSerial)
        serialArr.push(item.awaySerial)
      })
      const hostSerial = serialArr.getMost()
      serialArr = []
      info.awayRecent.forEach(item => {
        serialArr.push(item.hostSerial)
        serialArr.push(item.awaySerial)
      })
      const awaySerial = serialArr.getMost()
      // 现在要在data数组里找到主队和客队的盘路了
      let count = 0
      let hostPanlu = {}, awayPanlu = {}
      for (let i = 0; i < data.length - 1; i++) {
        if (data[i].serial === hostSerial) {
          // 主队的盘路
          count++
          hostPanlu = data[i]
        }
        if (data[i].serial === awaySerial) {
          // 客队的盘路
          count++
          awayPanlu = data[i]
        }
        if (count === 2) break
      }
      const match = new Match({
        hostTeam: host,
        awayTeam: away,
        league: league,
        hostTeamInfo: {
          clubName: host,
          league: league,
          formations: hostFormations,
          players: localData.nation[league][host].players,
          totalPanlu: hostPanlu.totalPanlu,
          homePanlu: hostPanlu.homePanlu,
          guestPanlu: hostPanlu.guestPanlu,
          totalBs: hostPanlu.totalBs,
          homeBs: hostPanlu.homeBs,
          guestBs: hostPanlu.guestBs
        },
        awayTeamInfo: {
          clubName: away,
          league: league,
          formations: awayFormations,
          players: localData.nation[league][away].players,
          totalPanlu: awayPanlu.totalPanlu,
          homePanlu: awayPanlu.homePanlu,
          guestPanlu: awayPanlu.guestPanlu,
          totalBs: awayPanlu.totalBs,
          homeBs: awayPanlu.homeBs,
          guestBs: awayPanlu.guestBs
        },
        matchTime: localData.nation[league][host].matchTime,
        hostTeamFutureMatchs: info.hostFuture,
        awayTeamFutureMatchs: info.awayFuture,
        recentSixMatchsOfHostTeam: info.hostRecent,
        recentSixMatchsOfAwayTeam: info.awayRecent,
        historyMatchs: info.history,
        euroOdd: localData.nation[league][host].euroOdd,
        asiaOdd: localData.nation[league][host].asiaOdd,
        asiaDaxiao: localData.nation[league][host].asiaDaxiao,
        oddPulling: host,
        daxiaoPulling: '大'
      })
      const a = match.getTeamPlayersInfo('host')
      const b = match.getTeamPlayersInfo('away')
      const c = match.getTeamFutureMatchInfo('host')
      const d = match.getTeamFutureMatchInfo('away')
      const e = '预测首发：'
      const g = match.forecastLineup('host', [])
      const h = match.forecastLineup('away', [])
      const i = match.analysisRecentSixMatchs('host')
      const j = match.analysisRecentSixMatchs('away')
      const k = match.analysisHistoryMatchs()
      const l = match.analysisOdd()
      const m = match.displayPanlu()
      const n = match.displayDaxiao()
      // console.log(a+b+e+g+h+i+j+k+l)
      console.log(l)
      const s = a+'\n'+b+'\n'+c+'\n'+d+'\n'+e+'\n'+g+'\n'+h+'\n'+i+'\n'+j+'\n'+k+'\n'+m+'\n'+n+'\n'+l
      fs.writeFileSync(`${host}vs${away}分析.txt`, s)
    }).catch(err => {
      console.log(err)
      console.log('出错了')
    })
}



crawler(start_urls, qiutanHeaders)