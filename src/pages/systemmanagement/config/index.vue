<template>
   <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="$t('table.configName')" v-model="listQuery.configName">
      </el-input>
      <el-button type="primary" v-waves icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
      <el-button style="margin-left: 10px;" @click="handleDetail" type="primary" icon="el-icon-edit">{{$t('table.detail')}}</el-button>
    </div>
    <el-table ref="configTable" 
      :key='tableKey' 
      :data="list"       
      v-loading="listLoading" 
      element-loading-text="加载中。。。" 
      stripe fit highlight-current-row
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="220px" align="center" :label="$t('table.configName')">
        <template slot-scope="scope">
          <span>{{scope.row.configName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="220px" align="center" :label="$t('table.configValue')">
        <template slot-scope="scope">
          <span>{{scope.row.configValue}}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" :label="$t('status.name')">
        <template slot-scope="scope">        
          <el-tag type="success" v-if="scope.row.serverStatus === 1">
            <span>启用</span>
          </el-tag>
          <el-tag type="danger" v-if="scope.row.serverStatus === 0">
            <span>禁用</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" :label="$t('table.sequence')">
        <template slot-scope="scope">
          <span>{{scope.row.sequence}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.description')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('table.version')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="listQuery.pageNum" 
        :page-sizes="[10,20,30,50]" 
        :page-size="listQuery.pageSize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="saveOrUpdateTitle" :visible.sync="saveOrUpdate" center width="50%">
     <el-form :model="config">
      <el-form-item :label="$t('table.configName')" label-width="120px">
        <el-input v-model="config.configName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.configValue')" label-width="120px">
        <el-input v-model="config.configValue" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('status.name')" label-width="120px">
        <el-select v-model="config.serverStatus" :placeholder="$t('table.pleaseSelect')">        
          <el-option v-for="item in configServerStatus" :key="item.value" :label="item.name" :value="item.value"></el-option>    
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.sequence')" label-width="120px">
        <el-input type="textarea" v-model="config.sequence" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.description')" label-width="120px">
        <el-input type="textarea" v-model="config.description" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.version')" label-width="120px">
        <el-input v-model="config.version" auto-complete="off"></el-input>
      </el-form-item>      
     </el-form>
     <span slot="footer" class="dialog-footer">
       <el-button @click="saveOrUpdate = false">取 消</el-button>
       <el-button type="primary" @click="updateConfig">确 定</el-button>
     </span>
    </el-dialog>

  </div>
</template>

<script>
import { getConfigList, getConfigInfo, modifyConfig } from '@/api/config'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'configIndex',
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
        configName: undefined,
        pageNum: 1,
        pageSize: 20,
        sort: '+id',
        beginTime: '',
        endTime: ''
      },
      saveOrUpdate: false,
      saveOrUpdateTitle: '新增配置项',
      config: {},
      configServerStatus: [{ name: '启用', value: 1 }, { name: '禁用', value: 0 }],
      tableSelected: []
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getConfigList(this.listQuery).then(response => {
        if (response.code === 200) {
          this.list = response.record
          this.listLoading = false
          this.total = response.total
        } else {
          this.$message.error(response.msg)
          this.listLoading = false
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.fetchList()
    },
    handleSelectionChange(val) {
      this.tableSelected = val
    },
    handleSearch() {
      this.listQuery.pageNum = 1
      this.fetchList()
    },
    handleDetail(val) {
      if (this.tableSelected.length !== 1) {
        this.$message.error('请选择一条记录')
        return
      }
      getConfigInfo(this.tableSelected[0]).then(response => {
        if (response.code === 200) {
          this.saveOrUpdate = true
          this.config = response.data
          console.log(this.config)
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    updateConfig() {
      modifyConfig(this.config).then(response => {
        if (response.code === 200) {
          this.$message({
            type: 'success',
            message: response.msg
          })
          this.saveOrUpdate = false
          this.fetchList()
        } else {
          this.$message.error(response.msg)
        }
      })
    }
  }
}
</script>
