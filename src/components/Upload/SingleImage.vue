<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :limit="1"
      :data="data"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :multiple="false"
      :show-file-list="false"
      :before-upload="beforeUpload"
      class="image-uploader"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <div class="image-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl" />
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "SingleImageUpload",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tempUrl: "",
      action: `http://localhost:8088/admin/cloud/img`,
      data: { title: "" },
      headers: { token: "" }
    };
  },
  computed: {
    imageUrl() {
      return this.value;
    }
  },
  methods: {
    beforeUpload() {
      const _self = this;
      const token = getToken();
      const title = this.$parent.$parent.$parent.postForm.title;
      _self._data.data.title = title;
      _self._data.headers.token = token;
    },
    rmImage() {
      this.emitInput("");
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    handleImageSuccess() {
      this.emitInput(this.tempUrl);
    },
    onRemove() {
      this.$message({
        message: "电子书删除成功",
        type: "success"
      });
      this.$emit("onRemove");
    },
    onSuccess(response) {
      // console.log('onSuccess', response, file)
      // console.log(response);
      this.tempUrl = response.data;
      this.handleImageSuccess();
      this.$emit("onSuccess", response.data);
    },
    onError(err) {
      const errMsg = (err.message && JSON.parse(err.message)) || "上传失败";
      this.$message({
        message:
          (errMsg.msg && `上传失败，失败原因：${errMsg.msg}`) || "上传失败",
        type: "error"
      });
      this.$emit("onError", err);
    }
  }
};
</script>

<style scoped>
.upload-container {
  width: 100%;
  position: relative;
}
.upload-container .image-uploader {
  width: 35%;
  float: left;
}
.upload-container .image-preview {
  width: 200px;
  height: 200px;
  position: relative;
  border: 1px dashed #d9d9d9;
  float: left;
  margin-left: 50px;
}
.upload-container .image-preview .image-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.upload-container .image-preview .image-preview-wrapper img {
  width: 100%;
  height: 100%;
}
.upload-container .image-preview .image-preview-action {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  cursor: pointer;
  text-align: center;
  line-height: 200px;
}
.upload-container .image-preview .image-preview-action .el-icon-delete {
  font-size: 36px;
}
.upload-container
  .image-preview
  .image-preview-action:hover
  .image-preview-action {
  opacity: 1;
}
</style>
