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
 * 用户信息
 */
export function getUserInfo(query) {
  return request({
    url: '/admin/permission/user/info',
    method: 'get',
    params: query
  })
}

/**
 * 添加|修改用户
 */
export function addOrModifyUser(query) {
  return request({
    url: '/admin/permission/user/add',
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
    method: 'post',
    params: query
  })
}
/**
 * 角色信息
 * @param {*} query
 */
export function getRoleInfo(query) {
  return request({
    url: '/admin/permission/role/info',
    method: 'get',
    params: query
  })
}

/**
 * 添加|修改角色
 */
export function addRole(query) {
  return request({
    url: '/admin/permission/role/add',
    method: 'get',
    params: query
  })
}

/**
 * 获取角色代码
 */
export function getRoleCodes() {
  return request({
    url: '/admin/getRoleCode',
    method: 'get'
  })
}
/**
 * 获取全部角色
 */
export function getRoles() {
  return request({
    url: '/admin/permission/roles',
    method: 'get'
  })
}
