import request from '@/utils/request'

export function orderDetail(options) {
  return request({
    url: '/article/list',
    method: 'get',
    params: options
  })
}
