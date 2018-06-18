 <template>
   <div class="app-container calendar-list-container">
     <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.channelCenterName')" v-model="listQuery.channelCenterName">
      </el-input>
      <el-select clearable style="width: 150px" v-model="listQuery.payType" :placeholder="$t('table.channelPayType')">
        <el-option v-for="item in payTypes" :key="item.id" :label="item.description" :value="item.configValue">
        </el-option>
      </el-select>
      <el-select clearable style="width: 90px" v-model="listQuery.serverStatus" :placeholder="$t('status.name')">
        <el-option v-for="item in serverStatusArray" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" v-waves icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
      <el-button type="primary" v-waves icon="el-icon-edit" @click="handleAdd">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中。。。" border fit highlight-current-row
      style="width: 100%">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.channelCenterName')">
        <template slot-scope="scope">
          <span>{{scope.row.channelCenterName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.channelPayType')">
        <template slot-scope="scope">
          <span>{{scope.row.payType}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" :label="$t('status.name')">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.serverStatus == 1">启用</el-tag>
          <el-tag type="danger" v-if="scope.row.serverStatus == 0">禁用</el-tag>      
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.createUserName')">
        <template slot-scope="scope">
          <span>{{scope.row.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" :label="$t('table.updateUserName')">
        <template slot-scope="scope">
          <span>{{scope.row.updateUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleChannelCenterInfo(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="primary" size="mini" @click="handlePayChannelSet(scope.row)">{{$t('table.payChannelSet')}}</el-button>
          <el-button @click="handlePayChannelCenterDelete(scope.row)" size="mini" type="danger">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 支付中心弹框-->
    <el-dialog :title="saveOrModifyTitle" :visible.sync="saveOrModifyChannel" center width="30%">
      <el-form :model="theForm" ref="theForm" label-width="100px">
        <el-form-item :label="$t('table.channelCenterName')" prop="channelCenterName">
          <el-input v-model="theForm.channelCenterName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.channelPayType')" prop="payType">
          <el-select v-model="theForm.payType" :placeholder="$t('table.pleaseSelect')">
            <el-option v-for="payType in payTypes" :key="payType.id" :label="payType.description" :value="payType.configValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('status.name')" prop="roleCode">
          <el-select v-model="theForm.serverStatus" :placeholder="$t('table.pleaseSelect')">
            <el-option v-for="status in serverStatusArray" :key="status.id" :label="status.name" :value="status.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{this.$t('table.immediatelyCreate')}}</el-button>
          <el-button @click="saveOrModifyChannel = false">{{this.$t('table.close')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--支付渠道弹框与配置-->

    <el-dialog :title="payChannelTitle" :visible.sync="payChannelVisible" center width="90%">

      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.channelName')" v-model="payChannelListQuery.channelName">
        </el-input>
        <el-button type="primary" v-waves icon="el-icon-search" @click="handlePayChannelSearch">{{$t('table.search')}}</el-button>
        <el-button type="primary" v-waves icon="el-icon-edit" @click="handlePayChannelAdd">{{$t('table.add')}}</el-button>
      </div>

      <el-table :key='payChannelTableKey' :data="payChannelList" v-loading="payChannelListLoading" element-loading-text="加载中。。。" border fit highlight-current-row
      style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column width="160px" align="center" :label="$t('table.channelName')">
          <template slot-scope="scope">
            <span>{{scope.row.channelName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="center" :label="$t('table.appId')">
          <template slot-scope="scope">
            <span>{{scope.row.appId}}</span>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="center" :label="$t('table.openId')">
          <template slot-scope="scope">
            <span>{{scope.row.openId}}</span>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="center" :label="$t('table.mchId')">
          <template slot-scope="scope">
            <span>{{scope.row.mchId}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" :label="$t('table.secureKey')">
          <template slot-scope="scope">
            <span>{{scope.row.secureKey}}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" align="center" :label="$t('table.currentNode')">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.currentNode == true">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="90px" align="center" :label="$t('table.currentEnable')">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.currentEnable == true">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" :label="$t('table.rate')">
          <template slot-scope="scope">
            <span>{{scope.row.rate}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" :label="$t('table.deduction')">
          <template slot-scope="scope">
            <span>{{scope.row.deduction}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" fixed="right" :label="$t('table.actions')">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleChannelInfo(scope.row)">{{$t('table.edit')}}</el-button>
            <el-button type="danger" size="mini" @click="handlePayChannelDelete(scope.row)">{{$t('table.delete')}}
            </el-button>
          </template>
        </el-table-column>

        <div class="pagination-container">
          <el-pagination background @size-change="handleChannelSizeChange" @current-change="handleChannelCurrentChange" :current-page="payChannelListQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="payChannelListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="payChannelTotal">
          </el-pagination>
        </div>
      </el-table>

      <el-dialog :title="modifyChannelTitle" :visible.sync="modifyChannelVisible" append-to-body center width="50%">
        <el-form :model="payChannelForm" ref="payChannelForm" label-width="100px">
          <el-form-item :label="$t('table.channelName')" prop="channelName">
            <el-input v-model="payChannelForm.channelName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.appId')" prop="appId">
            <el-input v-model="payChannelForm.appId"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.openId')" prop="openId">
            <el-input v-model="payChannelForm.openId"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.mchId')" prop="mchId">
            <el-input v-model="payChannelForm.mchId"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.secureKey')" prop="secureKey">
            <el-input v-model="payChannelForm.secureKey"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.rate')" prop="rate">
            <el-input v-model="payChannelForm.rate"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.deduction')" prop="deduction">
            <el-input v-model="payChannelForm.deduction"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.currentNode')" prop="currentNode">
            <el-select v-model="payChannelForm.currentNode" :placeholder="$t('table.pleaseSelect')">
              <el-option v-for="currentNode in currentNodes" :key="currentNode.id" :label="currentNode.name" :value="currentNode.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.currentEnable')" prop="currentNode">
            <el-select v-model="payChannelForm.currentEnable" :placeholder="$t('table.pleaseSelect')">
              <el-option v-for="currentEnable in currentEnables" :key="currentEnable.id" :label="currentEnable.name" :value="currentEnable.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPayChannelForm">{{this.$t('table.immediatelyCreate')}}</el-button>
            <el-button @click="modifyChannelVisible = false ">{{this.$t('table.close')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-dialog>

   </div>
 </template>
 <script>
import waves from '@/directive/waves' // 水波纹指令
import { channelPayType, queryChannelCenterInfo, modifyPayChannelCenter, payChannelCenterList, deletePayChannelCenter, payChannelList, queryPayChannelInfo, modifyPayChannel, deletePayChannel } from '@/api/channel'
export default {
  name: 'channelIndex',
  directives: {
    waves
  },
  data() {
    return {
      total: undefined,
      list: undefined,
      listLoading: false,
      tableKey: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        channelCenterName: undefined,
        serverStatus: undefined,
        payType: undefined,
        sort: '+id'
      },
      serverStatusArray: [{ id: 0, name: '禁用' }, { id: 1, name: '启用' }],
      saveOrModifyTitle: '添加',
      saveOrModifyChannel: false,
      theForm: {},
      payTypes: [],
      payChannelTitle: '支付中心渠道',
      payChannelVisible: false,
      payChannelList: undefined,
      payChannelTableKey: 0,
      payChannelListLoading: false,
      payChannelTotal: undefined,
      payChannelForm: {},
      modifyChannelTitle: '编辑',
      modifyChannelVisible: false,
      payChannelListQuery: {
        payChannelCenterId: undefined,
        pageNum: 1,
        pageSize: 20,
        channelName: undefined,
        sort: '+id'
      },
      currentNodes: [{ id: true, name: '是' }, { id: false, name: '否' }],
      currentEnables: [{ id: true, name: '是' }, { id: false, name: '否' }]
    }
  },
  created() {
    this.fetchPayTypes()
    this.fetchList()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.fetchList()
    },
    fetchList() {
      this.listLoading = true
      payChannelCenterList(this.listQuery).then(response => {
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
    handleChannelCenterInfo(data) {
      const params = {}
      params.id = data.id
      queryChannelCenterInfo(params).then(response => {
        if (response.code === 200) {
          this.saveOrModifyTitle = '编辑'
          this.saveOrModifyChannel = true
          this.theForm = response.data
        }
      })
    },
    handleAdd() {
      this.saveOrModifyTitle = '添加'
      this.saveOrModifyChannel = true
      this.theForm = {}
    },
    fetchPayTypes() {
      channelPayType().then(response => {
        if (response.code === 200) {
          this.payTypes = response.data
        }
      })
    },
    submitForm() {
      modifyPayChannelCenter(this.theForm).then(response => {
        if (response.code === 200) {
          this.saveOrModifyChannel = false
          this.$message({
            type: 'success',
            message: response.msg
          })
          this.fetchList()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handlePayChannelSet(data) {
      this.payChannelVisible = true
      this.payChannelListQuery.payChannelCenterId = data.id
      this.fetchChannelList()
    }, // 删除支付中心
    handlePayChannelCenterDelete(data) {
      this.$confirm('确定要删除此项？，请慎重操作！！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const params = {}
        params.id = data.id
        deletePayChannelCenter(params).then(response => {
          if (response.code === 200) {
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
    // 一下为支付渠道相关方法
    fetchChannelList() {
      this.payChannelList = []
      payChannelList(this.payChannelListQuery).then(response => {
        if (response.code === 200) {
          this.payChannelList = response.record
          this.payChannelTotal = response.total
        } else {
          this.$message.error(response.msg)
        }
        this.payChannelListLoading = false
      })
    },
    handleChannelSizeChange(val) {
      this.payChannelListQuery.pageSize = val
      this.fetchChannelList()
    },
    handleChannelCurrentChange(val) {
      this.payChannelListQuery.pageNum = val
    },
    handlePayChannelSearch() { // 搜索
      this.fetchChannelList()
    },
    handlePayChannelAdd() {
      this.modifyChannelVisible = true
      this.payChannelForm = {}
    },
    // 支付渠道详情
    handleChannelInfo(data) {
      const params = {}
      params.id = data.id
      queryPayChannelInfo(params).then(response => {
        if (response.code === 200) {
          this.payChannelTitle = '编辑'
          this.modifyChannelVisible = true
          this.payChannelForm = response.data
        }
      })
    },
    handlePayChannelDelete(data) {
      this.$confirm('确定要删除此项？，请慎重操作！！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const params = {}
        params.id = data.id
        deletePayChannel(params).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.fetchChannelList()
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
    submitPayChannelForm() {
      this.payChannelForm.payChannelCenterId = this.payChannelListQuery.payChannelCenterId
      modifyPayChannel(this.payChannelForm).then(response => {
        if (response.code === 200) {
          this.modifyChannelVisible = false
          this.$message({
            type: 'success',
            message: response.msg
          })
          this.fetchChannelList()
        } else {
          this.$message.error(response.msg)
        }
      })
    }
  }
}
</script>
 