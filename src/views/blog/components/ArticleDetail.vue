<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="submitItem">
        <el-button
          v-loading="loading"
          style="margin-left:81%"
          type="success"
          @click="submitForm"
        >发表</el-button>
      </div>

      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title" label="标题:">
              <el-input v-model="postForm.title" name="name" required>标题</el-input>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="50px" label="分类:" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.categoryName"
                      allow-create
                      clearable
                      filterable
                      remote
                      placeholder="请选择分类"
                    >
                      <el-option
                        v-for="(item,index) in categoryOptions"
                        :key="item+index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="14">
                  <el-form-item label-width="120px" label="标签:" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.tags"
                      allow-create
                      multiple
                      filterable
                      remote
                      placeholder="请选择标签"
                    >
                      <el-option
                        v-for="(item,index) in tagOptions"
                        :key="item+index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="50px" label="摘要:">
          <el-input
            v-model="postForm.summary"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入文章摘要"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <el-form-item prop="content" style="height:800px;margin-bottom: 30px">
          <mavon-editor v-model="postForm.content" @imgAdd="$imgAdd" ref="md" />
        </el-form-item>

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getCategories,
  getTags,
  addBlog,
  updateBlog,
  getBlog
} from "@/api/article";
// import MarkdownEditor from "@/components/MarkdownEditor";
import Upload from "@/components/Upload/SingleImage";
import Warning from "./Warning";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import request from '@/utils/request'

const defaultForm = {
  id: "", // id
  title: "", // 文章题目
  content: "", // 文章内容
  summary: "", // 文章摘要
  image_uri: "", // 文章图片
  categoryName: "", // 分类名称
  tags: "", // 博客标签
  status: "draft"
};

export default {
  name: "ArticleDetail",
  components: { mavonEditor, Upload, Warning },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      categoryObjArr: [],
      loading: false,
      categoryOptions: [],
      tagOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        categoryName: [{ validator: validateRequire }],
        summary: [{ validator: validateRequire }],
        tags: [{ validator: validateRequire }]
      },
      tempRoute: {}
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.summary.length;
    }
  },
  created() {
    request({url: '/categories', method: 'get'}).then(res => {
      console.log(res)
    })
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.blogId;
      this.fetchData(id);
    }
    this.fetchSelectOptions();
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(id) {
      getBlog(id).then(response => {
        this.blogDTOToVo(response);
        this.setTagsViewTitle();
        this.setPageTitle();
      });
    },
    fetchSelectOptions() {
      this.fetchCategoryOptions();
      this.fetchTagOptions();
    },
    fetchCategoryOptions() {
      getCategories().then(response => {
        // categoryObjArr临时存储，在提交时需要填充categoryId字段
        this.categoryObjArr = response;
        this.categoryOptions = response.map(item => item.categoryName);
      });
    },
    fetchTagOptions() {
      getTags().then(response => {
        this.tagOptions = response.map(item => item.tagName);
      });
    },
    setTagsViewTitle() {
      const title = "编辑博客";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title} - ${this.postForm.id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "编辑博客";
      document.title = `${title} - ${this.postForm.id}`;
    },
    blogVoToDTO() {
      const {
        title,
        content,
        summary,
        categoryName,
        image_uri,
        tags,
        status
      } = this.postForm;
      let blogTags = "";
      tags.some((tag, index, arr) => {
        blogTags += tag;
        if (index !== arr.length - 1) {
          blogTags += ",";
        }
      });
      const category = this.categoryObjArr.find(
        item => item.categoryName === categoryName
      );
      const blogDto = {
        blogTitle: title,
        blogCoverImage: image_uri,
        blogCategoryId: category ? category.categoryId : 0,
        blogCategoryName: categoryName,
        blogSummary: summary,
        blogTags: blogTags,
        blogContent: content,
        blogStatus: status
      };
      return blogDto;
    },
    blogDTOToVo(data) {
      const {
        blogId,
        blogTitle,
        blogCoverImage,
        blogCategoryName,
        blogSummary,
        blogTags,
        blogContent,
        blogStatus
      } = data;
      this.postForm.id = blogId;
      this.postForm.title = blogTitle;
      this.postForm.content = blogContent;
      this.postForm.summary = blogSummary;
      this.postForm.image_uri = blogCoverImage;
      this.postForm.categoryName = blogCategoryName;
      this.postForm.tags = blogTags.split(",");
      this.postForm.status = blogStatus;
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const blog = Object.assign({}, this.blogVoToDTO());
          if (!this.isEdit) {
            // 添加博客
            addBlog(blog)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "发布文章成功",
                  type: "success",
                  duration: 2000
                });
                this.loading = false;
                this.resetForm();
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            // 更新博客
            blog.blogId = this.postForm.id;
            updateBlog(blog)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "更新文章成功",
                  type: "success",
                  duration: 2000
                });
                this.loading = false;
                // 跳转列表页，用redirect
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.postForm = Object.assign({}, defaultForm);
    },
    $imgAdd(pos, $file){
      var formdata = new FormData();
      formdata.append("file", $file);
      formdata.append("title", this.postForm.title);
      request({url: '/cloud/img', method: 'post', data: formdata}).then( res => {
        this.$refs.md.$img2Url(pos, res);
      })
    }
  }
};
</script>

<style scoped>
.v-note-wrapper {
  height: 800px !important;
  max-height: 800px !important;
  z-index: 10 !important;
  overflow-y: auto;
}
.createPost-container {
  position: relative;
}
.submitItem{
  position: fixed;
  top: 50px;
  height: 50px;
  width: 100%;
  z-index: 20;
  background: #d0d0d0;
  padding: 5px;
}
.createPost-container .createPost-main-container {
  padding: 80px 45px 20px 50px;
}
.createPost-container .createPost-main-container .postInfo-container {
  position: relative;
  margin-bottom: 10px;
}
.createPost-container
  .createPost-main-container
  .postInfo-container
  .postInfo-container-item {
  float: left;
}

.createPost-container .word-counter {
  width: 40px;
  position: absolute;
  right: 10px;
  top: 0px;
}

.article-textarea /deep/ textarea {
  padding-right: 40px;
  resize: none;
  border: none;
  border-radius: 0px;
  border-bottom: 1px solid #bfcbd9;
}
</style>