<template>
  <div class="table-content ">
    <h3 style="margin-left: 20px">{{ $t('api_test.globalVariablesForAutoTest.text') }}</h3>
    <el-button type="primary" @click="dialogController" class="add-btn" plain>添加公共变量</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="id" label="ID" align="left" fixed="left" min-width="200"/>
      <el-table-column prop="uniqueId" label="唯一ID" align="left" fixed="left" min-width="200"/>
      <el-table-column prop="envData" label="环境配置" min-width="400"/>
      <el-table-column prop="remark" label="备注" align="left" min-width="200"/>
      <el-table-column prop="createdPerson" label="创建人" :formatter="getPerson" min-width="150"/>
      <el-table-column prop="updatedPerson" label="最近更新人" :formatter="getPerson" min-width="150"/>
      <el-table-column prop="createdTime" label="创建时间" :formatter="l_timestampToTimeFormat" min-width="180"/>
      <el-table-column prop="updatedTime" label="更新时间" :formatter="l_timestampToTimeFormat" min-width="180"/>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template>
          <el-button @click="dialogController(true)" type="text" size="small">查 看</el-button>
          <el-button type="text" size="small" @click="dialogController(false, true)">编 辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="filterData.page" :page-sizes="[15, 30, 50, 100]" :page-size="filterData.limit"
                   layout="total, sizes, prev, pager, next, jumper" :total="total"/>

    <el-dialog :title="dialogTitle" :visible.sync="dialogStatus" :before-close="cancelFrom">
      <el-form :model="dialogFrom" :rules="validationRules" ref="dialogFrom" label-width="80px">
        <el-form-item label="唯一Id" prop="uniqueId">
          <el-input v-model="dialogFrom.uniqueId" placeholder="鉴别配置的唯一id" :readonly="readOnly || !addEnvData" />
        </el-form-item>
        <el-form-item :label="tmpValue" v-for="tmpValue in envConfig" :key="tmpValue" :readonly="readOnly">
          <el-input v-model="dialogFrom.envData[tmpValue]" placeholder="输入value, 目前仅支持str." style="width: 100%;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogFrom.remark" :readonly="readOnly"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" v-if="!readOnly">{{
              addEnvData ? "创 建" : "修 改"
            }}
          </el-button>
          <el-button @click="cancelFrom">{{ readOnly ? "关 闭" : "取 消" }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getApiTestConfig, popUpReminder, timestampToTimeFormat} from "@/common/js/utils";

export default {
  name: "globalVariablesForAutoTest",
  data() {
    return {
      total: 0,
      filterData: {page: 1, limit: 30},
      tableData: [],
      readOnly: false,  // 弹窗是否是是 可读属性
      addEnvData: false,  // 判断是 新增还是修改
      dialogTitle: 'false',
      dialogStatus: false,
      envConfig: [],  // 远端请求的
      dialogFrom: {uniqueId: '', envData: {fat: '', prod: ''}, remark: ''},
      validationRules: {
        "uniqueId": "",
        "envData": {
          "fat": "",
          "prod": ""
        },
        "remark": ""
      },
    }
  },
  methods: {
    /**
     * 判断每行状态,
     * @param row
     * @param rowIndex
     */
    tableRowClassName({row, rowIndex}) {
      if (!row.status) {
        return 'warning-row'
      } else if (rowIndex % 2 === 0) {
        return 'stripe-row'
      } else {
        return ''
      }
    },
    /**
     * 时间戳转字符串格式
     * @param row
     * @param column
     * @returns {String}
     */
    l_timestampToTimeFormat(row, column) {
      return timestampToTimeFormat(row[column.property], false)
    },
    /**
     * 监听每页大小变化
     * @param newSize
     */
    handleSizeChange(newSize) {
      this.filterData.limit = newSize
      this.getUserPool()
    },
    /**
     * 监听页码变化
     * @param newPage
     */
    handleCurrentChange(newPage) {
      this.filterData.page = newPage
      this.getUserPool()
    },
    /**
     * 返回person名称
     * @param row
     * @param column
     * @returns {*|string}
     */
    getPerson(row, column) {
      let person = row[column.property];
      return person ? person.name : '-'
    },
    /**
     * 获取公共配置
     */
    getGlobalVariables() {
      const that = this;
      that.$axios.get("/pyServer/public/test-data/test-config/global-variables/search", {params: that.filterData})
        .then(res => {
          console.log(res.data)
          that.tableData = res.data.data
        }).catch(() => {
        popUpReminder(this, '获取配置数据失败!')
      })
    },
    dialogController(readOnly = false, update = false) {
      if (update){
        this.readOnly = false;
        this.addEnvData = false;
        this.dialogTitle = "修改配置"
      }else if (!update && readOnly){
        this.readOnly = true;
        this.addEnvData = false;
        this.dialogTitle = "查看配置"
      }else{
        this.readOnly = false;
        this.addEnvData = true;
        this.dialogTitle = "创建新配置"
      }
      this.getEnvConfig()
    },
    /**
     * 取消, 重置到原始状态
     */
    cancelFrom() {
      this.dialogStatus = false;
      this.dialogFrom = {uniqueId: '', remark: '', envData: {'fat': '', 'prod': ''}}
    },
    /**
     * 提交表单
     */
    submitForm() {
      const that = this;
      // 判断是添加还是修改
      let url =  that.addEnvData ? '/pyServer/test-data/test-config/global-variables/create' : '/pyServer/test-config/global-variables/update'
      that.$axios.post(url, that.dialogFrom)
        .then(res => {
          console.log(res.data)
          popUpReminder(this, res.data.msg, that.dialogFrom.uniqueId, 'info')
          that.dialogStatus = false;
          that.getGlobalVariables()
        }).catch(() => {
        popUpReminder(this, `${that.addEnvData ? '创建' : '更新'}配置失败!`, that.dialogFrom.uniqueId)
        that.dialogStatus = false;
      })
    },
    /**
     * 获取env变量, 打开和变更的时候都会重新请求
     */
    getEnvConfig(){
      this.$axios.get("/pyServer/public/test-data/test-config/search", {params: {'configId': getApiTestConfig('getEnvConfigByApiCase')}})
        .then(res => {
          this.dialogStatus = true;
          this.envConfig = res.data.data['configData']
        }).catch(() => {
        this.dialogStatus = false;
        popUpReminder(this, `${this.dialogTitle} 失败!, uniqueId: ${this.dialogFrom.uniqueId}`)
      })
    }
  },

  created() {
    this.getGlobalVariables()
  }
}
</script>

<style>
.add-btn {
  text-align: center;
  margin-left: 20px;
  margin-bottom: 10px;
}

.el-table .warning-row {
  background: radial-gradient(oldlace, white);
}

.el-table .stripe-row {
  background: #F7F7F7;
}

.add-btn {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 200px;
}

.table-content {
  padding: 0 10px 10px 10px;
}
</style>
