<template>
  <!--<div>{{ $t('commons.quality_market.api_case_coverage.title') }}</div>-->
  <div>
    <div class="chart-content" v-if="echartsDataStatus">
      <el-card shadow="hover" class="grid-content">
        <el-card shadow="hover" class="pie-chart-data-card">
          <span class="pie-chart-data-text">主站Api总数(根据Api已有文档统计)<br></span>
          <span class="pie-chart-data-total">
          {{ unfinishedData.length + completedData.length + excludedData.length }}
            <br />
            <span class="pie-chart-data-text">排除规则</span>
          <el-link type="primary" style="font-size: 16px; margin-left: 3px;" @click="dialogExcludedRuleVisible(true)"
                   v-permission="['PROJECT_API_CASE_RECORD:READ+CREATE']" > 查看
          </el-link>
<!--          <el-link type="primary" style="font-size: 16px; margin-left: 3px;" @click="dialogExcludedRuleVisible(false)"-->
<!--                   v-permission="['PROJECT_API_CASE_RECORD:READ+CREATE']" > 编辑-->
<!--          </el-link>-->
            <el-link type="primary" style="font-size: 16px; margin-left: 3px;" @click="runJobNow"
                     v-permission="['PROJECT_API_CASE_RECORD:READ+CREATE']" :disabled="coolDown > 0"> {{ coolDown > 0 ? '等待' + coolDown + '秒' : '立即触发' }}
          </el-link>
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
    <div v-else></div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogStatus">
      <el-input placeholder="请输入内容" v-model="searchValue" class="coverage-input" @keydown.enter.native="filterData" @blur="filterData" size="mini">
        <el-select v-model="searchKey" slot="prepend" placeholder="请选择" class="coverage-select">
          <el-option label="名称" value="title"></el-option>
          <el-option label="所属项目" value="projectName"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="filterData"></el-button>
      </el-input>
      <el-table
        :data="dialogFormData"
        height="60vh" stripe>
        <el-table-column property="title" label="名称" min-width="200" fixed></el-table-column>
        <el-table-column property="projectName" label="所属项目" min-width="200"></el-table-column>
        <el-table-column property="tag" label="标签" min-width="200">
          <template v-slot="scope">
            <div v-if="scope.row.tag">
            <el-tag v-for="item in scope.row.tag" :key="item" type="" effect="plain" class="tag-group">
              {{ item }}
            </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="docsUrl" label="docs链接" min-width="90">
          <template v-slot="scope">
            <el-link v-if="scope.row['docsUrl']" :href="scope.row['docsUrl']" class="el-icon-link" style="font-size: 15px; color: blue" target="_blank"></el-link>
          </template>
        </el-table-column>
        <el-table-column property="status" label="状态" min-width="90"></el-table-column>
        <el-table-column property="addTime" label="创建时间" min-width="220"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 排除规则 -->
    <el-dialog :title="dialogExcludedRuleTitle" :visible.sync="dialogExcludedRuleStatus" v-if="dialogExcludedRuleStatus">
      <el-form :model="excludedRuleForm" ref="excludedRuleForm" label-width="120px">
        <el-form-item label="根据项目:" prop="projectData">
          <template v-slot="scope">
            <div v-if="excludedRuleForm.projectData.length < 1">-</div>
            <div v-else>
              <el-tooltip :key="item['projectId']" v-for="item in excludedRuleForm.projectData"
                          :content="item['reason']" placement="top">
                <el-tag type="" effect="plain" class="tag-group jump" @click="jumpApiDocs(item['jumpUrl'])">
                  {{item.projectName}}
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="根据路径起始:" prop="pathData.start">
          <template v-slot="scope">
            <div v-if="excludedRuleForm.pathData.start.length < 1">-</div>
            <div v-else>
              <el-tooltip :key="item['value']" v-for="item in excludedRuleForm.pathData.start"
                          :content="item['reason']" placement="top">
                <el-tag type="" effect="plain" class="tag-group">
                  {{item.value}}
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="根据路径包含:" prop="pathData.in">
          <template v-slot="scope">
            <div v-if="excludedRuleForm.pathData.in.length < 1">-</div>
            <div v-else>
              <el-tooltip :key="item['value']" v-for="item in excludedRuleForm.pathData.in"
                          :content="item['reason']" placement="top">
                <el-tag type="" effect="plain" class="tag-group">
                  {{item.value}}
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="根据路径后缀:" prop="pathData.end">
          <template v-slot="scope">
            <div v-if="excludedRuleForm.pathData.end.length < 1">-</div>
            <div v-else>
              <el-tooltip :key="item['value']" v-for="item in excludedRuleForm.pathData.end"
                          :content="item['reason']" placement="top">
                <el-tag type="" effect="plain" class="tag-group">
                  {{item.value}}
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="根据文档Id:" prop="apiIdData">
          <template v-slot="scope">
            <div v-if="excludedRuleForm['apiIdData'].length < 1">-</div>
            <div v-else>
              <el-tooltip :key="item['id']" v-for="item in excludedRuleForm['apiIdData']"
                          :content="`${item.name ? `「${item.name}」, ` : ''}${item['reason']}`" placement="top">
                <el-tag type="" effect="plain" :class="item['jumpUrl'] ? 'tag-group jump docs-id': 'tag-group docs-id'" @click="jumpApiDocs(item['jumpUrl'])">
                  {{item.name ? item.name : item.id}}
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {popUpReminder, timestampToTimeFormat, fullScreenLoading}  from '@/common/js/utils';

