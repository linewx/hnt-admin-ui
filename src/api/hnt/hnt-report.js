import request from '@/utils/request'

// 查询HntReport列表
export function listHntReport(query) {
    return request({
        url: '/api/v1/hnt-report',
        method: 'get',
        params: query
    })
}

// 查询HntReport详细
export function getHntReport (id) {
    return request({
        url: '/api/v1/hnt-report/' + id,
        method: 'get'
    })
}


// 新增HntReport
export function addHntReport(data) {
    return request({
        url: '/api/v1/hnt-report',
        method: 'post',
        data: data
    })
}

// 修改HntReport
export function updateHntReport(data) {
    return request({
        url: '/api/v1/hnt-report/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除HntReport
export function delHntReport(data) {
    return request({
        url: '/api/v1/hnt-report',
        method: 'delete',
        data: data
    })
}

