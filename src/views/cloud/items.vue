<template>
  <div class="app-container">
    <aside>
      1：展示目标文件夹中的所有图片资源
      <br />2：点击图片可以删除对应的图片
      <br />3：只能上传图片
    </aside>
    <div class="filter-container">
      <el-upload
        class="upload-demo"
        :headers="headers"
        :limit="1"
        drag
        accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PBG, .GIF"
        :action="action"
        :data="data"
        :multiple="false"
        :before-upload="beforeUpload"
        :on-success="onSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </div>
    <div class="cloud-items">
      <el-image
        class="cloud-image"
        v-for="item in items"
        :key="item"
        :src="item"
        @click="open(item)"
      ></el-image>
    </div>
    <el-dialog title="操作" :visible.sync="dialog" width="30%" :before-close="handleClose">
      <span>注意：</span>
      <span style="color:red">删除</span>
      <span>操作将永久删除该文件</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-clipboard:copy="item"
          v-clipboard:success="copy"
          v-clipboard:error="onError"
        >复制链接</el-button>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="danger" @click="handleDelte">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getImageByDir, deleteImage } from "@/api/cloud";
import { getToken } from "@/utils/auth";
export default {
  name: "ImageItems",
  created() {
    this.init();
  },
  data() {
    return {
      items: [],
      headers: { token: "" },
      data: { title: "" },
      action: `http://localhost:8088/admin/cloud/img`,
      dialog: false,
      item: ""
    };
  },
  methods: {
    init() {
      this.data.title = this.$route.params && this.$route.params.name;
      this.fetchData();
    },
    beforeUpload() {
      const _self = this;
      const token = getToken();
      _self._data.headers.token = token;
    },
    fetchData() {
      getImageByDir(this.data.title).then(res => {
        this.items = res;
      });
    },
    open(item) {
      // this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.handleDelte(item);
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除"
      //     });
      //   });
      this.item = item;
      this.dialog = true;
    },
    handleClose() {
      this.dialog = false;
      this.item = {};
    },
    handleDelte() {
      const item = this.item;
      const dirName = this.data.title;
      const name = item.substr(item.indexOf(dirName) + dirName.length + 1);
      deleteImage(dirName, name).then(() => {
        this.items.splice(
          this.items.findIndex(i => i === item),
          1
        );
      });
      this.handleClose();
    },
    onSuccess(response) {
      var tempUrl = response.data;
      this.items.push(tempUrl);
    },
    copy() {
      this.$message({
        message: "已成功复制图片链接至剪贴板",
        type: "success"
      });
    },
    onError(e) {
      console.log(e);
    }
  }
};
</script>

<style scoped>
.cloud-items {
  display: flex;
  flex-wrap: wrap;
}
.cloud-image {
  flex-grow: 1;
  margin: 20px;
}
.el-image.cloud-image /deep/ .el-image__inner {
  transition: all 0.6s;
  cursor: pointer;
}
.el-image.cloud-image /deep/ .el-image__inner:hover {
  transform: scale(1.2) !important;
}
</style>