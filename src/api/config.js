import request from '@/utils/request'
/**
 * 配置项列表
 */
export function getConfigList(query) {
  return request({
    url: '/admin/config/list',
    method: 'get',
    params: query
  })
}
/**
 * 配置项详情
 * @param {*} query
 */
export function getConfigInfo(query) {
  return request({
    url: '/admin/config/info',
    method: 'get',
    params: query
  })
}
/**
 * 修改配置项
 * @param {*} query
 */
export function modifyConfig(query) {
  return request({
    url: '/admin/config/modify',
    method: 'get',
    params: query
  })
}

/**
 * 更新redis配置项爱你个缓存
 */
export function modifyConfigCache(query) {
  return request({
    url: '/admin/config/cache',
    method: 'get',
    params: query
  })
}
