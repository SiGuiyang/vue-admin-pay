<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.merchantNo')" v-model="listQuery.merchantNo">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.orderCode')" v-model="listQuery.orderCode">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.merchantOrderCode')" v-model="listQuery.merchantOrderCode">
      </el-input>

      <el-select clearable style="width: 120px" v-model="listQuery.payStatus" :placeholder="$t('table.payStatus')">
        <el-option v-for="item in payStatusArray" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select>

      <el-select clearable style="width: 120px" v-model="listQuery.notificationStatus" :placeholder="$t('table.notificationStatus')">
        <el-option v-for="item in notificationStatusArray" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
      <el-date-picker style="width: 360px;" v-model="queryTime" type="datetimerange" format="yyyy-MM-dd" @change="getTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" v-waves icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中。。。" border fit highlight-current-row style="width: 100%">
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

      <el-table-column width="180px" align="center" :label="$t('table.payBody')">
        <template slot-scope="scope">
          <span>{{scope.row.payBody}}</span>
        </template>
      </el-table-column>
      

      <el-table-column width="80px" align="center" :label="$t('table.notificationStatus')">
        <template slot-scope="scope">
          <span>{{scope.row.notificationStatus}}</span>
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
        meerchantNo: undefined,
        orderCode: undefined,
        merchantOrderCode: undefined,
        notificationStatus: undefined,
        idCard: undefined,
        sort: '+id',
        beginTime: '',
        endTime: ''
      },
      notificationStatusArray: [{ id: 0, name: '未下发' }, { id: 1, name: '已下发' }, { id: 2, name: '已通知' }],
      payStatusArray: [{ id: 0, name: '已创建' }, { id: 1, name: '已取消' }, { id: 2, name: '成功' }, { id: 3, name: '失败' }]
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
