import request from '@/utils/request'
/**
 * 用户列表
 */
export function getUserList(query) {
  return request({
    url: '/admin/permission/user/list',
    method: 'get',
    params: query
  })
}

/**
 * 角色列表
 */
export function getRoleList(query) {
  return request({
    url: '/admin/permission/role/list',
    method: 'get',
    params: query
  })
}

/**
 * 菜单列表
 */
export function getMenuList(query) {
  return request({
    url: '/admin/permission/menu/list',
    method: 'get',
    params: query
  })
}

export function givePermission(query) {
  return request({
    url: '/admin/permission',
    method: 'get',
    params: query
  })
}
