<template>
  <el-form>
    <el-form-item label="昵称">
      <el-input v-model.trim="user.nickName" />
    </el-form-item>
    <el-form-item label="个人简介">
      <el-input v-model="user.introduce" type="textarea" :rows="2" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          nickName: '',
          introduce: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$store.dispatch('user/updateInfo', this.user).then(() => {
        this.$message({
          message: '更新个人信息成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
