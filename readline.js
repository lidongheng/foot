// readline 模块，有助于你快速掌握一只球队，成为那只球队的主力

const readline = require('readline')

// 创建readline接口实例
let r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
// 20% 加拿大女足vs特立尼达和多巴哥女足 
// 30% 金泉尚武vs济州联
// 40% 济州联vsFC首尔
// 50% 水原三星vs仁川联
// 60% 大阪樱花vs川崎前锋
// 70% 维京vs萝卜
// 80% 法国vs丹麦
// 90% 金泉尚武vs全北现代
// 使用question方法
r1.question('你想吃什么？', function (answer) {
  console.log(`我想吃${answer}`)
  r1.close()
})

//close事件监听
r1.on('close',function (){
  //结束程序
  process.exit(0)
})