import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  if (hasToken) {
    // 本地存有Token
    if (to.path === '/login') {
      // 如果有Token且路由是/login登录页，则跳转到后台首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 路由不是登录页
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 如果本地存有用户名，直接next
        next()
      } else {
        try {
          // 没有用户名，需要先去获取用户个人信息再next
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // 出错，重置Token并回到登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 若目标路由在白名单,next
      next()
    } else {
      // 否则回到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
