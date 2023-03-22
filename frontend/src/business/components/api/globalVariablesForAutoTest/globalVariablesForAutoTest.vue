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
      <el-table-column prop="fat" label="测试环境" :formatter="getVariablesValue" min-width="200"/>
      <el-table-column prop="prod" label="生产环境" :formatter="getVariablesValue" min-width="200"/>
      <el-table-column prop="remark" label="备注" align="left" min-width="200"/>
      <el-table-column prop="createdPerson" label="创建人" :formatter="getPerson" min-width="150"/>
      <el-table-column prop="updatedPerson" label="最近更新人" :formatter="getPerson" min-width="150"/>
      <el-table-column prop="createdTime" label="创建时间" :formatter="l_timestampToTimeFormat" min-width="180"/>
      <el-table-column prop="updatedTime" label="更新时间" :formatter="l_timestampToTimeFormat" min-width="180"/>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button @click="readGlobalVariables(scope.row)" type="text" size="small">查 看</el-button>
          <el-button type="text" size="small" @click="updateGlobalVariables(scope.row)">编 辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="filterData.page" :page-sizes="[15, 30, 50, 100]" :page-size="filterData.limit"
                   layout="total, sizes, prev, pager, next, jumper" :total="total"/>

    <el-dialog :title="dialogTitle" :visible.sync="dialogStatus" :before-close="cancelFrom">
      <el-form :model="dialogFrom" :rules="validationRules" ref="dialogFrom" label-width="80px">
        <el-form-item label="唯一Id" prop="uniqueId">
          <el-input v-model="dialogFrom.uniqueId" :readonly="readOnly"></el-input>
        </el-form-item>
        <!--        <el-form-item label="变量键值对" required>-->
        <el-form-item label="变量值">
          <div v-for="(tmpValue, tmpIndex) in dialogFrom.envList" :key="tmpIndex">
            <el-col :span="9">
              <el-form-item prop="dialogFrom.envData">
                <el-input v-model="dialogFrom.envList[tmpIndex].key" placeholder="key" style="width: 100%;"
                          :readonly="readOnly"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="9">
              <el-form-item prop="dialogFrom.envData">
                <el-input v-model="dialogFrom.envList[tmpIndex].value" placeholder="value, 必须输入key后才能输入"
                          style="width: 100%;"
                          :readonly="readOnly" :disabled="!dialogFrom.envList[tmpIndex].key"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="!readOnly && dialogFrom.envList.length > 1">
              <el-button @click="deleteEnvData(tmpIndex)">删 除</el-button>
            </el-col>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogFrom.remark" :readonly="readOnly"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" v-if="!readOnly">{{
              addEnvData ? "创 建" : "修 改"
            }}
          </el-button>
          <el-button type="primary" @click="addEnv" v-if="!readOnly"
                     :disabled="!dialogFrom.envList[dialogFrom.envList.length - 1].key">新 增
          </el-button>
          <el-button @click="cancelFrom">{{ readOnly ? "关 闭" : "取 消" }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {popUpReminder, timestampToTimeFormat} from "@/common/js/utils";

export default {
  name: "globalVariablesForAutoTest",
  data() {
    return {
      total: 0,
      filterData: {page: 1, limit: 30},
      tableData: [],
      readOnly: false,
      addEnvData: false,
      dialogTitle: 'false',
      dialogStatus: false,
      // 找不到头绪动态变化key, 只能用list包括dict的方式折中完成, 在提交的时候在转一下, envData只是展示格式
      dialogFrom: {uniqueId: '', envData: {fat: '', prod: ''}, remark: '', envList: [{'key': '', 'value': ''}]},
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
     * 返回person名称
     * @param row
     * @param column
     * @returns {*|string}
     */
    getVariablesValue(row, column) {
      return row['envData'] ? row['envData'][column.property] ? row['envData'][column.property] : '-' : '-'
    },
    /**
     * 获取公共配置
     */
    getGlobalVariables() {
      const that = this;
      that.$axios.get("/pyServer/TestConfig/GlobalVariables/Search", {params: that.filterData})
        .then(res => {
          console.log(res.data)
          that.tableData = res.data.data
        }).catch(() => {
        popUpReminder(this, '获取配置数据失败!')
      })
    },
    /**
     * dialog 控制器
     */
    dialogController() {
      this.readOnly = false;
      this.addEnvData = true;
      this.dialogStatus = true;
      this.dialogTitle = "创建新配置"
    },
    /**
     * 添加环境变量
     */
    addEnv() {
      this.dialogFrom.envList.push({'key': '', 'value': ''});
    },
    /**
     * 删除一条环境变量
     * @param index
     */
    deleteEnvData(index) {
      this.$delete(this.dialogFrom.envList, index)
    },
    /**
     * 取消
     */
    cancelFrom() {
      this.dialogStatus = false;
      this.dialogFrom = {uniqueId: '', remark: '', envList: [{'key': '', 'value': ''}]}
    },
    /**
     * 提交表单
     */
    submitForm() {
      const that = this;
      let tmpData = {}
      for (let index in that.dialogFrom.envList) {
        tmpData[that.dialogFrom.envList[index]['key']] = that.dialogFrom.envList[index]['value']
      }
      that.dialogFrom.envData = tmpData;
      // 判断是添加还是修改
      let url, data
      if (that.addEnvData) {
        url = '/pyServer/TestConfig/GlobalVariables/Create'
        data = {
          'uniqueId': that.dialogFrom.uniqueId,
          'envData': that.dialogFrom.envData,
          'remark': that.dialogFrom.remark
        }
      } else {
        url = '/pyServer/TestConfig/GlobalVariables/Update'
        data = {
          'id': that.dialogFrom.id,
          'uniqueId': that.dialogFrom.uniqueId,
          'envData': that.dialogFrom.envData,
          'remark': that.dialogFrom.remark
        }
      }
      that.$axios.post(url, data)
        .then(res => {
          console.log(res.data)
          popUpReminder(this, res.data.msg, data.uniqueId, 'info')
          that.dialogStatus = false;
          that.getGlobalVariables()
        }).catch(() => {
        popUpReminder(this, `${that.addEnvData ? '创建' : '更新'}配置失败!`, data.uniqueId)
        that.dialogStatus = false;
      })
    },
    /**
     * 变更变量
     * @param row
     */
    updateGlobalVariables(row) {
      this.dialogFrom = JSON.parse(JSON.stringify(row));
      this.createEnvList(row)
      this.readOnly = false;
      this.addEnvData = false;
      this.dialogStatus = true;
      this.dialogTitle = "修改配置"
    },
    /**
     * 查看表单
     * @param row
     */
    readGlobalVariables(row) {
      this.dialogFrom = row;
      this.createEnvList(row)
      this.readOnly = true;
      this.addEnvData = false;
      this.dialogStatus = true;
      this.dialogTitle = "查看配置"
    },
    /**
     * 创建envList用于变更的时候用
     * @param row 每一行的数据
     */
    createEnvList(row) {
      let tmpList = []
      for (let key in row.envData) {
        tmpList.push({'key': key, 'value': row.envData[key]})
      }
      this.$set(this.dialogFrom, 'envList', tmpList)
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
}

.table-content {
  padding: 0 10px 10px 10px;
}
</style>
