<template>
  <div class="app-container">
    <div class="filter-container">
      <Search @handleFilter="handleFilter" @handleClear="handleClear" />
    </div>
    <el-table v-loading="loading" :data="list" style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求方法">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="requestIp" label="IP" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常详情" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="info(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialog" title="异常详情" append-to-body top="30px" width="85%">
      <pre><code class="error-info">{{ errorInfo }}</code></pre>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getListByQuery, getDetailById, deleteLogByType } from '@/api/log'
import Pagination from '@/components/Pagination'
import Search from './components/search'
export default {
  name: 'LogList',
  components: { Pagination, Search },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        logType: 'ERROR',
        description: ''
      },
      dialog: false,
      errorInfo: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getListByQuery(this.listQuery).then(response => {
        this.list = response.items
        this.total = response.total
      })
      // Just to simulate the time of the request
      setTimeout(() => {
        this.loading = false
      }, 1 * 1000)
    },
    info(id) {
      this.dialog = true
      getDetailById(id).then(res => {
        this.errorInfo = res
      })
    },
    handleFilter(data) {
      this.listQuery.page = 1
      this.listQuery.description = data
      this.getList()
    },
    handleClear() {
      deleteLogByType(this.listQuery.logType).then(() => {
        this.$notify({
          title: '成功',
          message: '清空列表成功！',
          type: 'success',
          duration: 2000
        })
      })
      this.listQuery.page = 1
      this.list = []
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}
.el-dialog__body {
  padding: 0 20px 10px 20px !important;
}
.error-info {
  overflow-y: auto;
  height: 630px !important;
  display: block;
}
</style>
