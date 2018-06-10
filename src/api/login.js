import request from '@/utils/request'

export function login(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/admin/login',
    method: 'post',
    params: data
  })
}

export function logout(query) {
  return request({
    url: '/admin/logout',
    method: 'post',
    params: query
  })
}

export function getUserInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

