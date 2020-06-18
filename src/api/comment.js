import request from '@/utils/request'

export function getComments(query) {
    return request({
        url: '/comment/query',
        method: 'post',
        data:query
    })
}

export function addComment(data) {
    return request({
        url: '/comment',
        method: 'post',
        data: data
    })
}

export function deleteComment(id) {
    return request({
        url: `/comment/${id}`,
        method: 'delete',
    })
}