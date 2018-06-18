import request from '@/utils/request'
/**
 * 订单列表
 */
export function queryOrderList(query) {
  return request({
    url: '/admin/order/list',
    method: 'get',
    params: query
  })
}
