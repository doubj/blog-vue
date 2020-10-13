<template>
  <div class="dashboard-editor-container">
    <panel-group />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <word-cloud-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getArticleStatistic } from '@/api/dashboard'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import WordCloudChart from './components/WordCloudChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    WordCloudChart
  },
  data() {
    return {
      lineChartData: {
        xData: [],
        yData: []
      }
    }
  },
  created() {
    this.getBlogCountWithMonth()
  },
  methods: {
    getBlogCountWithMonth() {
      getArticleStatistic().then(response => {
        for (var v of response) {
          this.lineChartData.xData.push(v.month + '月')
          this.lineChartData.yData.push(v.count)
        }
      })
    }
  }
}
</script>

<style scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

.dashboard-editor-container .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
}
</style>
