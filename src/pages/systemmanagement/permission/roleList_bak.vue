<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="用户名" v-model="listQuery.username">
      </el-input>
      <el-button type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中。。。" border fit highlight-current-row
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" :label="$t('table.id')" width="55">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="角色代码">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handlePermissionDialog(scope.row)">{{$t('table.editPermission')}}</el-button>
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="success" size="small" @click="handleDelete(scope.row,'published')">{{$t('table.publish')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="saveOrUpdateTitle" :visible.sync="saveOrUpdate" center width="30%">
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveOrUpdate = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="权限" :visible.sync="permission" center width="40%" height="50%">
      <el-tree
        :data="permissionData"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        highlight-current
        check-on-click-node=true
        @check="handleChange"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permission = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getMenuList, givePermission } from '@/api/permission'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'userList',
  directives: {
    waves
  },
  data() {
    return {
      permissionData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      id: undefined,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      permission: false,
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      saveOrUpdate: false,
      saveOrUpdateTitle: '编辑',
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        importance: undefined,
        username: undefined,
        type: undefined,
        sort: '+id',
        beginTime: '',
        endTime: ''
      },
      router: {
        id: undefined,
        label: undefined,
        children: []
      },
      downloadLoading: false
    }
  },
  created() {
    this.roleList()
  },
  methods: {
    handleChange(data, node) {
      const currentNode = this.$refs.tree.getNode(data.id)

      if (currentNode.checked) {
        const router = { id: '', lable: '', children: [] }
        router.id = currentNode.data.id
        router.label = currentNode.data.label
        router.children = this.fetchChild(currentNode.childNodes)
        // 当前节点是否是顶级节点
        if (currentNode.level !== 1) {
          const parent = { id: '', label: '', children: [] }
          parent.id = currentNode.parent.data.id
          parent.label = currentNode.parent.data.label
          parent.children.push(router)
          // 当前节点的父节点是否是顶级节点
          if (currentNode.parent.level !== 1) {
            // 此处处理防止顶级节点为空，只有子节点的现象
            const temp = this.fetchParent(currentNode.parent)
            temp.children.push(parent)
            temp.roleId = this.id
            console.log(JSON.stringify(temp))
            givePermission({ requestModel: encodeURIComponent(JSON.stringify(temp)) }).then(response => {

            })
            return
          } else {
            parent.roleId = this.id
            givePermission({ requestModel: encodeURIComponent(JSON.stringify(parent)) }).then(response => {

            })
            return
          }
        }
        router.roleId = this.id
        givePermission({ requestModel: encodeURIComponent(JSON.stringify(router)) }).then(response => {

        })
      }
      console.log(this.router)
    },
    fetchChild(nodes, routers = []) {
      // 迭代遍历子节点
      for (let i = 0; i < nodes.length; i++) {
        const router = {}
        if (nodes[i].checked) {
          router.id = nodes[i].data.id
          router.label = nodes[i].data.label
          if (nodes[i].childNodes.length > 0) {
            const children = []
            router.children = this.fetchChild(nodes[i].childNodes, children)
          }
        }
        routers.push(router)
      }
      return routers
    },
    fetchParent(node, routers = []) {
      // 迭代遍历父节点
      const router = { id: '', label: '', children: [] }
      if (node.level !== 1) {
        router.id = node.parent.data.id
        router.label = node.parent.data.label
        const children = []
        this.fetchParent(node.parent, children)
        routers.push(router)
      }
      return routers
    },
    roleList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
        this.list = response.record
        this.total = response.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.roleList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.roleList()
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.roleList()
    },
    handleCreate() {

    },
    handleUpdate() {
      this.saveOrUpdate = true
    },
    handleDelete() { },
    handlePermissionDialog(data) {
      // 每次点击权限设置按钮置空原先的值
      this.permissionData = []
      this.defaultExpandedKeys = []
      const params = {}
      this.id = data.id
      params.id = this.id
      getMenuList(params).then(response => { // 获取权限菜单
        const record = response.record
        this.permissionData = this.filterAsyncRouter(record)
        this.defaultCheckedKeys = response.data
        this.defaultExpandedKeys = response.data
      })
      this.permission = true
    },
    filterAsyncRouter(asyncRouterMap, routers = []) { // 渲染权限路由列表
      for (let i = 0; i < asyncRouterMap.length; i++) {
        const router = {}
        router.id = asyncRouterMap[i].id
        router.name = asyncRouterMap[i].name
        router.label = this.$t('route.' + asyncRouterMap[i].label)
        router.path = asyncRouterMap[i].path

        if (asyncRouterMap[i].children && asyncRouterMap[i].children !== undefined && asyncRouterMap[i].children.length > 0) {
          const children = []
          router.children = this.filterAsyncRouter(asyncRouterMap[i].children, children)
        }
        routers.push(router)
      }
      return routers
    }
  }
}
</script>
