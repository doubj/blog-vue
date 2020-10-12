<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button slot="reference" type="info" class="filter-button" @click="helpDialog=!helpDialog">帮助</el-button>
      <el-input
        v-model="listQuery.title"
        placeholder="标题"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.blogCategoryId"
        placeholder="分类"
        clearable
        class="filter-item"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.categoryId"
          :label="item.categoryName"
          :value="item.categoryId"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button class="filter-button" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <router-link :to="'/blog/create'">
        <el-button
          class="filter-button"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
        >添加</el-button>
      </router-link>
      <el-checkbox
        v-model="showBackImage"
        class="filter-button"
        style="margin-left:15px;"
        @change="tableKey=tableKey+1"
      >显示图片</el-checkbox>
      <el-checkbox
        v-model="listQuery.deleted"
        class="filter-button"
        style="margin-left:15px;"
        @change="handleFilter"
      >回收站</el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.blogId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <router-link :to="'/blog/edit/'+row.blogId">
            <span class="link-type" @click="handleUpdate(row)">{{ row.blogTitle }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.blogCategoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showBackImage" label="背景图片" width="110px" align="center">
        <template slot-scope="{row}">
          <el-popover placement="right" title trigger="hover">
            <el-image slot="reference" :src="row.blogCoverImage+'?imageView2/1/w/20/h/20'" />
            <el-image :src="row.blogCoverImage" style="max-height: 200px;max-width: 200px" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="访问量" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.blogVisits">{{ row.blogVisits }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.blogStatus | statusFilter">{{ row.blogStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link v-if="row.blogStatus!='deleted'" :to="'/blog/edit/'+row.blogId">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button
            v-if="row.blogStatus ==='draft'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'published',$index)"
          >发布</el-button>
          <el-button
            v-if="row.blogStatus === 'published' || row.blogStatus === 'deleted'"
            size="mini"
            @click="handleModifyStatus(row,'draft',$index)"
          >草稿</el-button>
          <el-button
            v-if="row.blogStatus!='deleted'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'deleted',$index)"
          >删除</el-button>
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
    <el-dialog title="帮助信息" :visible.sync="helpDialog" width="30%" center>
      <p>
        1. 可通过标题进行
        <strong>模糊查找</strong>
      </p>
      <p>2. 可通过分类查找该类下所有文章</p>
      <p>
        3. 结果默认都是按ID的
        <strong>升序排序</strong>
      </p>
      <p>
        4. 单击显示图片复选框可以在表格中显示背景图，
        <strong>鼠标悬浮可查看放大效果</strong>
      </p>
      <p>5. 单击文章标题也可进入编辑页面</p>
      <p>
        6. 删除是
        <strong>软删除</strong>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { getListByQuery, getCategories, modifyStatus } from "@/api/article";
import Pagination from "@/components/Pagination";

export default {
  name: "BlogList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      total: 0,
      list: null,
      listLoading: true,
      showBackImage: false,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        blogCategoryId: undefined,
        sort: "+id",
        deleted: false
      },
      categoryOptions: [],
      sortOptions: [
        { label: "升序排列", key: "+id" },
        { label: "降序排列", key: "-id" }
      ],
      helpDialog: false
    };
  },
  created() {
    this.getList();
    this.getCategoryOptions();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getListByQuery(this.listQuery).then(response => {
        this.list = response.items;
        this.total = response.total;
      });
      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false;
      }, 1 * 1000);
    },
    getCategoryOptions() {
      getCategories().then(response => {
        this.categoryOptions = response;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, blogStatus, index) {
      modifyStatus(row.blogId, blogStatus).then(() => {
        if (row.blogStatus === "deleted") {
          this.$notify({
            title: "成功",
            message: "还原成功！",
            type: "success",
            duration: 2000
          });
          this.total--;
          this.list.splice(index, 1);
        } else if (blogStatus === "deleted") {
          this.$notify({
            title: "成功",
            message: "删除成功！",
            type: "success",
            duration: 2000
          });
          this.total--;
          this.list.splice(index, 1);
        } else {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          row.blogStatus = blogStatus;
        }
      });
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    }
  }
};
</script>

<style scoped>
.link-type {
  color: #337ab7;
  cursor: pointer;
}
.link-type:hover{
  color: #20a0ff;
}
</style>