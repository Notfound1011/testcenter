<template>
  <div>
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-card shadow="hover" class="card">
            <span class="data">{{ this.bugTotal }} <br>
            </span>
            <span class="description">测试环境bug数
            </span>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <BaseChart :chartId="id" :chartOptions="chartOptions" @chart-click="handleChartClick"/>
  </div>
</template>

<script>
import {jiraAddress, groupArray} from "@/common/js/utils";
import BaseChart from "@/business/components/report/bugstat/components/BaseChart.vue";

export default {
  name: "bugByProjectPieStat",
  components: {BaseChart},
  props: ['id', 'qaCreatedBugJQL', 'bugTotal'],
  data() {
    return {
      chartData: null,
      pieData: {
        issueCount: 0
      },
      jira_address: jiraAddress(),
    }
  },
  computed: {
    chartOptions() {
      // 返回图表的配置
      return this.getChartOptions(this.chartData);
    }
  },
  methods: {
    formatChartData(data) {
      const result = [];
      groupArray(data, 'project').forEach((value) => {
        result.push({
          value: value["count"],
          name: value["location"],
          url: this.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL + " AND project = \"" + value["location"].replace("&", '%26') + "\""
        });
      });
      return result;
    },
    getChartOptions(data) {
      return {
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          right: '5%',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        // color: ['#8eb021', '#3b7fc4', '#d04437', '#f6c342', '#654982', '#f691b2', '#999999', '#815b3a', '#f79232', '#59afe1', '#f15c75'],
        color: ['#91cc75', '#5470c6', '#ee6666', '#fac858', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        title: {
          text: 'Bug by project',
          // subtext: 'BUG总数 ' + this.pieData.issueCount,
          left: "50%",
          link: this.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL,
          target: 'blank',
          textStyle: {
            fontSize: 25,
            color: "rgba(55, 96, 186, 1)"
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'bug 数据统计',
            type: 'pie',
            left: "40%",
            radius: ['30%', '70%'],
            label: {
              position: 'center',
              fontSize: 25,
              fontWeight: 'bold',
              show: false,
              formatter: function (params) { // 默认显示第一个数据
                if (params.dataIndex === 0) {
                  return params.percent + '%' + '\n' + params.name
                } else {
                  return ''
                }
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '25',
                fontWeight: 'bold',
                formatter: function (params) {
                  if (params.dataIndex !== 0) {
                    return params.percent + '%' + '\n' + params.name
                  }
                }
              }
            },
            data: this.formatChartData(data)
          }
        ]
      }
    },
    bugByProject(data) {
      this.chartData = data;  // 更新响应式数据属性
    },
    handleChartClick(params) {
      window.open(params.data.url)
    }
  }
}
</script>

<style scoped>

.header {
  margin: 20px;
}

.data {
  color: rgb(255, 153, 0);
  font-size: 20px;
  font-weight: bold;
}

.description {
  color: rgb(128, 127, 127);
  font-size: 16px;
}

.card {
  display: flex;
  justify-content: center;
}
</style>