let jobId = '3ba04766-796d-11ed-898e-3a27e1d6caa3'

export default {
  name: "ApiAutoTestCoverage",
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
      enabledQuantity: 0,
      disabledQuantity: 0,
      getUTCTime: false,
      dialogStatus: false,
      dialogTitle: '',
      formData: [], // 真实的缓存数据
      dialogFormData: [],  // 展示的是数据, 会通过search变更

      searchKey: 'projectName',
      searchValue: '',

      // 排除规则的dialog
      dialogExcludedRuleStatus: false,
      excludedRuleForm: {},  //
      dialogExcludedRuleTitle: '',

      // 触发倒计时
      coolDown: 0
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
        formData[index].addTime = `${timestampToTimeFormat(formData[index].addTime, this.getUTCTime)}${this.getUTCTime ? ' UTC' : ''}`
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
        if (lineFormData[index].startTime > 0) {
          xData.push(`${timestampToTimeFormat(lineFormData[index].startTime, this.getUTCTime, true)} ${this.getUTCTime ? ' UTC' : ''}`)
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
      let loading = fullScreenLoading(that, '资源加载中...');
      that.$axios.get("/pyServer/public/scheduler-task/api-case-coverage/report/last")
        .then(res => {
          console.log(res.data)
          let tmpData = res.data.data
          // let tmpData = require('./debug.json');
          that.echartsDataStatus = true
          that.projectData = tmpData.projectData
          that.unfinishedData = that.batchConvertTimestamps(tmpData.unfinishedData)
          that.completedData = that.batchConvertTimestamps(tmpData.completedData)
          that.excludedData = tmpData.excludedData ? tmpData.excludedData : []
          that.excludedRule = tmpData.excludedRule
          that.caseDataByTime = tmpData.caseDataByTime
          that.caseDataByMark = tmpData.caseDataByMark
          that.creationTime = `${timestampToTimeFormat(tmpData['createdAt'], that.getUTCTime)} ${this.getUTCTime ? ' UTC' : ''}`
          that.enabledQuantity = tmpData.enabledQuantity
          that.disabledQuantity = tmpData.disabledQuantity
          loading.close();
          return that.echartsDataStatus;
        }).catch(() => {
        loading.close();
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
      that.formData = formData;
      that.dialogFormData = formData;
    },
    /**
     * 获取apiCase
     * @param {Object} params 请求数据
     * @param {String} dialogTitle 标题头
     */
    getApiData(params, dialogTitle){
      const that = this;
      params.limit = 2000;  // 2000对应目前的上限
      that.$axios.post("/pyServer/public/test-data/test-case/search", params)
        .then(res => {
          let tmpList = []
          let data = res.data.data
          for(let index in data){
            tmpList.push({'docsUrl': data[index].docsUrl, 'path': data[index].path,
              'status': data[index].status ? '启用': '停用', 'method': data[index].method, 'projectName': '',
              'title': data[index].caseName, 'tag': data[index].mark,
              'addTime': `${timestampToTimeFormat(data[index]['createdAt'], this.getUTCTime)} ${this.getUTCTime ? ' UTC' : ''}`
            })
          }
          this.dialogTableVisible(tmpList, dialogTitle)
        }).catch(() => {
        popUpReminder(this, '获取case数据失败!')
      })
    },
    /**
     * 饼图
     */
    pieChart(){
      const that = this;
      //图表初始化
      let chartObj = this.$echarts.init(document.getElementById('pie-chart'));
      // 根据是否有返回排除的数据, 如果没有不展示这个数据
      let pieArr;
      if (Array.isArray(that.excludedData) && that.excludedData.length > 0){
        pieArr = [
          {name: '未覆盖Api', value: that.unfinishedData.length, keyName: 'unfinishedData'},
          {name: '已覆盖Api', value: that.completedData.length, keyName: 'completedData'},
          {name: '已排除Api', value: that.excludedData.length, keyName: 'excludedData'}
        ]
      }else{
        pieArr = [
          {name: '未覆盖Api', value: that.unfinishedData.length, keyName: 'unfinishedData'},
          {name: '已覆盖Api', value: that.completedData.length, keyName: 'completedData'},
        ]
      }
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
              data: pieArr
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
          text: '根据Case标签筛选',
          subtext: `ApiCase总数${that.enabledQuantity + that.disabledQuantity}.`,
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
          name: '标签名称',
          nameLocation: 'middle',
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
      // 先移除事件, 防止多次重复
      chartObj.off('click');
      // 绑定点击事件
      chartObj.on('click', (e) => {
        that.getApiData({'mark': [e.name]}, e.name)
      });
    },
    /**
     * 增长折线图
     */
    lineChart(){
      const that = this;
      let xData = that.getLineXData(that.caseDataByTime['creationTime']);
      let chartObj = that.$echarts.init(document.getElementById('line-charts'));
      chartObj.setOption({
        visualMap: {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 10
        },
        title: {
          text: 'ApiCase增长和下线曲线',
          subtext: `ApiCase启用总数: ${that.enabledQuantity}, ApiCase停用总数: ${that.disabledQuantity}.`,
          // left: '0%',
          textStyle: {
            fontSize: 25,
            color: "rgba(55, 96, 186, 1)"
          }
        },
        legend: {
          data: ['增长', '下线'],
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
            name: '增长',
            type: 'line',
            itemStyle: {"color": '#f7efa6'},  // 线的颜色不对, 不会调参数, 直接动顶部的item
            data: that.caseDataByTime['creationTime']
          },
          {
            name: '下线',
            type: 'line',
            // itemStyle: "data",
            data: that.caseDataByTime['disabled']
          }
        ]
      });
      // 先移除事件, 防止多次重复
      chartObj.off('click');
      // 绑定点击事件
      chartObj.on('click', (e) => {
        if (e.seriesName === '下线'){
          that.getApiData({'updateTimeRange': [e.data.startTime, e.data.endTime], 'status': false}, e.seriesName)
        }else{
          that.getApiData({'createTimeRange': [e.data.startTime, e.data.endTime]}, e.seriesName)
        }
      });
    },
    /**
     * 接口数据展示的排除规则, 增加过滤
     */
    filterData(){
      this.dialogFormData = this.formData.filter(data => !this.searchValue || data[this.searchKey].toLowerCase().includes(this.searchValue.toLowerCase()))
    },
    /**
     * 打开排除规则的dialog
     * @param {Boolean} readOnly
     */
    dialogExcludedRuleVisible(readOnly = true){
      const _that = this;
      // 如果是只读, 就把生成报告的规则暴露出来, 修改的时候才去远端获取
      if (readOnly) {
        _that.excludedRuleForm = _that.excludedRule;
        console.log(JSON.stringify(_that.excludedRuleForm))
        _that.dialogExcludedRuleTitle = '当前报告中排除规则 -- 查看';
        _that.dialogExcludedRuleStatus = true;
      } else {
        _that.dialogExcludedRuleTitle = '敬请期待';
        _that.dialogExcludedRuleStatus = true;
      }
    },
    /**
     * like触发一次job
     */
    runJobNow(){
      const that = this;
      if (that.coolDown > 0){
        return
      }
      that.$axios.post("/pyServer/scheduler-task/manage-periodic-task/run-now", {'jobId': jobId})
        .then(res => {
          console.log(res.data)
          let tmpData = res.data
          if (tmpData.code === 0){
            popUpReminder(that, '触发成功!', '', 'success')
            that.coolDown = 60;
            let timer = setInterval(() =>{
              that.coolDown --;
              if (that.coolDown <= 0){
                clearInterval(timer);
              }
            }, 1000)
          }
        }).catch(() => {
        popUpReminder(this, `触发失败!!!`, '接口自动化覆盖率任务')
        that.coolDown = 0;
      })
    },
    /**
     * 支持跳转到api文档路径
     * @param jumpUrl
     */
    jumpApiDocs(jumpUrl){
      if (jumpUrl){
        window.open(jumpUrl, '_blank');
      }
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
.coverage-select {
  width: 130px;
}
.coverage-input {
  width: 450px;
}
.tag-group {
  margin: 2px;

}
.tag-group.jump{
  cursor: pointer;
}
.tag-group.docs-id{
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
