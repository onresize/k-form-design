import axios from 'axios'
import { tool } from './tools'

const isDEV = process.env.NODE_ENV == 'dev'

// console.log('接口地址：', process.env.VUE_APP_BASE_URL)

let baseURL = isDEV ? process.env.VUE_APP_BASE_URL : 'http://192.168.1.65:2801'
// let baseURL = 'http://192.168.1.65:2801'
const instance = axios.create({
  baseURL,
  timeout: 30e3,
})

// 请求头
instance.interceptors.request.use(
  function(config) {
    let token = tool.data.get('tk')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

// 响应头
instance.interceptors.response.use(
  function(response) {
    const msg = response.data.message
    if (msg) {
      if (response.data.code == '40001') {
        setTimeout(() => {
          localStorage.clear()

          let exp = new Date()
          exp.setTime(exp.getTime() - 1)
          document.cookie = `TOKEN=;expires=${exp.toGMTString()}`

          window.parent.location.href = isDEV
            ? 'http://192.168.1.229:2888/#/login'
            : 'http://192.168.1.65:2800/#/login'
        }, 1e3)

        return this.$notification.open({
          key: '提示',
          message: '用户未登录，即将自动跳转登录页. . .',
        })
      }

      if (response.data.code != 200) {
        this.$notification.open({
          key: '提示',
          message: msg || '出错了',
        })
      }
    }
    return response.data
  },
  function(error) {
    if (error && error.response) {
      switch (error.response.status) {
        default:
          this.$message.error(error.response.data.message)
          break
      }
    }
    return Promise.reject(error)
  }
)

export default instance
