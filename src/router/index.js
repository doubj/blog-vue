import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dash-board' }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    name: 'Blog',
    redirect: '/blog/list',
    meta: { title: '博客管理', icon: 'rizhilei' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/blog/list'),
        name: 'BlogList',
        meta: { title: '博客列表', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/blog/create'),
        name: 'CreateBlog',
        meta: { title: '添加博客', icon: 'edit' }
      },
      {
        path: 'edit/:blogId',
        component: () => import('@/views/blog/edit'),
        name: 'EditBlog',
        meta: { title: '编辑博客', activeMenu: '/blog/list' },
        hidden: true
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: 'Monitor',
    redirect: '/monitor/logs',
    meta: { title: '系统监控', icon: 'monitor' },
    children: [
      {
        path: 'logs',
        component: () => import('@/views/monitor/log'),
        name: 'LogList',
        meta: { title: '操作日志', icon: 'log' }
      },
      {
        path: 'errorLogs',
        component: () => import('@/views/monitor/errorLog'),
        name: 'ErrorLogList',
        meta: { title: '异常日志', icon: 'error' }
      }
    ]
  },
  {
    path: '/cloud',
    component: Layout,
    name: 'Cloud',
    redirect: '/cloud/list',
    meta: { title: '云存储', icon: 'monitor' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/cloud/index'),
        name: 'CloudList',
        meta: { title: '文件夹', icon: 'error' }
      },
      {
        path: 'dir/:name',
        component: () => import('@/views/cloud/items'),
        name: 'ImageItems',
        meta: { title: '图片列表', icon: 'error' }
      }
    ]
  },
  {
    path: '/link',
    component: Layout,
    redirect: '/link/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/friendlink/list'),
        name: 'FriendLinkList',
        meta: { title: '友链列表', icon: 'heart' }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/message/list'),
        name: 'MessageList',
        meta: { title: '评论列表', icon: 'heart' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router