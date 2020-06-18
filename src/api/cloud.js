import request from '@/utils/request'

export function getAllDir() {
    return request({
        url: '/cloud/dir',
        method: 'get'
    })
}

export function getImageByDir(prefix) {
    return request({
        url: '/cloud/img',
        method: 'get',
        params: { prefix }
    })
}

export function addDir(data) {
    return request({
        url: '/cloud/dir',
        method: 'post',
        data: data
    })
}

export function deleteImage(dirName,name) {
    return request({
      url: `/cloud/img`,
      method: 'delete',
      params:{dirName,name}
    })
  }