<template>
  <div class="chart-container" :id="chartId"></div>
</template>

<script>
export default {
  name: 'BaseChart',
  props: {
    chartId: {
      type: String,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      myChart: null
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    initChart() {
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.myChart = this.$echarts.init(document.getElementById(this.chartId));
      this.myChart.setOption(this.chartOptions);
      // this.myChart.on("click", (e) => {
      //   if (e.data && e.data.url) {
      //     window.open(e.data.url);
      //   }
      // });
      // 监听图表的点击事件
      this.myChart.on('click', (params) => {
        // 使用 $emit 触发自定义事件，并传递参数
        this.$emit('chart-click', params);
      });

      // 监听图表的点击事件
      this.myChart.on('click', 'series.bar', (params) => {
        // 使用 $emit 触发自定义事件，并传递参数
        this.$emit('chart-click-series-bar', params);
      });
      // legend切换时触发，更新options.xAxis中的值
      this.myChart.on('legendselectchanged', (params) => {
        this.$emit('chart-legend-change', params);
      })
    },
    updateChartOptions(options) {
      this.myChart.setOption(options, true);
    },
    getChartOptions() {
      console.log("myChart")
      console.log("myChart",this.myChart.getOptions())
      return this.myChart.getOptions();
    },
    getChart() {
      return this.myChart;
    }
  }
};
</script>

<style scoped>
.chart-container {
  margin: 20px;
  width: 95%;
  height: 450px;
}
</style>
