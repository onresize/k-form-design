// 防抖
let timeout = null
export function Debounce(func, delay = 200, event = {}, immediate = false) {
  if (timeout !== null) clearTimeout(timeout)
  // 立即执行，此类情况一般用不到
  if (immediate) {
    const callNow = !timeout
    timeout = setTimeout(() => {
      timeout = null
    }, delay)
    if (callNow) typeof func === 'function' && func(event)
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时delay毫秒后执行func回调方法
    timeout = setTimeout(() => {
      typeof func === 'function' && func(event)
    }, delay)
  }
}

/**
 * 节流原理：在一定时间内，只能触发一次
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */

let timer = null
export function Throttle(func, wait = 200, event = {}, immediate = true) {
  let flag = null
  if (immediate) {
    if (!flag) {
      flag = true
      // 如果是立即执行，则在wait毫秒内开始时执行
      typeof func === 'function' && func(event)
      timer = setTimeout(() => {
        flag = false
      }, wait)
    }
  } else if (!flag) {
    flag = true
    // 如果是非立即执行，则在wait毫秒内的结束处执行
    timer = setTimeout(() => {
      flag = false
      typeof func === 'function' && func(event)
    }, wait)
  }
}

// 深拷贝
export function deepClone(obj) {
  let newObj
  let type = Object.prototype.toString.call(obj)

  if (typeof obj != 'object' || obj == null) {
    if (type === '[object Date]') return new Date(obj)
    if (type === '[object RegExp]') return new RegExp(obj)
    if (type === '[object Symbol]') return Symbol(obj)
    return obj
  }

  newObj = obj instanceof Array ? [] : {}

  for (let i in obj) {
    newObj[i] =
      obj[i] instanceof Array || obj[i] instanceof Object
        ? deepClone(obj[i])
        : obj[i]
  }

  return newObj
}

const tool = {}

/* localStorage */
tool.data = {
  set(key, data, datetime = 0) {
    let cacheValue = {
      content: data,
      datetime:
        parseInt(datetime) === 0
          ? 0
          : new Date().getTime() + parseInt(datetime) * 1000,
    }
    return localStorage.setItem(key, JSON.stringify(cacheValue))
  },
  get(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key))
      if (value) {
        let nowTime = new Date().getTime()
        if (nowTime > value.datetime && value.datetime != 0) {
          localStorage.removeItem(key)
          return null
        }
        return value.content
      }
      return null
    } catch (err) {
      return null
    }
  },
  remove(key) {
    return localStorage.removeItem(key)
  },
  clear() {
    return localStorage.clear()
  },
}

export { tool }

/**
 * * JSON序列化，支持函数和 undefined
 * @param data
 */
export function JSONStringify(data) {
  return JSON.stringify(
    data,
    (key, val) => {
      // 处理函数丢失问题
      if (typeof val === 'function') {
        return `${val}`
      }
      // 处理 undefined 丢失问题
      if (typeof val === 'undefined') {
        return null
      }
      return val
    },
    2
  )
}

/**
 * * JSON反序列化，支持函数和 undefined
 * @param data
 */
export const JSONParse = (data) => {
  return JSON.parse(data, (k, v) => {
    // 还原函数值
    if (
      typeof v === 'string' &&
      v.indexOf &&
      (v.indexOf('function') > -1 || v.indexOf('=>') > -1)
    ) {
      return evalFn(`(function(){return ${v}})()`)
    } else if (
      typeof v === 'string' &&
      v.indexOf &&
      v.indexOf('return ') > -1
    ) {
      const baseLeftIndex = v.indexOf('(')
      if (baseLeftIndex > -1) {
        const newFn = `function ${v.substring(baseLeftIndex)}`
        return evalFn(`(function(){return ${newFn}})()`)
      }
    }
    return v
  })
}

/**
 * * 通过 a 标签下载数据
 * @param url
 * @param filename
 * @param fileSuffix
 */
export function downloadByA(url, filename = new Date().getTime(), fileSuffix) {
  const ele = document.createElement('a') // 创建下载链接
  ele.download = `YW_${filename}.${fileSuffix}` //设置下载的名称
  ele.style.display = 'none' // 隐藏的可下载链接
  // 字符内容转变成blob地址
  ele.href = url
  // 绑定点击时间
  document.body.appendChild(ele)
  ele.click()
  // 然后移除
  document.body.removeChild(ele)
}

/**
 * * 下载数据
 * @param { string } content 数据内容
 * @param { ?string } filename 文件名称（默认随机字符）
 * @param { ?string } fileSuffix 文件名称（默认随机字符）
 */
export function downloadTextFile(
  content,
  filename = new Date().getTime(),
  fileSuffix
) {
  // 字符内容转变成blob地址
  const blob = new Blob([content])
  downloadByA(URL.createObjectURL(blob), filename, fileSuffix)
}

/**
 * *获取上传的文件数据
 * @param { File } file 文件对象
 */
export const readFile = (file) => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader()
      reader.onload = (evt) => {
        if (evt.target) {
          resolve(evt.target.result)
        }
      }
      reader.readAsText(file)
    } catch (error) {
      window['$message'].error('文件读取失败！')
    }
  })
}

// 延迟函数
export const sleepFunc = (delay = 200) => {
  return new Promise((res) => setTimeout(res, delay))
}

// 判断一个对象的每个键是否都有值
export const allKeysHaveValue = (obj) => {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!obj[key]) {
        return false
      }
    }
  }
  return true
}

// 随机id
export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36) // 将时间戳转换为 36 进制字符串
  const randomNum = Math.random().toString(36).substr(2, 5) // 生成随机数并截取部分
  return timestamp + randomNum // 拼接时间戳和随机数
}

// 去除被'[]'包裹的字符返回内部的字符
export function removeSquareBrackets(str) {
  if (str.startsWith('[') && str.endsWith(']')) {
    return str.slice(1, -1)
  }
  return str
}

// 使用正则表达式匹配中文字符
export function containsChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str)
}

// 当日YYYY-MM-DD
export function getDay() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 时间戳转YYYY-MM-DD
export function timestampToChineseDate(timestamp, isMillisecond = true) {
  const msTimestamp = isMillisecond ? timestamp : timestamp * 1000
  const date = new Date(msTimestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
