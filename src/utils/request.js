import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: 'http://localhost:8088/admin', 
  timeout: 5000 
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // console.log(response)
    const { code, data, msg } = response.data
    // 没有错误data就是返回的数据，有错误则data包括code状态码，msg错误信息
    if (code !== 200) {
      Message({
        message: msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 401: Token失效,重新登录
      if (code === 401) {
        // to re-login
        MessageBox.confirm(msg, '重新登录', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(msg || 'Error'))
    } else {
      return data
    }
  },
  error => {
    console.log('err' + error) 
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
