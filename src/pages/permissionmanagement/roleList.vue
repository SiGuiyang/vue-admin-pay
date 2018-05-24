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
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="saveOrUpdateTitle" :visible.sync="saveOrUpdate" center width="30%">
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveOrUpdate = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="权限" :visible.sync="permission" center width="40%">
      <el-tree
        :data="permissionData"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        highlight-current
        check-on-click-node=true
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permission = false">取 消</el-button>
        <el-button type="primary" @click="handlePermission">提 交</el-button>
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
        offset: 0,
        limit: 20,
        importance: undefined,
        username: undefined,
        type: undefined,
        sort: '+id',
        beginTime: '',
        endTime: ''
      },
      downloadLoading: false
    }
  },
  created() {
    this.roleList()
  },
  methods: {
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    handleNodeClick(data) {
      console.log(this.$refs.tree.getCheckedNodes())
      console.log(data)
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
      this.listQuery.limit = val
      this.roleList()
    },
    handleCurrentChange(val) {
      this.listQuery.offset = val
      this.roleList()
    },
    handleFilter() {
      this.listQuery.offset = 0
      this.roleList()
    },
    handleCreate() {

    },
    handleDownload() {
    },
    handleUpdate() {
      this.saveOrUpdate = true
    },
    handleDelete() { },
    handlePermissionDialog(data) {
      const params = {}
      this.id = data.id
      params.id = this.id
      getMenuList(params).then(response => {
        const record = response.record
        this.permissionData = record
        this.defaultCheckedKeys = response.data
        this.defaultExpandedKeys = response.data
      })
      this.permission = true
    },
    handlePermission() {
      const params = {}
      params.resIds = ''
      const checkedKeys = this.$refs.tree.getCheckedNodes()
      console.log(checkedKeys)
      for (let i = 0; i < checkedKeys.length; i++) {
        params.resIds += checkedKeys[i].id + ','
      }
      params.id = this.id
      console.log(this.$refs.tree.getCheckedNodes(true))
      givePermission(params).then(data => {
        this.roleList()
        this.permission = false
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>


