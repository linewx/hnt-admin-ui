import request from '@/utils/request'

// 查询HntUser列表
export function listHntUser(query) {
  return request({
    url: '/api/v1/hnt-user',
    method: 'get',
    params: query
  })
}

// 查询HntUser详细
export function getHntUser(id) {
  return request({
    url: '/api/v1/hnt-user/' + id,
    method: 'get'
  })
}

// 新增HntUser
export function addHntUser(data) {
  return request({
    url: '/api/v1/hnt-user',
    method: 'post',
    data: data
  })
}

// 修改HntUser
export function updateHntUser(data) {
  return request({
    url: '/api/v1/hnt-user/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除HntUser
export function delHntUser(data) {
  return request({
    url: '/api/v1/hnt-user',
    method: 'delete',
    data: data
  })
}

// 用户状态修改
export function changeHntUserStatus(e) {
  const data = {
    id: e.id,
    status: e.status
  }
  return request({
    url: '/api/v1/hnt-user/status',
    method: 'put',
    data: data
  })
}

