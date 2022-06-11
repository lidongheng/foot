const fs = require('fs')
const path = require('path')
const ora = require('ora')

const { delay, loadOne, loadIndex } = require('./getIndex')

const fsPromise = async function (path, content, config) {
  return new Promise((resolve, rejected) => {
    fs.writeFile(path, content, config, function (err) {
      if (err) {
        rejected(err)
      } else {
        resolve()
      }
    })
  })
}

async function main () {
  const delayTime = 3
  const spinner = ora(`正在爬取主站, 爬取时间为${delayTime}秒`)
  spinner.start()
  const linksArr = await loadIndex(delayTime)
  spinner.succeed()
  spinner.stop()
  console.log(`爬取主站完成, 主站分链接为\n${linksArr.join('\n')}`)

  for (let [index, item] of linksArr.entries()) {
    const delayTime = 1
    const spinner = ora(`正在爬取单页${index + 1},等待时间为${delayTime}秒\n`)
    spinner.start()
    const html = await delay(() => loadOne(item), delayTime)
    spinner.succeed()
    spinner.stop()

    console.log(`爬取完成，正在写入文件\n`)
    await fsPromise(
      path.join(__dirname, `../dist/page${index + 1}.html`),
      html,
      'utf8'
    )
    console.log(`页面${index + 1}写入完成\n`)
  }
}

main()