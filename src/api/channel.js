import request from '@/utils/request'
/**
 * 渠道支付方式
 */
export function channelPayType() {
  return request({
    url: '/admin/channel/payType',
    method: 'get'
  })
}

/**
 * 获取支付中心信息
 * @param {*} query id
 */
export function queryChannelCenterInfo(query) {
  return request({
    url: '/admin/channel/center/info',
    method: 'get',
    params: query
  })
}

/**
 * 修改支付中心
 * @param {*} query 数据
 */
export function modifyPayChannelCenter(query) {
  return request({
    url: '/admin/channel/center/modify',
    method: 'post',
    params: query
  })
}
/**
 * 查询列表
 * @param {*} query 查询参数
 */
export function payChannelCenterList(query) {
  return request({
    url: '/admin/channel/center/list',
    method: 'get',
    params: query
  })
}
/**
 * 删除支付中心
 * @param {*} query id
 */
export function deletePayChannelCenter(query) {
  return request({
    url: '/admin/channel/center/delete',
    method: 'get',
    params: query
  })
}

/**
 * 支付渠道列表
 */
export function payChannelList(query) {
  return request({
    url: '/admin/channel/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询支付渠道信息
 * @param {*} query id
 */
export function queryPayChannelInfo(query) {
  return request({
    url: '/admin/channel/info',
    method: 'get',
    params: query
  })
}
/**
 * 修改支付渠道
 * @param {*} query 入参
 */
export function modifyPayChannel(query) {
  return request({
    url: '/admin/channel/modify',
    method: 'post',
    params: query
  })
}

/**
 * 修改支付渠道
 * @param {*} query 入参
 */
export function deletePayChannel(query) {
  return request({
    url: '/admin/channel/delete',
    method: 'get',
    params: query
  })
}

/**
 * 查询可用的支付渠道
 */
export function queryChannelEnable() {
  return request({
    url: '/admin/channel/center/enable',
    method: 'get'
  })
}
