<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button slot="reference" type="info" class="filter-item" @click="helpDialog=!helpDialog">帮助</el-button>
      <el-input
        v-model="listQuery.nickName"
        placeholder="昵称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <div>
        <el-radio v-model="listQuery.type" label="message" @change="handleFilter">留言</el-radio>
        <el-radio v-model="listQuery.type" label="article" @change="handleFilter">文章评论</el-radio>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="commentId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.commentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系邮箱" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listQuery.type === 'article'"
        label="博客ID"
        prop="relationId"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.relationId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复昵称" width="110px" align="center">
        <template slot-scope="{row}">
          <span :class="{'admin': row.beRepliedAdmin}">{{ row.replyNickName || ' ' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父ID" width="110px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.pid > 0">{{row.pid}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleReply(row)">回复</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog title="回复留言" :visible.sync="dialog" width="30%" :before-close="handleClose">
      <span>{{ row.content }}</span>
      <el-input
        style="margin-top:20px"
        type="textarea"
        :rows="2"
        placeholder="请输入回复"
        v-model="textarea"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submitReply">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="帮助信息" :visible.sync="helpDialog" width="30%" center>
      <p>
        1. 可通过昵称进行
        <strong>模糊查找</strong>
      </p>
      <p>2. 可通过<strong>单选按钮切换检索的评论</strong></p>
      <p>
        3. 结果默认按ID的
        <strong>升序排序</strong>
      </p>
      <p>
        4. <strong>表格项左箭头</strong>可快速查看具体评论内容
      </p>
      <p>5. 不会显示博主回复的评论。
        <strong>如需查看，可浏览前台页</strong>
      </p>
      <p>
        6. 
        <strong>删除会连着删除其所有子评论</strong>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from "@/api/comment";
import Pagination from "@/components/Pagination";
export default {
  name: "MessageList",
  components: { Pagination },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        type: "message",
        nickName: undefined
      },
      row: {},
      dialog: false,
      textarea: "",
      helpDialog: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      (this.list = []), (this.total = 0);
      this.loading = true;
      getComments(this.listQuery).then(response => {
        this.list = response.items;
        this.total = response.count;
      });
      // Just to simulate the time of the request
      setTimeout(() => {
        this.loading = false;
      }, 1 * 1000);
    },
    handleClose() {
      this.dialog = false;
      this.textarea = "";
    },
    handleReply(row) {
      this.dialog = true;
      this.row = row;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    submitReply() {
      const data = {};
      var item = this.row;
      if (item.pid !== 0) {
        data.pid = item.pid;
      } else {
        data.pid = item.commentId;
      }
      data.content = this.textarea;
      data.replyAdmin = true;
      data.type = "message";
      data.replyNickName = item.nickName;
      addComment(data).then(() => {
        this.$notify({
          title: "成功",
          message: "回复成功",
          type: "success",
          duration: 2000
        });
      });
      this.textarea = "";
      this.dialog = false;
    },
    handleDelete(row) {
      deleteComment(row.commentId).then(() => {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
      });
      this.getList();
    }
  }
};
</script>

<style scoped>
.admin {
  color: #ff7675;
}
</style>