import request from '@/utils/request'

export function getVisits() {
  return request({
    url: '/dashboard/visits',
    method: 'get'
  })
}

export function getArticleCount() {
  return request({
    url: '/dashboard/blog',
    method: 'get'
  })
}

export function getMessageCount() {
  return request({
    url: '/dashboard/message',
    method: 'get'
  })
}

export function getLogCount() {
  return request({
    url: '/dashboard/log',
    method: 'get'
  })
}

export function getArticleStatistic() {
  return request({
    url: '/dashboard/blog/month',
    method: 'get'
  })
}

export function getCategoryStatistic() {
  return request({
    url: '/dashboard/categories',
    method: 'get'
  })
}

export function getTagStatistic() {
  return request({
    url: '/dashboard/tags',
    method: 'get'
  })
}

