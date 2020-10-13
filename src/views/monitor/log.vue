<template>
  <div class="app-container full-height">
    <Search @handleFilter="handleFilter" @handleClear="handleClear" />
    <el-table v-loading="loading" :data="list" height="100%" style="width: 100%;">
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
      <el-table-column prop="time" label="请求耗时" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getListByQuery, deleteLogByType } from '@/api/log'
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
        logType: 'INFO',
        description: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getListByQuery(this.listQuery).then(response => {
        console.log(response)
        this.list = response.items
        this.total = response.total
      })
      // Just to simulate the time of the request
      setTimeout(() => {
        this.loading = false
      }, 1 * 1000)
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
      this.total = 0
      this.listQuery.page = 1
      this.list = []
    }
  }
}
</script>

<style>
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
</style>
