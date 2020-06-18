<template>
  <div class="app-container">
    <Warning />
    <div class="filter-container">
      <el-input
        v-model="data.dirName"
        placeholder="文件夹名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-search" @click="handleDelte">删除</el-button>
    </div>
    <div class="cloud">
      <router-link
        class="cloud-link"
        :to="'/cloud/dir/'+item"
        v-for="(item,index) in items"
        :key="index"
      >
        <el-card class="cloud-card">{{ item }}</el-card>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getAllDir, addDir, deleteImage } from "@/api/cloud";
import Warning from "./components/warning";
export default {
  name: "Cloud",
  components: { Warning },
  created() {
    this.init();
  },
  data() {
    return {
      items: [],
      data: {
        dirName: ""
      }
    };
  },
  methods: {
    init() {
      getAllDir().then(res => {
        this.items = res;
      });
    },
    handleAdd() {
      addDir(this.data).then(() => {
        this.items.push(this.data.dirName);
        this.$notify({
          title: "成功",
          message: "添加文件夹成功",
          type: "success",
          duration: 2000
        });
        this.data.dirName = "";
      });
    },
    handleDelte() {
      const dirName = this.data.dirName;
      const name = "";
      deleteImage(dirName, name).then(() => {
        this.items.splice(
          this.items.findIndex(item => item === dirName),
          1
        );
        this.$notify({
          title: "成功",
          message: "删除文件夹成功",
          type: "success",
          duration: 2000
        });
        this.data.dirName = "";
      });
    }
  }
};
</script>

<style scoped>
.cloud {
  display: flex;
  flex-wrap: wrap;
  margin: 10 auto;
}
.cloud-link {
  width: 30%;
  margin: 10px;
  height: 200px;
  transition: all 0.5s;
}
.cloud-link:hover {
  transform: scale(1.05);
}
.cloud-card {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  font-weight: bold;
  background: linear-gradient(
    125deg,
    #2c3e50,
    #27ae60,
    #2980b9,
    #e74c3c,
    #8e44ad
  );
  background-size: 400%;
  animation: bganimation 5s infinite;
}
@keyframes bganimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>