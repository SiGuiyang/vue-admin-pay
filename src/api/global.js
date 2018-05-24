import request from '@/utils/request'

export function getRouters(query) {
  return request({
    url: '/admin/routers',
    method: 'get',
    params: query
  })
}
