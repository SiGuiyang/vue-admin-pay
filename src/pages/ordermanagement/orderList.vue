<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.merchantName')" v-model="listQuery.merchantName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.bankName')" v-model="listQuery.bankName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.bankNum')" v-model="listQuery.bankNum">
      </el-input>

      <el-select clearable style="width: 90px" v-model="listQuery.serverStatus" :placeholder="$t('status.name')">
        <el-option v-for="item in serverStatusArray" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
      <el-date-picker style="width: 360px;"        
        v-model="queryTime"
        type="datetimerange"
        format="yyyy-MM-dd"
        @change="getTime"
        range-separator="至" 
        start-placeholder="开始日期" 
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" v-waves icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中。。。" border fit highlight-current-row
      style="width: 100%">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.merchantName')">
        <template slot-scope="scope">
          <span>{{scope.row.merchantName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.merchantNo')">
        <template slot-scope="scope">
          <span>{{scope.row.merchantNo}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('table.bankName')">
        <template slot-scope="scope">
          <span>{{scope.row.bankName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('table.bankNum')">
        <template slot-scope="scope">
          <span>{{scope.row.bankNum}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" :label="$t('table.serverStatus')">
        <template slot-scope="scope">
          <span>{{scope.row.serverStatus}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" :label="$t('table.payAmount')">
        <template slot-scope="scope">
          <span>{{scope.row.payAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" :label="$t('table.rate')">
        <template slot-scope="scope">
          <span>{{scope.row.rate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" :label="$t('table.deduction')">
        <template slot-scope="scope">
          <span>{{scope.row.deduction}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" :label="$t('table.isDeduction')">
        <template slot-scope="scope">
          <span>{{scope.row.deduction}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { merchantList } from '@/api/merchant'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'orderList',
  directives: {
    waves
  },
  data() {
    return {
      queryTime: undefined,
      total: undefined,
      list: undefined,
      listLoading: false,
      tableKey: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        importance: undefined,
        meerchantName: undefined,
        bankName: undefined,
        bankNum: undefined,
        serverStatus: undefined,
        idCard: undefined,
        sort: '+id',
        beginTime: '',
        endTime: ''
      },
      serverStatusArray: [{ id: 0, name: '开户中' }, { id: 1, name: '已销户' }, { id: 2, name: '正常' }]
    }
  },
  created() {

  },
  methods: {
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
      this.roleList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.roleList()
    },
    fetchList() {
      this.listLoading = true
      merchantList(this.listQuery).then(response => {
        if (response.code === 200) {
          this.list = response.record
        }
      })
    },
    handleSearch() {

    }
  }
}
</script>

<style lang="sass" scoped>

</style>
