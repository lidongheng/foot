const { dateFormat } = require('../utils')

// 模块二：分析比赛的基础信息
// 日职联 START --------------------------------
// 联赛代码
const leagueCode = '22'
// 赛季
const season = '2022'
// 轮次
const round = 12
// 主队
const host = '维京'
// 客队
const away = '罗森博格'
// 联赛
const league = 'Eliteserien'
// 主队阵型
const hostFormations = ['433']
// 客队阵型
const awayFormations = ['433']
// 亚盘拉力
const yapan = host
// 大小拉力
const daxiao = '大'
// 模块一：不常变动的数据
const BASE_URL = 'http://zq.titan007.com/jsData/'
const qiutanHeaders = {
  'Referer': `http://zq.titan007.com/cn/${season.indexOf('-') > -1 ? 'League/' + leagueCode : 'SubLeague/' + leagueCode}.html`,
  'Host': 'zq.titan007.com'
}
// ${BASE_URL}timeDistri/${season}/td${leagueCode}.js?flesh=${Math.random()}
// 本期暂时不抓取
// 爬虫页面 943 313
const start_urls = [
  `${BASE_URL}matchResult/${season}/s${leagueCode}.js?version=${dateFormat(new Date().getTime(), 'YYYYMMDDHH')}`,
  `${BASE_URL}letGoal/${season}/l${leagueCode}.js?flesh=${Math.random()}`,
  `${BASE_URL}bigSmall/${season}/bs${leagueCode}.js?flesh=${Math.random()}`,
  'http://zq.titan007.com/analysis/2142709cn.htm'
]
// 比赛补充时间
const matchTimeAddObj = {
  awayRecent: [
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' }
  ],
  hostRecent: [
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' }
  ],
  hostFuture: [
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' }
  ],
  awayFuture: [
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' },
    { matchTime: '18:00:00' }
  ]
}

module.exports = {
  qiutanHeaders,
  start_urls,
  matchTimeAddObj,
  host,
  away,
  league,
  hostFormations,
  awayFormations,
  round,
  yapan,
  daxiao,
  season
}