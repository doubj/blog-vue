<template>
  <div class="app-container full-height">
    <Warning />
    <div class="filter-container">
      <el-button class="filter-button" style="float:right" type="primary" @click="dialogVisible=!dialogVisible">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" height="100%" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.linkId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="昵称">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.linkName" size="small" />
          </template>
          <span v-else>{{ row.linkName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="200px" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.avatar" size="small" />
          </template>
          <el-popover
            v-else
            placement="right"
            title=""
            trigger="hover"
          >
            <el-image slot="reference" :src="row.avatar+'?imageView2/1/w/30/h/30'" />
            <el-image :src="row.avatar" style="max-height: 200px;max-width: 200px" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column min-width="250px" align="center" label="链接">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.linkUrl" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.linkUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <template v-if="row.edit">
            <el-button
              type="success"
              size="small"
              icon="el-icon-check"
              @click="confirmEdit(row)"
            >
              确定
            </el-button>
            <el-button
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(row, $index)"
            >
              删除
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="添加友链">
      <el-form :rules="rules" :model="temp" label-position="left" label-width="60px" center width="50%">
        <el-form-item label="昵称" prop="linkName">
          <el-input v-model="temp.linkName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="temp.avatar" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="链接" prop="linkUrl">
          <el-input v-model="temp.linkUrl" placeholder="请输入链接" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createLink()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLinkList, updateLink, addLink, deleteLink } from '@/api/link'
import Warning from './components/warning'

const defaultLink = {
  linkName: '',
  avatar: '',
  linkUrl: ''
}

export default {
  name: 'FriendLinkList',
  components: { Warning },
  data() {
    return {
      list: null,
      listLoading: true,
      originalLink: {},
      dialogVisible: false,
      temp: Object.assign({}, defaultLink),
      rules: {
        linkName: [{ required: true, message: '昵称不能为空' }],
        avatar: [{ required: true, message: '头像不能为空' }],
        linkUrl: [{ required: true, message: '链接不能为空' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLinkList().then(response => {
        this.list = response.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          return v
        })
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      const { linkName, linkUrl, avatar } = this.originalLink
      row.linkName = linkName
      row.linkUrl = linkUrl
      row.avatar = avatar
      row.edit = false
      this.originalLink = {}
      this.$message({
        message: '已成功取消本次编辑操作',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      updateLink(row).then(() => {
        row.edit = false
        this.$message({
          message: '修改友链成功',
          type: 'success'
        })
      })
    },
    handleEdit(row) {
      this.originalLink = Object.assign({}, row)
      row.edit = true
    },
    createLink() {
      addLink(this.temp).then(response => {
        response.edit = false
        this.list.push(response)
        this.$notify({
          title: '成功',
          message: '添加友链成功',
          type: 'success',
          duration: 2000
        })
        this.temp = Object.assign({}, defaultLink)
      })
      this.dialogVisible = false
    },
    handleDelete(row, index) {
      deleteLink(row.linkId).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功！',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
