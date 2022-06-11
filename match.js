const fs = require('fs')
const f = fs.readFileSync('a.json', 'utf8')
const data = JSON.parse(f)
const { Match } = require('./class')

const host = '水原城'
const away = '蔚山现代'
const league = 'KLeague'


const match = new Match({
  hostTeam: host,
  awayTeam: away,
  league: league,
  hostTeamInfo: {
    clubName: host,
    league: league,
    formations: ['352'],
    players: data.league[league][host].players
  },
  awayTeamInfo: {
    clubName: away,
    league: league,
    formations: ['4231'],
    players: data.league[league][away].players
  },
  matchTime: data.league[league][host].matchTime,
  // awayTeamFutureMatchs: data.league[league][away].future,
  recentSixMatchsOfHostTeam: data.league[league][host].recent,
  recentSixMatchsOfAwayTeam: data.league[league][away].recent,
  historyMatchs: data.league[league][host].history,
  euroOdd: data.league[league][host].euroOdd,
  asiaOdd: data.league[league][host].asiaOdd,
  // asiaDaxiao: data.league[league]['浦和红钻'].asiaDaxiao,
  oddPulling: away
})


const a = match.getTeamPlayersInfo('host')
const b = match.getTeamPlayersInfo('away')
// const c = match.getTeamFutureMatchInfo('host')
// const d = match.getTeamFutureMatchInfo('away')
const e = '预测首发：'

const g = match.forecastLineup('host', [])
const h = match.forecastLineup('away', ['严原上', '李奎成'])
const i = match.analysisRecentSixMatchs('host')
const j = match.analysisRecentSixMatchs('away')
const k = match.analysisHistoryMatchs()
const l = match.analysisOdd()

// console.log(a+b+e+g+h+i+j+k+l)
console.log(l)
const s = a+'\n'+b+'\n'+e+'\n'+g+'\n'+h+'\n'+i+'\n'+j+'\n'+k+'\n'+l
fs.writeFileSync(`${host}vs${away}分析.txt`, s)
