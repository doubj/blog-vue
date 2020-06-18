import request from '@/utils/request'

export function getListByQuery(query) {
  return request({
    url: '/log/query',
    method: 'post',
    data: query
  })
}

export function getDetailById(id) {
  return request({
    url: `/log/${id}`,
    method: 'get'
  })
}

export function deleteLogByType(type) {
  return request({
    url: `/log/${type}`,
    method: 'delete'
  })
}
