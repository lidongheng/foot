// // 这是浅拷贝
// function lightClone (target) {
//   let cloneTarget = {}
//   for (let key in target) {
//     cloneTarget[key] = target[key]
//   }
//   return cloneTarget
// }

// let newObj = lightClone(obj)

// // 实现深拷贝的步骤一：只拷贝自己的，不拷贝原型上的

// function deepClone1 (target) {
//   let cloneTarget = {}
//   for (let key in target) {
//     if (target.hasOwnProperty(key)) {
//       cloneTarget[key] = target[key]
//     }
//   }
//   return cloneTarget
// }

// // 实现深拷贝的步骤二：为递归做准备
// function deepClone2 (target) {
//   if (typeof target === 'object') {
//     let cloneTarget = {}
//     for (let key in target) {
//       if (target.hasOwnProperty(key)) {
//         // target[key]也可能是对象
//         cloneTarget[key] = target[key]
//       }
//     }
//     return cloneTarget
//   } else {
//     return target
//   }
// }

// // 实现深拷贝步骤三：这是个基本的深拷贝，但是没有解决循环引用问题
// function deepClone3 (target) {
//   if (target == null) return null
//   if (target instanceof Date) return new Date(target)
//   if (target instanceof RegExp) return new RegExp(target)
//   if (typeof target !== 'object') return target
//   let cloneTarget = new target.constructor
//   for (let key in target) {
//     if (target.hasOwnProperty(key)) {
//       cloneTarget[key] = deepClone3(target[key])
//     }
//   }
//   return cloneTarget
// }

function deepClone4 (target, map = new WeakMap()) {
  if (target == null) return null
  if (target instanceof Date) return new Date(target)
  if (target instanceof RegExp) return new RegExp(target)
  if (typeof target !== 'object') return target
  let cloneTarget = new target.constructor
  if (map.get(target)) return target
  map.set(target, cloneTarget)
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      if (target[key] && typeof target[key] === 'object') {
        cloneTarget[key] = deepClone4(target[key], map)
      } else {
        cloneTarget[key] = target[key]
      }
    }
    
  }
  return cloneTarget
}

let obj = {
  name: '李东恒',
  hobby: ['篮球', '足球', '睡觉', {name: '排球'}]
}
// obj.obj = obj
let newObj = deepClone4(obj)
obj.name = 'aaaa'
console.log(newObj)