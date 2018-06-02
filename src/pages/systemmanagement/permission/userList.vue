<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="用户名" v-model="listQuery.username">
      </el-input>
      <el-date-picker style="width: 360px;"        
        v-model="queryTime"
        type="datetimerange"
        format="yyyy-MM-dd"
        @change="getTime"
        range-separator="至" 
        start-placeholder="开始日期" 
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中。。。" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" :label="$t('table.id')" width="55">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.username')">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.mobile')">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.roleName')">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('status.name')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.serverStatus | userStatus">{{scope.row.serverStatus | userStatusDescription}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>          
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="saveOrUpdateTitle" :visible.sync="saveOrUpdate" center width="60%">
      <el-form :model="theForm" ref="theForm" label-width="120px">
        <el-form-item prop="username" :label="$t('table.username')">
          <el-input v-model="theForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('login.password')">
          <el-input v-model="theForm.password" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" :label="$t('table.mobile')">
          <el-input v-model="theForm.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="roleId" :label="$t('table.roleName')">
          <el-radio-group v-model="theForm.roleId" size="small">
            <el-radio-button v-for="role in roles" :key="role.id" :label="role.id">{{role.roleName}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="serverStatus" :label="$t('status.name')">
          <el-select v-model="theForm.serverStatus" :placeholder="$t('status.name')">
            <el-option v-for="status in userStatus" :key="status.id" :label="status.name" :value="status.value"></el-option>              
          </el-select>
        </el-form-item>

        <el-form-item prop="age" :label="$t('table.age')">
          <el-input v-model="theForm.age"></el-input>
        </el-form-item>

        <el-form-item prop="gender" :label="$t('table.gender')">
          <el-radio-group v-model="theForm.gender" size="small">
            <el-radio-button label="M">男</el-radio-button>
            <el-radio-button label="F">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birthday" :label="$t('table.birthday')">
          <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('table.birthday')" v-model="theForm.birthday" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{immediatelyCreate}}</el-button>
          <el-button @click="handleReset">{{this.$t('table.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getUserInfo, addOrModifyUser, getRoles } from '@/api/permission'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
const statusMap = {
  2: 'success',
  4: 'danger',
  user: {
    2: '正常',
    4: '注销'
  }
}
export default {
  name: 'userList',
  directives: {
    waves
  },
  filters: {
    userStatus(status) {
      return statusMap[status]
    },
    userStatusDescription(status) {
      return statusMap.user[status]
    }

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      queryTime: '',
      listLoading: true,
      id: '',
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
      theForm: {},
      roles: [],
      userStatus: [{ id: 1, name: '请选择', value: '' }, { id: 2, name: '正常', value: 2 }, { id: 3, name: '注销', value: 4 }],
      isIndeterminate: true,
      saveOrUpdate: false,
      disabled: false,
      saveOrUpdateTitle: '编辑',
      immediatelyCreate: '',
      password: '',
      downloadLoading: false,
      roleCodes: []
    }
  },
  created() {
    this.userList()
    this.handlerRoles()
  },
  methods: {
    userList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.record
        this.total = response.total
        this.listLoading = false
      })
    },
    handlerRoles() {
      getRoles().then(response => {
        if (response.code === 200) {
          this.roles = response.data
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    getTime(val) {
      console.log(val)
      if (val === null || val === undefined) {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      } else {
        this.listQuery.beginTime = parseTime(new Date(val[0]))
        this.listQuery.endTime = parseTime(new Date(val[1]))
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.userList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.userList()
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.userList()
    },
    handleCreate() {
      this.theForm = {}
      this.disabled = false
      this.immediatelyCreate = this.$t('table.immediatelyCreate')
      this.saveOrUpdate = true
    },
    handleDownload() {
    },
    handleUpdate(data) {
      const params = {}
      params.id = data.userId
      getUserInfo(params).then(response => {
        if (response.code === 200) {
          this.theForm = response.data
          this.theForm.id = data.userId
          this.password = this.theForm.password
          this.saveOrUpdate = true
          this.disabled = true
          this.immediatelyCreate = this.$t('table.submit')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    submitForm() {
      addOrModifyUser(this.theForm).then(response => {
        if (response.code === 200) {
          this.$message({
            type: 'success',
            message: response.msg
          })
        } else {
          this.$message.error(response.msg)
        }
        this.saveOrUpdate = false
        this.userList()
      })
    },
    handleReset() {
      this.theForm = {}
      this.theForm.password = this.password
    }
  }
}
</script>

<style lang="sass" scoped>

</style>


