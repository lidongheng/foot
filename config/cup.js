const { dateFormat } = require('../utils')
const BASE_URL = 'http://zq.titan007.com/jsData/'
// 欧国联 START ------------------------------
const leagueCode = '1864'
const season = '2022-2023'
const qiutanHeaders = {
  'Referer': `http://zq.titan007.com/cn/CupMatch/${leagueCode}.html`,
  'Host': 'zq.titan007.com'
}

const start_urls = [
  `${BASE_URL}letGoal/${season}/l${leagueCode}.js?flesh=${Math.random()}`,
  `${BASE_URL}bigSmall/${season}/bs${leagueCode}.js?flesh=${Math.random()}`,
  'http://zq.titan007.com/analysis/2202557sb.htm'
]

const matchTimeAddObj = {
  hostRecent: [
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' }
  ],
  awayRecent: [
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' }
  ],
  hostFuture: [
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' }
  ],
  awayFuture: [
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' },
    { matchTime: '02:45:00' }
  ]
}

const host = '法国'
const away = '克罗地亚'
const league = 'EuropeLeague'
const hostFormations = ['352']
const awayFormations = ['4231']

module.exports = {
  qiutanHeaders,
  start_urls,
  matchTimeAddObj,
  host,
  away,
  league,
  hostFormations,
  awayFormations
}