<template>
  <el-dialog title="帮助信息" :visible.sync="show" width="30%" center>
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
</template>

<script>
export default {
  name: "Helper",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped></style>
