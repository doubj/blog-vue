<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import { getCategoryStatistic } from '@/api/dashboard'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      data: [],
      categories: []
    }
  },
  watch: {
    data: {
      handler() {
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: this.categories
          },
          series: [
            {
              name: '分类统计',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: this.data,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getData() {
      getCategoryStatistic().then(response => {
        for (var v of response) {
          const obj = { 'name': v.categoryName, 'value': v.blogCount }
          this.data.push(obj)
          this.categories.push(v.categoryName)
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
    }
  }
}
</script>
