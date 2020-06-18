<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.nickName }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.nickName }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <span class="iconfont icon-Userpersonavtar" />
          <span>简介</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">{{ user.introduce }}</div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <span class="iconfont icon-skill" />
          <span>技能</span>
        </div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Java</span>
            <el-progress :percentage="50" />
          </div>
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="30" />
          </div>
          <div class="progress-item">
            <span>MarkDown</span>
            <el-progress :percentage="50" />
          </div>
        </div>
      </div>
      <div class="user-safe user-bio-section">
        <div class="user-bio-section-header">
          <span class="iconfont icon-anquan" />
          <span>安全选项</span>
        </div>
        <div class="user-bio-section-body">
          <el-link style="float:right" type="primary" @click="$refs.pass.dialog = true">修改密码</el-link>
        </div>
      </div>
    </div>
    <updatePass ref="pass" />
  </el-card>
</template>

<script>
import PanThumb from "@/components/PanThumb";
import UpdatePass from "./UpdatePass"

export default {
  components: { PanThumb, UpdatePass },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          nickName: "",
          avatar: "",
          role: "",
          introduce: ""
        };
      }
    }
  },
  methods:{
    
  }
};
</script>

<style scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile .user-name {
  font-weight: bold;
}

.user-profile .box-center {
  padding-top: 10px;
}

.user-profile .user-role {
  padding-top: 10px;
  font-weight: 400;
  font-size: 14px;
}

.user-profile .box-social {
  padding-top: 30px;
}
.user-profile .box-social .el-table {
  border-top: 1px solid #dfe6ec;
}

.user-profile .user-follow {
  padding-top: 20px;
}

.user-bio {
  margin-top: 20px;
  color: #606266;
}
.user-bio span {
  padding-left: 4px;
}

.user-bio .user-bio-section {
  font-size: 14px;
  padding: 15px 0;
}
.user-bio .user-bio-section .user-bio-section-header {
  border-bottom: 1px solid #dfe6ec;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
