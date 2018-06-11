<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.merchantNo')" v-model="listQuery.merchantNo">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.mobile')" v-model="listQuery.mobile">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.bankName')" v-model="listQuery.bankName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.bankNum')" v-model="listQuery.bankNum">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.idCard')" v-model="listQuery.idCard">
      </el-input>
      <el-select clearable style="width: 120px" v-model="listQuery.serverStatus" :placeholder="$t('status.name')">
        <el-option v-for="item in serverStatusArray" :key="item.id" :label="item.name" :value="item.id">
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
      <el-button type="primary" v-waves icon="el-icon-edit" @click="handleAdd">{{$t('table.add')}}</el-button>

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
      <el-table-column width="150px" align="center" :label="$t('table.contractName')">
        <template slot-scope="scope">
          <span>{{scope.row.contractName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.merchantNo')">
        <template slot-scope="scope">
          <span>{{scope.row.merchantNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.mobile')">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" :label="$t('status.name')">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.serverStatus == 0">已开户</el-tag>
          <el-tag type="danger" v-if="scope.row.serverStatus == 1">已销户</el-tag>
          <el-tag type="success" v-if="scope.row.serverStatus == 2">审核完成</el-tag>
          <el-tag type="warning" v-if="scope.row.serverStatus == 3">审核失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" :label="$t('table.highQuality')">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.highQuality == 1">VIP</el-tag>
          <el-tag type="info" v-if="scope.row.highQuality == 0">非VIP</el-tag>          
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
      <el-table-column width="180px" align="center" :label="$t('table.idCard')">
        <template slot-scope="scope">
          <span>{{scope.row.idCard}}</span>
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
      <el-table-column width="160px" align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="320px" align="center" fixed="right" :label="$t('table.actions')">
        <template slot-scope="scope">  
          <el-button type="primary" size="mini" @click="handleMerchantInfo(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" size="mini" @click="handleMerchantPayChannel(scope.row)">{{$t('table.merchantPay')}}</el-button>
          <el-button type="primary" :disabled="scope.row.serverStatus !== 0" size="mini" @click="handleMerchantReview(scope.row)">{{$t('table.review')}}</el-button>
          <el-button type="danger" size="mini" @click="handleMerchantDelete(scope.row)">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="modifyMerchantTitle" :visible.sync="modifyMerchantVisible" center width="60%">
      <el-form :model="theForm" ref="theForm" label-width="100px">
        <el-form-item :label="$t('table.merchantName')" prop="merchantName">
          <el-input v-model="theForm.merchantName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input v-model="theForm.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.merchantNo')" prop="roleCode">
          <el-input v-model="theForm.merchantNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.publicKey')" prop="publicKey">
          <el-input v-model="theForm.publicKey"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.privateKey')" prop="privateKey">
          <el-input v-model="theForm.privateKey"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.contractName')" prop="contractName">
          <el-input v-model="theForm.contractName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.mobile')" prop="mobile">
          <el-input v-model="theForm.mobile"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.bankName')" prop="bankName">
          <el-select v-model="theForm.bankName" :placeholder="$t('table.pleaseSelect')">
            <el-option
              v-for="bank in bannks"
              :key="bank.id"
              :label="bank.description"
              :value="bank.description">
              <span style="float: left">{{ bank.description }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ bank.configValue }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.bankNum')" prop="bankNum">
          <el-input v-model="theForm.bankNum"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.idCard')" prop="idCard">
          <el-input v-model="theForm.idCard"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.rate')" prop="rate">
          <el-input v-model="theForm.rate"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deduction')" prop="deduction">
          <el-input v-model="theForm.deduction"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.highQuality')" prop="highQuality">
          <el-select v-model="theForm.highQuality" :placeholder="$t('table.pleaseSelect')">
            <el-option v-for="quality in highQualities" :key="quality.id" :label="quality.name" :value="quality.id"></el-option>
          </el-select>
        </el-form-item>        

        <el-form-item :label="$t('table.IdCardFrond')" prop="IdCardFrond">
          <el-upload
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple            
            :file-list="theForm.IdCardFrondList"
            list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('table.IdCardBehind')" prop="IdCardBehind">
          <el-upload               
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :file-list="theForm.IdCardBehindList"
            list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5MB</div>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('table.license')" prop="license">
          <el-upload
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :file-list="theForm.licenseList"
            list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5MB</div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">{{this.$t('table.immediatelyCreate')}}</el-button>
          <el-button @click="modifyMerchantVisible = false">{{this.$t('table.close')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="modifyMerchantPayChannelTitle" :visible.sync="modifyMerchantPayChannelVisible" center width="60%">
      <el-form :model="payForm" ref="payForm" label-width="100px">
        <el-form-item :label="$t('table.merchantName')" prop="merchantName">
          <el-input disabled v-model="payForm.merchantName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.merchantNo')" prop="roleCode">
          <el-input disabled v-model="payForm.merchantNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.payChannelSet')" prop="payChannelCenterId">
          
          <el-select v-model="payForm.payChannelCenterId" :placeholder="$t('table.pleaseSelect')">
            <el-option
              v-for="payChannel in payChannels"
              :key="payChannel.id"
              :label="payChannel.channelCenterName"
              :value="payChannel.id">
              <span style="float: left">{{ payChannel.channelCenterName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ payChannel.payType }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPayForm">{{this.$t('table.immediatelyCreate')}}</el-button>
          <el-button @click="modifyMerchantVisible = false">{{this.$t('table.close')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { merchantList, queryMerchantInfo, modifyMerchant, deleteMerchant, queryBanks } from '@/api/merchant'
import { queryChannelEnable } from '@/api/channel'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'merchantList',
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
        meerchantNo: undefined,
        bankName: undefined,
        bankNum: undefined,
        serverStatus: undefined,
        idCard: undefined,
        mobile: undefined,
        sort: '+id',
        beginTime: '',
        endTime: ''
      },
      serverStatusArray: [{ id: 0, name: '开户中' }, { id: 1, name: '已销户' }, { id: 2, name: '审核完成' }, { id: 3, name: '审核失败' }],
      highQualities: [{ id: 0, name: '非VIP' }, { id: 1, name: 'VIP' }],
      modifyMerchantTitle: '',
      modifyMerchantVisible: false,
      theForm: {},
      bannks: [],
      IdCardFrondList: [],
      IdCardBehindList: [],
      licenseList: [],
      modifyMerchantPayChannelTitle: '商户支付渠道配置',
      modifyMerchantPayChannelVisible: false,
      payForm: {},
      payChannels: []
    }
  },
  created() {
    this.fetchList()
    this.getQueryBanks()
    this.getQueryChannelEnable()
  },
  methods: {
    getQueryBanks() {
      queryBanks().then(response => {
        if (response.code === 200) {
          this.bannks = response.data
        }
      })
    },
    getQueryChannelEnable() {
      queryChannelEnable().then(response => {
        if (response.code === 200) {
          this.payChannels = response.data
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
          this.total = response.total
        } else {
          this.$message.error(response.msg)
        }
        this.listLoading = false
      })
    },
    handleSearch() {
      this.fetchList()
    },
    handleAdd() {
      this.theForm = {}
      this.modifyMerchantVisible = true
      this.modifyMerchantTitle = '添加'
    },
    handleMerchantInfo(data) {
      const params = {}
      params.id = data.id
      queryMerchantInfo(params).then(response => {
        if (response.code === 200) {
          this.modifyMerchantVisible = true
          this.modifyMerchantTitle = '商户详情'
          this.theForm = response.data
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleMerchantReview(data) {
      this.$confirm('确定要审批此商户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const params = {}
        params.id = data.id
        params.serverStatus = 2
        modifyMerchant(params).then(response => {
          if (response.code === 200) {
            this.modifyMerchantVisible = false
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.fetchList()
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleMerchantPayChannel(data) {
      this.modifyMerchantPayChannelVisible = true
    },
    handleMerchantDelete(data) {
      this.$confirm('确定要删除此项？，请慎重操作！！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const params = {}
        params.id = data.id
        deleteMerchant(params).then(response => {
          if (response.code === 200) {
            this.modifyMerchantVisible = false
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.fetchList()
          } else {
            this.$message.error(response.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    submitForm() {
      modifyMerchant(this.theForm).then(response => {
        if (response.code === 200) {
          this.fetchList()
          this.$message({
            type: 'success',
            message: response.msg
          })
          this.modifyMerchantVisible = false
          this.fetchList()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    submitPayForm() {

    }
  }
}
</script>

<style lang="sass" scoped>

</style>
