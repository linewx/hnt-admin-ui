import request from '@/utils/request'

// 查询HntAccount列表
export function listHntAccount(query) {
    return request({
        url: '/api/v1/hnt-account',
        method: 'get',
        params: query
    })
}

// 查询HntAccount详细
export function getHntAccount (id) {
    return request({
        url: '/api/v1/hnt-account/' + id,
        method: 'get'
    })
}


// 新增HntAccount
export function addHntAccount(data) {
    return request({
        url: '/api/v1/hnt-account',
        method: 'post',
        data: data
    })
}

// 修改HntAccount
export function updateHntAccount(data) {
    return request({
        url: '/api/v1/hnt-account/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除HntAccount
export function delHntAccount(data) {
    return request({
        url: '/api/v1/hnt-account',
        method: 'delete',
        data: data
    })
}

