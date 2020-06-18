<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">仗剑青衫Admin</h3>
      </div>

      <el-form-item prop="userName">
        <el-input
          ref="userName"
          v-model="loginForm.userName"
          placeholder="用户名"
          name="userName"
          type="text"
          tabindex="1"
          autocomplete="on"
        >
          <span slot="prefix" class="iconfont icon-Userpersonavtar" />
        </el-input>
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          >
            <span slot="prefix" icon-class="password" class="iconfont icon-wodemima" />
            <span slot="suffix" style="cursor:pointer" :class="passwordType === 'password' ? 'iconfont icon-eye2' : 'iconfont icon-eye'" @click="showPwd" />
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true,message: '用户名不能为空', trigger: 'blur' },{ min: 5, max: 15, message: '用户名长度在5-20字符', trigger: 'blur' }],
        password: [{ required: true,message: '密码不能为空', trigger: 'blur' },{ min: 6, message: '密码长度不能小于6', trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.userName === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
<style scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('https://obs-myblog.obs.cn-south-1.myhuaweicloud.com/base/wallhaven-6k135l.jpg');
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-container .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
  }
.login-container .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
}
.login-container .tips span:first-of-type {
        margin-right: 16px;
}
.login-container .svg-container {
    padding: 6px 5px 6px 15px;
    color: #707070;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
}
.login-container .title-container {
    position: relative;
}
.login-container .title-container .title {
      font-size: 26px;
      color: #707070;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
}
.login-container .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: black;
    cursor: pointer;
    user-select: none;
}
</style>
