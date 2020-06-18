<template>
  <div class="navbar">
    <div class="hamburger-container" @click="toggleSideBar">
      <i v-if="sidebar.opened" class="hamburger-icon el-icon-s-fold" />
      <i v-else class="hamburger-icon el-icon-s-unfold" />
    </div>
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>前往首页</el-dropdown-item>
          </router-link>
          <router-link to="/profile">
            <el-dropdown-item>个人信息</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/doubj">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    toggleSideBar() {
      console.log(1);
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.navbar .hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}
.navbar .hamburger-container .hamburger-icon {
  padding: 10px 15px 0px;
  font-size: 26px;
}
.navbar .hamburger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}

.navbar .breadcrumb-container {
  float: left;
}

.navbar .right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
}
.navbar .right-menu:focus {
  outline: none;
}
.navbar .right-menu .right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
}
.navbar .right-menu .right-menu-item.hover-effect {
  cursor: pointer;
  transition: background 0.3s;
}
.navbar .right-menu .right-menu-item.hover-effect:hover {
  background: rgba(0, 0, 0, 0.025);
}

.navbar .right-menu .avatar-container {
  margin-right: 30px;
}

.navbar .right-menu .avatar-container .avatar-wrapper {
  margin-top: 5px;
  position: relative;
}
.navbar .right-menu .avatar-container .avatar-wrapper .user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.navbar .right-menu .avatar-container .avatar-wrapper .el-icon-caret-bottom {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}
</style>
