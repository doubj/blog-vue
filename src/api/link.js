import request from '@/utils/request'

export function getLinkList() {
  return request({
    url: '/links',
    method: 'get'
  })
}

export function updateLink(data) {
  return request({
    url: '/links',
    method: 'put',
    data: data
  })
}

export function addLink(data) {
  return request({
    url: '/links',
    method: 'post',
    data: data
  })
}

export function deleteLink(id) {
  return request({
    url: `/links/${id}`,
    method: 'delete'
  })
}
