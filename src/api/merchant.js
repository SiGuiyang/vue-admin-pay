import request from '@/utils/request'

export function merchantList(query) {
  return request({
    url: '/admin/merchant/list',
    method: 'get',
    params: query
  })
}
