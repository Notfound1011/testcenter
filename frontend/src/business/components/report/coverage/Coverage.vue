<template>
  <!--<div>{{ $t('commons.quality_market.api_case_coverage.title') }}</div>-->
  <div>
    <div class="chart-content" v-if="echartsDataStatus">
      <el-card shadow="hover" class="grid-content">
        <el-card shadow="hover" class="pie-chart-data-card">
          <span class="pie-chart-data-text">主站Api总数(根据Api已有文档统计)<br></span>
          <span class="pie-chart-data-total">
          {{ unfinishedData.length + completedData.length + excludedData.length }}
        </span>
        </el-card>
        <div class="Echarts" id="pie-chart" style="width:100%;height:600%;"/>
      </el-card>
      <el-card shadow="hover" class="grid-content">
        <div class="Echarts" id="histogram-charts" style="width:100%;height:600%;"/>
      </el-card>
      <el-card shadow="hover" class="grid-content">
        <div class="Echarts" id="line-charts" style="width:100%;height:600%;"/>
      </el-card>
    </div>
    <div v-else class="chart-content-null">
      咋是空啊
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogStatus">
      <el-table :data="dialogFormData" height="60vh" stripe>
        <el-table-column property="title" label="名称" width="200" fixed></el-table-column>
        <el-table-column property="projectName" label="所属项目" width="200"></el-table-column>
        <el-table-column property="tag" label="标签" width="200">
          <template v-slot="scope">
            <el-tag v-for="item in scope.row.tag" :key="item" type="" effect="plain" class="tag-group">
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="docsUrl" label="docs链接" width="90">
          <template v-slot="scope">
            <el-link v-if="scope.row['docsUrl']" :href="scope.row['docsUrl']" class="el-icon-link" style="font-size: 15px; color: blue" target="_blank"></el-link>
          </template>
        </el-table-column>
        <el-table-column property="status" label="状态" width="90"></el-table-column>
        <el-table-column property="addTime" label="创建时间" width="220"></el-table-column>

<!--        <el-table-column align="right">-->
<!--          <template slot="header" slot-scope="scope">-->
<!--            <el-input-->
<!--              v-model="searchStr"-->
<!--              size="mini"-->
<!--              placeholder="输入关键字搜索"/>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {popUpReminder, timestampToTimeFormat}  from '@/common/js/utils';

