import { constantRouterMap } from '@/router'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
/**
 * 递归过滤异步路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, routers = []) {
  for (let i = 0; i < asyncRouterMap.length; i++) {
    const router = {}
    const meta = {}
    router.name = asyncRouterMap[i].name
    router.path = asyncRouterMap[i].path
    router.hidden = asyncRouterMap[i].hidden
    if (asyncRouterMap[i].redirect && asyncRouterMap[i].redirect !== undefined) {
      router.redirect = asyncRouterMap[i].redirect
    }
    router.component = _import(asyncRouterMap[i].component)
    if (asyncRouterMap[i].meta && asyncRouterMap[i].meta !== undefined) {
      meta.title = asyncRouterMap[i].meta.title
      meta.icon = asyncRouterMap[i].meta.icon
      router.meta = meta
    }
    if (asyncRouterMap[i].children && asyncRouterMap[i].children !== undefined && asyncRouterMap[i].children.length > 0) {
      const children = []
      router.children = filterAsyncRouter(asyncRouterMap[i].children, children)
    }
    routers.push(router)
  }
  return routers
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { routers } = data.record
        const accessedRouters = filterAsyncRouter(routers)
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
