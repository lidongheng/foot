function delay (fn, time) {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      fn && resolve(fn())
    }, time * 1000)
  })
}

async function main () {
  for (let i = 0; i < 10; i++) {
    await delay(() => { console.log('哈哈哈')}, 1)
  }
  console.log('完成了？')
}

exports.delay = delay