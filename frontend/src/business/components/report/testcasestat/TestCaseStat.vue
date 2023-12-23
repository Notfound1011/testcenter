<template>
  <ms-container>
    <ms-main-container>
      <el-card v-loading="result.loading">
        <div class="search-bar">
          <el-select v-model="value" filterable placeholder="切换成员" clearable @change="updateInfo"
                     class="select-member">
            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-date-picker @change="updateInfo" v-model="time" value-format="timestamp" type="daterange"
                          start-placeholder="开始日期" end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']"
                          class="date-picker">
          </el-date-picker>
          <el-button type="primary" @click="updateInfo" class="search-button">{{
              $t('commons.adv_search.search')
            }}
          </el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="6" style="margin-left: 30px">
            <el-card :body-style="{ padding: '0px' }" class="card-body">
              <div class="card-content">
                <div v-if="value === ''">
                  用例总数<br>
                  <span class="case-number">{{ allCaseCountNumber }}</span>
                </div>
                <div v-else-if="value !== '1'">个人用例总数<br>
                  <span class="case-number">{{ value }}: {{ allCaseCountNumberByUser }}</span>
                </div>
                <div v-else>个人用例总数<br>
                  <span class="case-number">QA: {{ allCaseCountNumberByUser }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="Echarts" id="main" style="width:90%;height:500%;"></div>
      </el-card>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsChart from "@/business/components/common/chart/MsChart";
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import {groupByMonth, groupByWeek, groupByYear} from "@/common/js/utils";
import {webkit} from "codemirror/src/util/browser";

export default {
  name: "analysis",
  components: {MsChart, MsMainContainer, MsContainer},
  data() {
    return {
      result: {},
      users: [],
      value: '',
      time: '',
      allCaseCountNumber: 0,
      allCaseCountNumberByUser: 0
    }
  },
  activated() {
    this.getUser()
    this.updateInfo()
  },

  computed: {
    requestParams() {
      let params = {};
      if (this.value) params.createUser = this.value;
      if (this.time && this.time.length === 2) {
        params.startTime = this.time[0];
        params.endTime = this.time[1];
      }
      return params;
    }
  },
  // 当组件销毁时，移除事件监听器
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },


  methods: {
    updateInfo() {
      this.myEcharts();
    },

    getUser() {
      let path = "dataFactory/user/list";
      this.$get(path).then(res => {
        this.users = res.data.data;
      }).catch(error => {
        console.error("Error fetching users:", error);
      });
    },

    myEcharts() {
      const url = "/track/count/all";
      this.$axios.post(url, this.requestParams).then((res) => {
        const {allCaseCountNumber, allCaseCountNumberByUser, caseCount} = res.data.data;
        this.allCaseCountNumber = allCaseCountNumber;
        this.allCaseCountNumberByUser = allCaseCountNumberByUser;

        // 检查DOM元素是否存在
        const chartElement = document.getElementById('main');
        if (!chartElement) {
          return;
        }

        // 销毁之前的图表实例，如果有的话
        if (this.myChart) {
          this.myChart.dispose();
        }

        // 图表初始化
        this.myChart = this.$echarts.init(chartElement);

        // 准备图表数据
        const xAxisData = caseCount.map(item => item.groupField);
        const barSeriesDataDay = caseCount.map(item => item.countNumber);

        // 填充其他时间周期的数据
        const {newDate: weekData, newValue: weekValue} = groupByWeek(xAxisData, barSeriesDataDay);
        const {newDate: monthData, newValue: monthValue} = groupByMonth(xAxisData, barSeriesDataDay);
        const {newDate: yearData, newValue: yearValue} = groupByYear(xAxisData, barSeriesDataDay);

        // 构造图表配置
        let option = this.getChartOption(xAxisData, barSeriesDataDay, weekValue, monthValue, yearValue);

        // 设置图表的option配置项
        this.myChart.setOption(option, true);

        // 图例切换事件处理
        this.myChart.on('legendselectchanged', (obj) => {
          this.handleLegendChange(obj.name, this.myChart, xAxisData, weekData, monthData, yearData);
        });
      });
      // 窗口变化时，重置图表大小
      window.addEventListener('resize', this.handleResize);
    },

    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },

    // 获取图表配置
    getChartOption(xAxisData, barSeriesDataDay, weekData, monthData, yearData) {
      return {
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 600
        },
        title: {
          text: '用例新增趋势图',
          subtext: 'Trend Chart of New Testcase',
          left: '4%',
          textStyle: {
            fontSize: 25,
            color: "rgba(55, 96, 186, 1)"
          }
        },
        legend: {
          data: ['按天', '按周', '按月', '按年'],
          selectedMode: 'single', // 单选
          selected: {
            按天: true,
            按周: false,
            按月: false,
            按年: false
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          transitionDuration: 0, //echarts防止tooltip的抖动
        },
        xAxis: {
          data: xAxisData,
          name: '日期'
        },
        yAxis: [
          {
            name: '用例数',
          },
          {
            type: 'value',
          }
        ],
        grid: {
          top: '20%',
          bottom: 100
        },
        series: [
          {
            name: '按天',
            type: 'line',
            showSymbol: false,
            data: barSeriesDataDay
          },
          {
            name: '按周',
            type: 'line',
            showSymbol: false,
            data: weekData
          },
          {
            name: '按月',
            type: 'line',
            showSymbol: false,
            data: monthData
          },
          {
            name: '按年',
            type: 'line',
            showSymbol: false,
            data: yearData
          }
        ]
      };
    },

    // 处理图例变化的函数
    handleLegendChange(selectedName, chart, xAxisData, weekData, monthData, yearData) {
      let newData;
      switch (selectedName) {
        case '按天':
          newData = xAxisData;
          break;
        case '按周':
          newData = weekData;
          break;
        case '按月':
          newData = monthData;
          break;
        case '按年':
          newData = yearData;
          break;
      }
      let options = chart.getOption()
      options.xAxis = {
        data: newData,
        name: '日期'
      }
      chart.setOption(options, true);
    }
  }
}
</script>

<style scoped>
.select-member, .date-picker, .search-button {
  margin-left: 40px;
  margin-bottom: 10px;
  margin-top: 20px;
}

.stats-card {
  margin-left: 30px;
}

.card-body {
  background: rgba(55, 96, 186, 1);
  margin: 10px;
}

.card-content {
  padding: 15px;
  color: #FFFFFF;
  float: left;
}

.case-number {
  font-size: 30px;
}

/* 可以使用媒体查询来调整不同屏幕大小下的样式 */
@media (max-width: 768px) {
  .Echarts #main {
    height: 300px; /* 较小屏幕上的高度调整 */
  }
}
</style>
