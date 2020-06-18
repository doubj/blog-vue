<template>
  <div>
    <div class="siderbar-logo" style="height:50px">
      <svg
        class="icon"
        style="font-size:30px;margin-right:10px;margin-top:10px;"
        aria-hidden="true"
      >
        <use xlink:href="#icon-L_Bar_Moon" />
      </svg>
      <span style="color:white;height:50px;width:100%;font-size:16px;font-weight:bold;">仗剑青衫Admin</span>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#2c3e50"
        text-color="rgb(191, 203, 217)"
        :unique-opened="true"
        active-text-color="#54a0ff"
        :collapse-transition="false"
        mode="vertical"
      >
        <div v-for="(item,index) in routeArr" :key="index">
          <router-link v-if="item.children.length === 0" :to="item.to">
            <el-menu-item :index="item.index">
              <span :class="'iconfont icon-' + item.icon" />
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </router-link>
          <el-submenu v-else :index="item.index" popper-append-to-body>
            <template slot="title">
              <span :class="'iconfont icon-' + item.icon" />
              <span slot="title">{{ item.title }}</span>
            </template>
            <router-link v-for="(subItem,i) in item.children" :key="i" :to="subItem.to">
              <el-menu-item :index="subItem.index">
                <span :class="'iconfont icon-' + subItem.icon" />
                <span slot="title">{{ subItem.title }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
const routeArr = [
  {
    index: "/dashboard",
    to: "/",
    icon: "dash-board",
    title: "dashboard",
    children: []
  },
  {
    index: "/blog",
    to: "/blog",
    icon: "rizhilei",
    title: "博客管理",
    children: [
      {
        index: "/blog/list",
        to: "/blog/list",
        icon: "list",
        title: "博客列表"
      },
      {
        index: "/blog/create",
        to: "/blog/create",
        icon: "edit",
        title: "发表博客"
      }
    ]
  },
  {
    index: "monitor",
    to: "/monitor",
    icon: "monitor",
    title: "日志管理",
    children: [
      {
        index: "/monitor/logs",
        to: "/monitor/logs",
        icon: "log",
        title: "操作日志"
      },
      {
        index: "/monitor/errorLogs",
        to: "/monitor/errorLogs",
        icon: "errorlog",
        title: "异常日志"
      }
    ]
  },
  {
    index: "/cloud/list",
    to: "/cloud",
    icon: "cloud",
    title: "云存储",
    children: []
  },
  {
    index: "/message/list",
    to: "/message",
    icon: "FontAwesomecommentssolid",
    title: "评论列表",
    children: []
  },
  {
    index: "/link/list",
    to: "/link",
    icon: "heart",
    title: "友链列表",
    children: []
  }
];
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      routeArr: Object.assign({}, routeArr)
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      // console.log(this.$route)
      const { path } = route;
      if (path.startsWith("/blog/edit")) {
        return "/blog/create";
      }
      return path;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