export default {
  name: "Coverage",
  data() {
    return {
      echartsDataStatus: false,
      unfinishedData: [],
      completedData: [],
      excludedData: [],
      projectData: {},
      excludedRule: {},
      caseDataByTime: null,
      caseDataByMark: null,
      creationTime: null,
      getUTCTime: true,

      searchStr: '',
      dialogStatus: false,
      dialogTitle: '',
      dialogFormData: []
    }
  },
  methods: {
    /**
     * 把时间戳转换为本地时间
     * @param {Array} formData 数据
     * @returns {Array}
     */
    batchConvertTimestamps(formData){
      for (let index in formData){
        formData[index].addTime = `${timestampToTimeFormat(formData[index].addTime, this.getUTCTime)} UTC`
      }
      return formData
    },
    /**
     * 获取line的xData
     * ps: 创建和下线基本相同, 取1个即可
     * @param {Array} lineFormData line数据
     * @returns {Array}
     */
    getLineXData(lineFormData){
      let xData = []
      for (let index in lineFormData){
        if (lineFormData[index].time > 0) {
          xData.push(`${timestampToTimeFormat(lineFormData[index].time, this.getUTCTime, true)} UTC`)
        }else{
          xData.push('更早以前')
        }
      }
      return xData
    },
    /**
     * 请求接口获取数据, 并生成可用数据的
     */
    dataGeneration() {
      const that = this;
      that.$axios.get("/pyServer/Jobs/ApiCaseCoverage/Report/Last")
        .then(res => {
          console.log(res.data)
          let tmpData = res.data.data
          that.echartsDataStatus = true
          that.projectData = tmpData.projectData
          that.unfinishedData = that.batchConvertTimestamps(tmpData.unfinishedData)
          that.completedData = that.batchConvertTimestamps(tmpData.completedData)
          that.excludedData = that.batchConvertTimestamps(tmpData.excludedData)
          that.excludedRule = tmpData.excludedRule
          that.caseDataByTime = tmpData.caseDataByTime
          that.caseDataByMark = tmpData.caseDataByMark
          that.creationTime = `${timestampToTimeFormat(tmpData.creationTime, that.getUTCTime)} UTC`

          return that.echartsDataStatus;
        }).catch(() => {
        console.log('获取覆盖率接口失败')
        popUpReminder(this, '获取覆盖率数据失败!')
        return that.echartsDataStatus;
      })
    },
    /**
     * 操作 el dialog
     * @param {Array} formData
     * @param {String} dialogTitle
     */
    dialogTableVisible(formData, dialogTitle){
      const that = this;
      that.dialogStatus = true;
      that.dialogTitle = dialogTitle;
      that.dialogFormData = formData;
    },
    /**
     * 根据id list 获取api数据, 并且转换成dialog可以读的内容
     * @param {Array} idList line数据
     * @param {String} dialogTitle 标题头
     * @returns
     */
    createApiData(idList, dialogTitle){
      if (idList.length > 0){
        const that = this;
        that.$axios.post("/pyServer/TestCase/Search", {case_id_list: idList, limit: 200})
          .then(res => {
            let tmpList = []
            let data = res.data.data
            for(let index in data){
              tmpList.push({'docsUrl': data[index].docs_url, 'path': data[index].path,
                'status': data[index].status ? '启用': '停用', 'method': data[index].method, 'projectName': '',
                'title': data[index].case_name, 'addTime': data[index]['created_at'], 'tag': data[index].mark})
            }
            this.dialogTableVisible(tmpList, dialogTitle)
          }).catch(() => {
          popUpReminder(this, '获取case数据失败!')
        })
        // this.dialogTitle()
      }
    },
    /**
     * 饼图
     */
    pieChart(){
      const that = this;
      //图表初始化
      let chartObj = this.$echarts.init(document.getElementById('pie-chart'));
      chartObj.setOption(
        {
          tooltip: {
            trigger: 'item',
          },
          toolbox: {
            show: true,
            right: '70',
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          // color: ['#8eb021', '#3b7fc4', '#d04437', '#f6c342', '#654982', '#f691b2', '#999999'],
          color: ['#91cc75', '#5470c6', '#ee6666', '#fac858', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
          title: {
            text: '主站ApiAutoTest覆盖率',
            subtext: `构建时间: ${that.creationTime}`,
            left: 'center',
            // link: that.jira_address + "/issues/?jql=" + this.qaCreatedBugJQL,
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
              name: '覆盖率统计',
              type: 'pie',
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
              data: [
                {name: '未覆盖Api', value: that.unfinishedData.length, keyName: 'unfinishedData'},
                {name: '已覆盖Api', value: that.completedData.length, keyName: 'completedData'},
                {name: '已排除Api', value: that.excludedData.length, keyName: 'excludedData'}
              ]
            }
          ]
        }
      )
      chartObj.on("click", function (e) {
        that.dialogTableVisible(that[e.data.keyName], e.data.name + '列表')
      });
    },
    /**
     * 柱状图
     */
    histogram(){
      const that = this;
      let xData = Object.keys(that.caseDataByMark);
      let yData = [];
      for (let index in xData){
        yData.push(that.caseDataByMark[xData[index]].value)
      }
      let chartObj = that.$echarts.init(document.getElementById('histogram-charts'));
      chartObj.setOption({
        title: {
          text: '根据mark筛选',
          // subtext: 'summary of developer bug',
          // link: '',
          textStyle: {
            fontSize: 18,
            color: "rgba(55, 96, 186, 1)"
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
          data: xData,
          // name: '组人均',
          nameLocation: 'middle',
          nameGap: 65,
          axisLabel: {interval: 0, rotate: 50, margin: 10, overflow: "breakAll", width: 120},
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
            data: yData
          }
        ]
      });
      // 绑定点击事件
      chartObj.on('click', (e) => {
        that.createApiData(e.data['id_list'], e.seriesName)
      });
    },
    /**
     * 增长折线图
     */
    lineChart(){
      const that = this;
      let xData = that.getLineXData(that.caseDataByTime['creation_time']);
      let chartObj = that.$echarts.init(document.getElementById('line-charts'));
      chartObj.setOption({
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 600
        },
        title: {
          text: 'ApiCase增长曲线',
          // subtext: 'Trend Chart of TestCase PassRate',
          // left: '0%',
          textStyle: {
            fontSize: 25,
            color: "rgba(55, 96, 186, 1)"
          }
        },
        legend: {
          data: ['增长曲线', '下线曲线'],
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
          // formatter: '{b0}<br/>{a0}: {c0}%<br />{a1}: {c1}<br />'  // 显示百分比
        },
        xAxis: {
          data: xData,
          name: '日期',
          nameGap: 65,
          axisLabel: {interval: 0, rotate: 50, margin: 10, overflow: "breakAll", width: 120},
          nameTextStyle: {
            padding: 20,
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '数量',
            axisLabel: {
              show: true,
              interval: 'auto',
              // formatter: '{value}%'
            },
          }
        ],
        grid: {
          top: '20%',
          bottom: 100
        },
        series: [
          {
            name: '增长曲线',
            type: 'line',
            data: that.caseDataByTime['creation_time']
          },
          {
            name: '下线曲线',
            type: 'line',
            data: that.caseDataByTime['disabled']
          }
        ]
      });
      // 绑定点击事件
      chartObj.on('click', (e) => {
        that.createApiData(e.data['id_list'], e.seriesName)
      });
    }
  },
  mounted(){
    this.dataGeneration()
  },
  updated(){
    if (this.echartsDataStatus){
      this.pieChart();
      this.histogram();
      this.lineChart();
    }
  }
}
</script>

<style scoped>
/*沿用统一风格*/
.pie-chart-data-total {
  color: rgb(255, 153, 0);
  font-size: 20px;
  font-weight: bold;
}
.pie-chart-data-text {
  color: rgb(128, 127, 127);
  font-size: 16px;
}

.pie-chart-data-card{
  width:20%;
  text-align: center;
}
.grid-content{
  border-radius: 4px;
  min-height: 36px;
  margin: 10px;
}

</style>
