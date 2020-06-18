<template>
  <div>
    <el-input v-model="description" placeholder="描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      搜索
    </el-button>
    <el-button style="float:right" class="filter-item" type="danger" icon="el-icon-delete" @click="clickClear">
      清空
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      description: ''
    }
  },
  methods: {
    handleFilter() {
      this.$emit('handleFilter', this.description)
    },
    clickClear() {
      this.$confirm('是否确定清空所有日志？该操作不可逆', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('handleClear')
      })
    }
  }
}
</script>

