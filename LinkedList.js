// 封装链表
function LinkedList () {
    function Nodes (data) {
      this.data = data
      this.next =null
    }
    this.header = null
    this.length = 0
    LinkedList.prototype.append = function (data) {
      var newNode = new Nodes(data)
      if (this.length === 0) {
        newNode.next = this.header
        this.header = newNode
      } else {
        var currentNode = this.header
        while(currentNode.next) {
          currentNode = currentNode.next
        }
        currentNode.next = newNode
      }
      this.length += 1
    }
    LinkedList.prototype.insert = function (position, data) {
      if (position < 0 || position > this.length) return false
      var newNode = new Nodes(data)
      if (this.length === 0) {
        newNode.next = this.header
        this.header = newNode
      } else {
        var prevNode = null
        var index = 0
        var currentNode = this.header
        while (index++ < position) {
          prevNode = currentNode
          currentNode = currentNode.next
        }
        newNode.next = currentNode
        prevNode.next = newNode
      }
      this.length += 1
      return true
    }
    LinkedList.prototype.get = function (position) {
      if (position < 0 || position >= this.length) return false
      let index = 0
      let currentNode = this.header
      while (index++ < position) {
        currentNode = currentNode.next
      }
      return currentNode.data
    }
    LinkedList.prototype.indexOf = function (element) {
      let index = 0
      let currentNode = this.header
      while (index < this.length) {
        if (currentNode.data === element) {
          return index
        } else {
          currentNode = currentNode.next
          index++
        }
      }
    }
    LinkedList.prototype.update = function (position, data) {
      if (position < 0 || position >= this.length) return false
      let index = 0
      currentNode = this.header
      while(index < position) {
        currentNode = currentNode.next
        index++
      }
      currentNode.data = data
      return true
    }
    LinkedList.prototype.removeAt = function (position) {
      if (position < 0 || position >= this.length) return false
      if (position === 0) {
        this.header = this.header.next
      } else {
        let index = 0
        let prevNode = null
        let currentNode = this.header
        while (index < position) {
          prevNode = currentNode
          currentNode = currentNode.next
        }
        prevNode.next = currentNode.next
      }
      this.length -= 1
      return true
    }
    LinkedList.prototype.remove = function (data) {
      let index = 0
      let prevNode = null
      currentNode = this.header
      while (index < this.length) {
        if (currentNode.data === data) {
          if (index === 0) {
            this.header = currentNode.next
            return true
          } else {
            prevNode.next = currentNode.next
            return true
          }
        } else {
          prevNode = currentNode
          currentNode = currentNode.next
        }
      }
      return false
    }
    LinkedList.prototype.isEmpty = function () {
      return this.length === 0
    }
    LinkedList.prototype.size = function () {
      return this.length
    }
    LinkedList.prototype.toString = function () {
      let currentNode = this.header
      let listString = ''
      while(currentNode) {
        listString += currentNode.data + ' '
        currentNode = currentNode.next
      }
      return listString
    }
  }

module.exports = LinkedList