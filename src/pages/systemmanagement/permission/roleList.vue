<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.roleName')" v-model="listQuery.username">
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
      <el-table-column width="120px" align="center" :label="$t('table.roleName')">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.roleCode')">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('table.remark')">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('status.name')">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.serverStatus == 1">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.serverStatus == 0">禁用</el-tag>        
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" :label="$t('time.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handlePermissionDialog(scope.row)">{{$t('table.editPermission')}}</el-button>
          <el-button type="primary" size="small" @click="handleModify(scope.row)">{{$t('table.edit')}}</el-button>          
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="saveOrModifyTitle" :visible.sync="saveOrModify" center width="30%">
      <el-form :model="theForm" ref="theForm" label-width="100px">
        <el-form-item :label="$t('table.roleName')" prop="roleName">
          <el-input v-model="theForm.roleName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.roleCode')" prop="roleCode">
          <el-select v-model="theForm.roleCode" :placeholder="$t('table.pleaseSelect')">
            <el-option v-for="roleCode in rolecodes" :key="roleCode.id" :label="roleCode.description" :value="roleCode.configValue"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('status.name')" prop="roleCode">
          <el-select v-model="theForm.serverStatus" :placeholder="$t('table.pleaseSelect')">
            <el-option v-for="status in serverStatus" :key="status.id" :label="status.name" :value="status.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.remark')" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="theForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{this.$t('table.immediatelyCreate')}}</el-button>
          <el-button @click="theForm = {}">{{this.$t('table.reset')}}</el-button>
        </el-form-item>
      </el-form>
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
import { getRoleList, getMenuList, givePermission, getRoleInfo, getRoleCodes, addRole } from '@/api/permission'
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
      saveOrModify: false,
      saveOrModifyTitle: '编辑',
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
      rolecodes: [],
      serverStatus: [{ id: 1, name: '正常' }, { id: 0, name: '禁用' }],
      router: {
        id: undefined,
        label: undefined,
        children: []
      },
      theForm: {},
      downloadLoading: false
    }
  },
  created() {
    this.roleList()
    this.initRoleCodes()
  },
  methods: {
    initRoleCodes() {
      const params = {}
      getRoleCodes(params).then(response => {
        if (response.code === 200) {
          this.rolecodes = response.data
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleChange(data, node) {
      console.log(this.$refs.tree.getNode(data.id))
      console.log(node)
      let nodes = ''
      for (let i = 0; i < node.checkedKeys.length; i++) {
        nodes += node.checkedKeys[i] + ','
      }
      for (let i = 0; i < node.halfCheckedKeys.length; i++) {
        nodes += node.halfCheckedKeys[i] + ','
      }
      if (nodes.length > 0) {
        const params = {}
        params.id = this.id
        params.resIds = nodes
        givePermission(params).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: response.msg
            })
          } else {
            this.$message.error(response.msg)
          }
        })
      }
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
      this.saveOrModify = true
      this.saveOrModifyTitle = this.$t('table.add')
      this.theForm = {}
    },
    submitForm() {
      addRole(this.theForm).then(response => {
        if (response.code === 200) {
          this.$message({
            type: 'success',
            message: response.msg
          })
        } else {
          this.$message.error(response.msg)
        }
        this.saveOrModify = false
        this.roleList()
      })
    },
    handleModify(data) {
      this.saveOrModify = true
      this.saveOrModifyTitle = this.$t('table.edit')
      const params = {}
      params.id = data.id
      getRoleInfo(params).then(response => {
        if (response.code === 200) {
          this.theForm = response.data
        } else {
          this.$message.error(response.msg)
        }
      })
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
