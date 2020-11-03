<template>
  <div>
    <el-dialog
      top="20px"
      title="评论列表"
      :visible.sync="commentQueryHelper.show"
      width="50%"
      center
    >
      <div class="comment-container" v-loading="commentQueryHelper.loading">
        <div
          class="comment-item"
          v-for="(comment, idx) in commentQueryHelper.items"
          :key="idx"
        >
          <div class="comment-parent" @click="commentReply(comment)">
            <p class="header">
              <strong>{{ comment.nickName }}</strong>
              <span>：{{ comment.createTime }}</span>
              <i v-if="!comment.checked">New</i>
            </p>
            <p class="content">{{ comment.content }}</p>
          </div>
          <div
            class="comment-subitem"
            v-for="(subItem, i) in comment.children"
            :key="i"
            v-show="i < 2 || comment.showChild"
            @click="commentReply(subItem)"
          >
            <p class="header">
              <strong :class="[{ admin: subItem.replyAdmin }, 'pointer']">{{
                subItem.nickName
              }}</strong>
              <strong v-if="subItem.replyAdmin" class="admin">(博主)</strong>
              &nbsp;回复&nbsp;
              <strong :class="{ admin: subItem.beRepliedAdmin }">{{
                subItem.replyNickName
              }}</strong>
              <strong v-if="subItem.beRepliedAdmin" class="admin"
                >(博主)</strong
              >
              <span>：{{ subItem.createTime }}</span>
              <i v-if="!subItem.checked">New</i>
            </p>
            <p>{{ subItem.content }}</p>
          </div>
          <div
            style="margin-left: 30px; margin-bottom: 10px"
            v-if="comment.children.length > 2 && !comment.showChild"
          >
            <span class="span-edit" @click="toggleShowChild(comment)"
              >共{{ comment.children.length }}条回复 ></span
            >
          </div>
        </div>
      </div>
      <el-pagination
        style="text-align: center"
        background
        @current-change="showComments(commentQueryHelper.blogId)"
        :current-page.sync="commentQueryHelper.page"
        :page-size="commentQueryHelper.limit"
        layout="prev, pager, next"
        :hide-on-single-page="true"
        :total="commentQueryHelper.total"
      >
      </el-pagination>
    </el-dialog>
    <el-dialog
      :visible.sync="replyShow"
      width="30%"
      top="40vh"
      :show-close="false"
    >
      <el-input
        type="textarea"
        :rows="3"
        :placeholder="placeHolder"
        maxlength="255"
        show-word-limit
        v-model="comment.content"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyShow = false">取 消</el-button>
        <el-button type="primary" @click="handleReply()">回复</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getComments, addComment } from "@/api/comment";
export default {
  name: "Comment",
  data() {
    return {
      commentQueryHelper: {
        page: 1,
        limit: 5,
        blogId: null,
        items: [],
        total: 0,
        show: false,
        loading: true,
      },
      comment: {},
      replyShow: false,
      placeHolder: "",
    };
  },
  methods: {
    // 查询评论列表
    showComments(id) {
      const helper = this.commentQueryHelper;
      helper.loading = true;
      helper.show = true;
      helper.blogId = id;
      getComments(this.commentQueryHelper).then((res) => {
        helper.items = res.items;
        helper.loading = false;
        helper.total = res.count;
      });
    },
    // 展开子评论，目前只有展开，没有收起
    toggleShowChild(comment) {
      // 使用$set监听对象具体属性的变化
      this.$set(
        comment,
        "showChild",
        comment.showChild ? !comment.showChild : true
      );
    },
    // 回复并提交
    commentReply(comment) {
      // 先重置
      this.comment = {};
      this.placeHolder = "re：" + comment.nickName;
      this.replyShow = true;
      this.comment.blogId = comment.blogId;
      this.comment.pid = comment.pid === 0 ? comment.commentId : comment.pid;
      this.comment.replyNickName = comment.nickName;
      this.comment.createTime = new Date();
      this.comment.replyAdmin = true;
    },
    handleReply() {
      addComment(this.comment).then((res) => {
        this.commentQueryHelper.items.forEach((item) => {
          if (item.commentId === res.pid) {
            if (!item.children){
              item.children = []
            }
            item.children.push(res);
            this.$notify({
              title: "成功",
              message: "回复成功！",
              type: "success",
              duration: 2000,
            });
            this.replyShow = false;
            return ;
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.comment-container {
  width: 80%;
  margin: 0 auto;
}
.comment-container .comment-item {
  border-bottom: thin solid #b2bec3;
  margin-bottom: 5px;
}
.comment-container .comment-parent:hover,
.comment-container .comment-subitem:hover {
  background: rgba(245, 245, 245, 1);
  cursor: pointer;
}
.comment-container .header {
  font-size: 14px;
}
.comment-container .header > strong {
  color: #1abc9c;
}
.comment-container .header > span {
  color: #9e9e9e;
}
.comment-container .header > i {
  color: #ff3f34;
  font-weight: bold;
  float: right;
}
.comment-container .comment-parent {
  padding: 5px 10px 0;
}
.comment-container .comment-subitem {
  margin-left: 30px;
  padding: 5px 10px 0;
}
.comment-container .comment-subitem .admin {
  color: #ff7675;
}
.span-edit {
  color: #1abc9c;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: "微软雅黑";
}
</style>
