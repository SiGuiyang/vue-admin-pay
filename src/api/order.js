import request from '@/utils/request'

export function orderDetail(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}
