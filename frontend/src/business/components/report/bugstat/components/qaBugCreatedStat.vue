<template>
  <div>
    <div :id="id" style="width:95%;height:500%;margin: 20px"></div>
  </div>
</template>

<script>
import {groupArray, jiraAddress} from "@/common/js/utils";
import * as echarts from 'echarts';

export default {
  name: "qaBugCreatedStat",
  props: ['id', 'qaCreatedBugJQL', 'groupData', 'group1', 'group2', 'group3', 'group4', 'group5', 'groupTotalData'],
  data() {
    return {
      jira_address: jiraAddress(),
      qaBugCreatedBarChart: null
    }
  },
  methods: {
    qaBugCreatedStat(data) {
      if (this.qaBugCreatedBarChart) {
        this.qaBugCreatedBarChart.dispose();
      }
      this.qaBugCreatedBarChart = this.$echarts.init(document.getElementById(this.id));

      let datas = groupArray(data, 'creator')
      let xAxisData = []
      let totalData = []
      //定义QA的四个组和组内成员
      let groupData = this.groupData
      let group1 = this.group1
      let group2 = this.group2
      let group3 = this.group3
      let group4 = this.group4
      let group5 = this.group5
      let groupTotalData = this.groupTotalData

      Object.values(datas).forEach(value => {
        xAxisData.push(value.location);
        totalData.push(value.count);
        if (group1.includes(value.location)) {
          groupTotalData[0] = groupTotalData[0] + value.count
        }
        if (group2.includes(value.location)) {
          groupTotalData[1] = groupTotalData[1] + value.count
        }
        if (group3.includes(value.location)) {
          groupTotalData[2] = groupTotalData[2] + value.count
        }
        if (group4.includes(value.location)) {
          groupTotalData[3] = groupTotalData[3] + value.count
        }
        if (group5.includes(value.location)) {
          groupTotalData[4] = groupTotalData[4] + value.count
        }
      });
      let option = {
        title: {
          text: 'BUG CREATED BY QA',
          subtext: 'summary of the bug qa created',
          link: this.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL,
          textStyle: {
            fontSize: 18,
            color: "rgba(55, 96, 186, 1)"
          }
        },
        legend: {
          data: ['按人', '按组'],
          selectedMode: 'single', // 单选
          selected: {
            按人: true,
            按组: false
          }
        },
        toolbox: {
          show: true,
          right: '20',
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
        tooltip: {},
        xAxis: {
          data: xAxisData,
          name: '人',
          nameLocation: 'center',
          nameGap: 35,
          axisLabel: {interval: 0, rotate: 30},
          nameTextStyle: {
            padding: 20,
          }
        },
        yAxis: [
          {
            name: '数量',
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
            name: '按人',
            type: 'bar',
            showSymbol: false,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#83bff6'},
                {offset: 0.5, color: '#188df0'},
                {offset: 1, color: '#188df0'}
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: '#2378f7'},
                  {offset: 0.7, color: '#2378f7'},
                  {offset: 1, color: '#83bff6'}
                ])
              }
            },
            data: totalData
          },
          {
            name: '按组',
            type: 'bar',
            showSymbol: false,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#83bff6'},
                {offset: 0.5, color: '#188df0'},
                {offset: 1, color: '#188df0'}
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: '#2378f7'},
                  {offset: 0.7, color: '#2378f7'},
                  {offset: 1, color: '#83bff6'}
                ])
              }
            },
            data: groupTotalData
          }
        ]
      }
      this.qaBugCreatedBarChart.setOption(option, true)
      // legend切换时触发，更新options.xAxis中的值
      this.qaBugCreatedBarChart.on('legendselectchanged', params => {
        var options = this.qaBugCreatedBarChart.getOption()
        // 定义X轴的基本配置
        var baseXAxisOptions = {
          nameLocation: 'center',
          nameGap: 35,
          axisLabel: {interval: 0, rotate: 30},
          nameTextStyle: {
            padding: 20,
          }
        };

        // 根据图例选择更新X轴的数据和名称
        if (params.name === '按人') {
          options.xAxis = {
            ...baseXAxisOptions, // 展开基本配置
            data: xAxisData,     // 使用人员数据
            name: '人'
          };
        } else if (params.name === '按组') {
          options.xAxis = {
            ...baseXAxisOptions, // 展开基本配置
            data: groupData,     // 使用组别数据
            name: '组'
          };
        }
        this.qaBugCreatedBarChart.setOption(options, true)
      })
      //echarts series.bar的点击事件，触发跳转新页面
      this.qaBugCreatedBarChart.on('click', 'series.bar', obj => {
        let url = this.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL + " AND creator"
        if (groupData.includes(obj.name)) {
          switch (obj.name) {
            case this.groupData[0] :
              url = url + " in (" + group1 + ")"
              break;
            case this.groupData[1] :
              url = url + " in (" + group2 + ")"
              break;
            case this.groupData[2] :
              url = url + " in (" + group3 + ")"
              break;
            case this.groupData[3] :
              url = url + " in (" + group4 + ")"
              break;
            case this.groupData[4] :
              url = url + " in (" + group5 + ")"
              break;
          }
          window.open(url, '_blank');
        } else {
          url = url + " = " + obj.name
          window.open(url, '_blank');
        }
      });
    },

  }
}
</script>

<style scoped>

</style>
