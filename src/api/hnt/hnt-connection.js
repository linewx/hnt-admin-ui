import request from '@/utils/request'

// 查询HntConnection列表
export function listHntConnection(query) {
    return request({
        url: '/api/v1/hnt-connection',
        method: 'get',
        params: query
    })
}

// 查询HntConnection详细
export function getHntConnection (id) {
    return request({
        url: '/api/v1/hnt-connection/' + id,
        method: 'get'
    })
}


// 新增HntConnection
export function addHntConnection(data) {
    return request({
        url: '/api/v1/hnt-connection',
        method: 'post',
        data: data
    })
}

// 修改HntConnection
export function updateHntConnection(data) {
    return request({
        url: '/api/v1/hnt-connection/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除HntConnection
export function delHntConnection(data) {
    return request({
        url: '/api/v1/hnt-connection',
        method: 'delete',
        data: data
    })
}

