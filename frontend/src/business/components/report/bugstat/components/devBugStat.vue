<template>
  <div>
    <div :id="id" style="width:95%;height:500%;margin: 20px"></div>
  </div>
</template>

<script>
import {groupArray, jiraAddress, map2List} from "@/common/js/utils";
import * as echarts from 'echarts';

export default {
  name: "devBugStat",
  props: ['id', 'qaCreatedBugJQL', 'ldapUser'],
  data() {
    return {
      jira_address: jiraAddress(),
      devBugBarChart: null,
      url: jiraAddress() + "/issues/?jql=" + this.qaCreatedBugJQL
    }
  },
  methods: {
    devBugStat(data) {

      const developers = [];
      const users = [];
      groupArray(data, 'customfield_10300').forEach((value) => { //数组循环
          const valueObj = {};
          valueObj["user"] = value["location"];
          developers.push(valueObj["user"])
          valueObj["url"] = this.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL + " AND developer = \"" + value["location"] + "\"";
          valueObj["total"] = value["count"];
          users.push(valueObj)
        }
      )

      let xAxisData = []
      let totalData = []
      Object.values(users).forEach(value => {
        xAxisData.push(value.user);
        totalData.push(value.total);
      })

      let arr = []
      Object.values(this.ldapUser).forEach(value => {
        if (developers.includes(value["user"])) {
          const valueObj = {};
          valueObj["user"] = value["user"]
          valueObj["group"] = value["group"]
          arr.push(valueObj)
        }
      });

      //用reduce时：
      //reduce:计算数组元素相加后的总和
      //reduce方法接受两个参数，第一个是函数，第二个是初始值

      let titleList = this.ldapUser.map(item => {
        return item.group
      })
      let groupPeople = titleList.reduce(function (prev, next) {
        prev[next] = (prev[next] + 1) || 1;
        return prev;
      }, {});

      //合并方法
      let userMap = {}; //首先声明一个空对象作作为 map

      //遍历数组
      arr.forEach((item) => {
        userMap[item.user] = {
          user: item.user,
          url: item.url,
          total: item.total,
          group: item.group,
        };
      });

      users.forEach((item) => {
        userMap[item.user] = userMap[item.user] || {}; //初始化对象
        userMap[item.user].url = item.url;
        userMap[item.user].total = item.total;
        userMap[item.user].group = userMap[item.user].group || '[leave office]';
      });

      //map 转 arr
      let arrList = map2List(userMap)

      var map = {}, dest = [];
      for (var i = 0; i < arrList.length; i++) {
        var ai = arrList[i];
        if (!map[ai.group]) {
          dest.push({
            group: ai.group,
            total: ai.total,
            people: groupPeople[ai.group],
            item: [ai]
          });
          map[ai.group] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.group == ai.group) {
              dj.total = dj.total + ai.total
              dj.item.push(ai);
              break;
            }
          }
        }
      }

      let xAxisGroupData = []
      let totalGroupAvgData = []
      let totalGroupData = []
      dest.forEach((item) => {
        if (item.group !== '[leave office]') {
          let num = item.total / item.people
          item.avg = Math.floor(num * 100) / 100
          xAxisGroupData.push(item.group.split("[")[1].split("]")[0])
          totalGroupAvgData.push(item.avg)
          totalGroupData.push(item.total)
        }
      })

      if (this.devBugBarChart) {
        this.devBugBarChart.dispose();
      }
      this.devBugBarChart = this.$echarts.init(document.getElementById(this.id));

      let option = {
        title: {
          text: 'DEVELOPER BUG ANALYSIS',
          subtext: 'summary of developer bug',
          link: this.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL,
          textStyle: {
            fontSize: 18,
            color: "rgba(55, 96, 186, 1)"
          }
        },
        legend: {
          data: ['组人均', '按组', '按人'],
          selectedMode: 'single', // 单选
          selected: {
            组人均: true,
            按组: false,
            按人: false
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
          data: xAxisGroupData,
          name: '组人均',
          nameLocation: 'middle',
          nameGap: 65,
          axisLabel: {interval: 0, rotate: 30, margin: 10, overflow: "breakAll", width: 120},
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
            name: '组人均',
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
            data: totalGroupAvgData
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
            data: totalGroupData
          },
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
          }
        ]
      }
      this.devBugBarChart.setOption(option, true)
      // legend切换时触发，更新options.xAxis中的值
      this.devBugBarChart.on('legendselectchanged', params => {
        var options = this.devBugBarChart.getOption()

        // 通用的X轴对象配置函数
        function getXAxisOption(name, data) {
          return {
            data: data,
            name: name,
            nameLocation: 'center',
            nameGap: 65,
            axisLabel: {interval: 0, rotate: 30, margin: 10, overflow: "breakAll", width: 120},
            nameTextStyle: {
              padding: 20,
            }
          };
        }

        // 根据图例名称更新X轴配置
        if (params.name === '组人均' || params.name === '按组') {
          options.xAxis = getXAxisOption(params.name, xAxisGroupData);
        } else if (params.name === '按人') {
          options.xAxis = getXAxisOption(params.name, xAxisData);
        }
        this.devBugBarChart.setOption(options, true)
      })
      //echarts series.bar的点击事件，触发跳转新页面
      this.devBugBarChart.on('click', 'series.bar', obj => {
        let url = this.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL + " AND developer"
        if (xAxisData.includes(obj.name)) {
          url = url + " = " + obj.name
          window.open(url, '_blank');
        } else {
          url = url + " in membersOf(" + "\"" + obj.name + "\"" + ")"
          window.open(url, '_blank');
        }
      });
    },

  }
}
</script>

<style scoped>

</style>
