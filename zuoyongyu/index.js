// 作用域：全局作用域和函数作用域
// var a = 123
// function fn1 () {
//   console.log(a) // 123
//   var b = 234
// }
// console.log(b) // b is not defined

//------------------------------------

/* 这是一个最简单的闭包(主要作用：外部访问不到内部的变量，内部的能访问外部的) */
/* 知识点：闭包是定义在一个函数内部的函数，他能够读取其它函数内部变量的函数 */
/* 最大的特点：能记住他诞生的环境 */ 
// var a = 123
// function fn1 () {
//   console.log(a) // 123
//   var b = 234
//   function fn2 () {
//     console.log(b)
//   }
//   return fn2
// }
// var result = fn1()
// result() // 234

//------------------------------------

// 闭包应用1，计数器
// function a () {
//   var start = 0
//   function b () {
//     return start++
//   }
//   return b
// }
// var inc = a()
// console.log(inc())
// console.log(inc())
// console.log(inc())
// inc = null

// 闭包应用2：封装对象的私有属性和方法
// function Person (name) {
//   var age
//   function setAge (n) {
//     age = n
//   }
//   function getAge () {
//     return age
//   }
//   return {
//     name: name,
//     setAge: setAge,
//     getAge: getAge
//   }
// }
// var p1 = new Person('mj')
// p1.setAge(18)
// p1.getAge()
// p1 = null

// 注意点：使用闭包使得函数中的变量始终在内存中，内存消耗很大，所以不能滥用闭包，否则会造成页面的性能问题
// 总结：1.函数嵌套 2.访问所在的作用域 3.在所在的作用域外被调用
// 每个父函数调用完成，都会形成新的闭包，父函数中的变量始终会在内存中，相当于缓存，小心内存的消耗问题

// 如果function出现在行首，一律解释成函数声明语句

// ()是表达式 下面是两种常用写法
// (function(){})()
// (function(){}())

// + - ~ !
// 通常写自执行函数的时候，加个+ - ~ !,避免(function(){})()(function(){}())报错

// 再谈为什么用闭包做计数器最合适
// 1.可以避免污染全局环境。
// 2.有些人说我用函数的自定义属性也行。但是在全局环境中，你也可以无意修改它。最安全还是用闭包

// 立即执行函数也叫闭包
// (function () {
//   return function () {

//   }
// })

var add = (function () {
  var count = 0
  return function () {
    return ++count
  }
})()
console.log(add())
console.log(add())
console.log(add())