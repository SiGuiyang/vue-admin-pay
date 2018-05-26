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
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.serverStatus === 2">
            <span>{{scope.row.serverStatus | userStatus}}</span>
          </el-tag>

          <el-tag type="danger" v-if="scope.row.serverStatus === 4">
            <span>{{scope.row.serverStatus | userStatus}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="success" size="mini" @click="handleDelete(scope.row,'published')">{{$t('table.publish')}}
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
  </div>
</template>

<script>
import { getUserList } from '@/api/permission'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
export default {
  name: 'userList',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      queryTime: '',
      listLoading: true,
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
    this.userList()
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
      this.listQuery.limit = val
      this.userList()
    },
    handleCurrentChange(val) {
      this.listQuery.offset = val
      this.userList()
    },
    handleFilter() {
      this.listQuery.offset = 0
      this.userList()
    },
    handleCreate() {

    },
    handleDownload() {
    },
    handleUpdate() {
      this.saveOrUpdate = true
    },
    handleDelete() {}
  }
}
</script>

<style lang="sass" scoped>

</style>


