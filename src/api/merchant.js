import request from '@/utils/request'
/**
 * 查询列表
 * @param {*} query 查询数据
 */
export function merchantList(query) {
  return request({
    url: '/admin/merchant/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询商户信息
 * @param {*} query  id
 */
export function queryMerchantInfo(query) {
  return request({
    url: '/admin/merchant/info',
    method: 'get',
    params: query
  })
}

/**
 * 新增|修改
 * @param {*} query 数据对象
 */
export function modifyMerchant(query) {
  return request({
    url: '/admin/merchant/modify',
    method: 'post',
    params: query
  })
}

/**
 * 删除商户
 * @param {*} query  id
 */
export function deleteMerchant(query) {
  return request({
    url: '/admin/merchant/delete',
    method: 'post',
    params: query
  })
}

/**
 * 查询银行
 */
export function queryBanks() {
  return request({
    url: '/admin/merchant/bank',
    method: 'get'
  })
}
