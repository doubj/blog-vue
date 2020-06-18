import request from '@/utils/request'

export function getCategories() {
  return request({
    url: '/categories',
    method: 'get'
  })
}

export function getTags() {
  return request({
    url: '/tags',
    method: 'get'
  })
}

export function addBlog(data) {
  return request({
    url: '/blog',
    method: 'post',
    data: data
  })
}

export function updateBlog(data) {
  return request({
    url: '/blog',
    method: 'put',
    data: data
  })
}

export function getBlog(id) {
  return request({
    url: `/blog/${id}`,
    method: 'get'
  })
}

export function modifyStatus(id, status) {
  return request({
    url: `/blog/status/${id}`,
    method: 'patch',
    params: { status }
  })
}

export function getListByQuery(query) {
  return request({
    url: '/blog/query',
    method: 'post',
    data: query
  })
}
