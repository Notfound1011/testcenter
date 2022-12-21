<template>
  <div>
    <h1 style="margin-left: 20px">{{ $t('api_test.autoTestAccount.text') }}</h1>
    <el-button type="primary" @click="dialogController" class="add-btn" plain>添加自动化测试账号</el-button>
    <el-table
      :data="tableData"
      :border="true"
      :highlight-current-row="true"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column prop="id" label="ID" min-width="60" sortable fixed="left"></el-table-column>
      <el-table-column prop="uid" label="UID" min-width="90" fixed="left"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="300" fixed="left"></el-table-column>
      <el-table-column prop="env" label="所属环境" min-width="60"></el-table-column>
      <el-table-column prop="webSite" label="所属站点" min-width="80"></el-table-column>
      <el-table-column prop="applicableScene" label="适用场景" header-align="center" min-width="240">
        <template v-slot="scope">
          <el-tag v-for="item in scope.row['applicableScene']" :key="item" type="" effect="plain" class="tag-group">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="账号状态" header-align="center" min-width="80">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="statusHandling(scope.row, 'status', $event)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="public" label="公共账号" header-align="center" min-width="80">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.public"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="statusHandling(scope.row, 'public', $event)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="lockState" label="上锁状态" header-align="center" min-width="80">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row['lockState']"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="left" min-width="200"></el-table-column>
      <el-table-column prop="updatedTime" label="更新时间" :formatter="l_timestampToTimeFormat" min-width="180"/>
      <el-table-column prop="createdPerson" label="创建人" :formatter="getPerson" min-width="150"/>
      <el-table-column prop="updatedPerson" label="最近更新人" :formatter="getPerson" min-width="150"/>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button @click="readAccount(scope.row)" type="text" size="small">查 看</el-button>
          <el-button type="text" size="small" @click="updateAccount(scope.row)">编 辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="filterData.page" :page-sizes="[15, 30, 50, 100]" :page-size="filterData.limit"
                   layout="total, sizes, prev, pager, next, jumper" :total="total"/>

    <el-dialog :title="dialogTitle" :visible.sync="dialogStatus" :before-close="cancelFrom">
      <el-form :model="dialogFrom" :rules="validationRules" ref="dialogFrom" label-width="80px">
        <el-form-item label="UID" prop="uid">
          <el-input v-model="dialogFrom.uid" placeholder="uid" :readonly="readOnly" style="width: 193px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dialogFrom.email" placeholder="邮箱" :readonly="readOnly" style="width: 193px"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dialogFrom.password" placeholder="密码" :readonly="readOnly" style="width: 193px" show-password></el-input>
        </el-form-item>
        <el-form-item label="账号环境" prop="env">
          <el-select v-model="dialogFrom.env" placeholder="请选择" :disabled="readOnly">
            <el-option label="fat" value="fat"> </el-option>
            <el-option label="prod" value="prod"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属站点" prop="webSite">
          <el-select v-model="dialogFrom['webSite']" placeholder="请选择" :disabled="readOnly">
            <el-option label="phemex" value="phemex"> </el-option>
            <el-option label="turkey" value="turkey"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用场景" prop="applicableScene">
          <el-select
            v-model="dialogFrom['applicableScene']"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择适用场景标签"
            :disabled="readOnly">
            <el-option
              v-for="item in applicableSceneOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-switch
            v-model="dialogFrom['status']"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="readOnly">
          </el-switch>
        </el-form-item>
        <el-form-item label="公共账号" prop="public">
          <el-switch
            v-model="dialogFrom['public']"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="readOnly">
          </el-switch>
        </el-form-item>
        <el-form-item label="上锁状态" prop="lockState" v-if="readOnly">
          <el-switch
            v-model="dialogFrom['lockState']"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled>
          </el-switch>
        </el-form-item>
        <el-form-item label="ApiId" prop="pubId">
          <el-input v-model="dialogFrom['pubId']" placeholder="获取到api的key" :readonly="readOnly"></el-input>
        </el-form-item>
        <el-form-item label="Api密钥" prop="pubSecret">
          <el-input v-model="dialogFrom['pubSecret']" placeholder="获取到api的secret"  :readonly="readOnly"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogFrom.remark" :readonly="readOnly"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" v-if="!readOnly">{{addAccount ? "创 建" : "修 改"}}</el-button>
          <el-button @click="cancelFrom">{{ readOnly ? "关 闭" : "取 消" }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {popUpReminder, timestampToTimeFormat} from '@/common/js/utils';

export default {
  name: "autoTestAccount",
  data() {
    return {
      total: 0,
      tableData: [],
      filterData: {
        page: 1,
        limit: 30
      },
      readOnly: false,
      addAccount: false,
      dialogStatus: false,
      dialogTitle: "",
      dialogFrom: {uid: '', email: '', password: '', env: '', webSite: '', applicableScene: [], status: true, public: false, lockState: false, pubId: '', pubSecret: '', remark: ''},
      validationRules: {},
      applicableSceneOption: [{value: 'kyc', label: 'kyc'}, {value: 'not_kyc', label: 'not_kyc'}, {value: 'trade', label: 'trade'}, {value: 'have_sub_account', label: 'have_sub_account'}, {value: 'main_account', label: 'main_account'}]
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
     * 时间戳转字符串格式
     * @param row
     * @param column
     * @returns {String}
     */
    l_timestampToTimeFormat(row, column) {
      return timestampToTimeFormat(row[column.property], false)
    },
    /**
     * 状态滑块的外部处理函数
     * @param row
     * @param key
     * @param value
     */
    statusHandling(row, key, value) {
      // 获取缓存在本地的信息
      const adminToken = JSON.parse(localStorage.getItem("Admin-Token"));
      // update personData
      let personData = {'id': adminToken.id, 'name': adminToken.name, 'email': adminToken.email}
      console.log({'id': row['id'], [key]: value})
      const that = this;
      that.$axios.post("/pyServer/UserPool/Update", {'id': row['id'], [key]: value, 'operator': personData})
        .then(res => {

        }).catch(() => {
        console.log('更新账号信息失败!')
        popUpReminder(this, '更新账号信息失败!')
      })
    },
    /**
     * 获取账号池数据
     */
    getUserPool() {
      const that = this;
      that.$axios.post("/pyServer/Public/UserPool/Search", that.filterData)
        .then(res => {
          console.log(res.data)
          that.total = res.data.total
          that.tableData = res.data.data
        }).catch(() => {
        console.log('获取账号池失败!')
        popUpReminder(this, '获取账号池失败!')
      })
    },
    /**
     * dialog控制器
     */
    dialogController(){
      this.readOnly = false;
      this.addEnvData = true;
      this.dialogStatus = true;
      this.dialogTitle = "创建新账号"
    },
    /**
     * 变更变量
     * @param row
     */
    updateAccount(row) {
      this.getOneAccount(row.id)
      this.readOnly = false;
      this.addEnvData = false;
      this.dialogStatus = true;
      this.dialogTitle = "修改账号"
    },
    /**
     * 查看表单
     * @param row
     */
    readAccount(row) {
      this.getOneAccount(row.id)
      this.readOnly = true;
      this.addEnvData = false;
      this.dialogStatus = true;
      this.dialogTitle = "查看账号"
    },
    /**
     * 取消
     */
    cancelFrom() {
      this.dialogStatus = false;
      this.dialogFrom = {uniqueId: '', remark: '', envList: [{'key': '', 'value': ''}]}
    },
    /**
     * 获取一个账号数据, 用于查看和编辑
     * @param id
     */
    getOneAccount(id){
      const that = this;
      // that.$axios.post("/pyServer/Public/UserPool/Search", that.filterData)
      that.$axios.post("/pyServer/UserPool/Search", {'id': id}, {headers:{'X-password-decryption': true}})
        .then(res => {
          console.log(res.data)
          that.dialogFrom = res.data.data[0]
          console.log(res.data.data)
        }).catch(() => {
        console.log('获取账号池失败!')
        popUpReminder(this, '获取账号池失败!')
      })
    },
    /**
     * 提交表单
     */
    submitForm(){
      const that = this;
      const adminToken = JSON.parse(localStorage.getItem("Admin-Token"));
      let data = JSON.parse(JSON.stringify(that.dialogFrom));
      let deleteList = ['createdPerson', 'createdTime', 'lockedUser', 'updatedPerson', 'updatedTime']
      for(let index in deleteList){
        delete data[deleteList[index]]
      }
      // 判断是增加还是变更
      let url = that.addEnvData ? "/pyServer/UserPool/Create" :"/pyServer/UserPool/Update"
      data['operator'] = {'id': adminToken.id, 'name': adminToken.name, 'email': adminToken.email}
      that.$axios.post(url, data)
        .then(res => {
          console.log(res.data)
          popUpReminder(this, res.data.msg, data.email, 'teal', 'info')
          that.dialogStatus = false;
          that.getUserPool()
        }).catch(() => {
        console.log(`${that.addEnvData ? '新增': '更新'} 账号信息失败!`)
        popUpReminder(this, `${that.addEnvData ? '新增': '更新'} 账号信息失败!`)
      })
    }
  },
  created() {
    this.getUserPool()
  }
}
</script>

<style>
.el-table .warning-row {
  background: radial-gradient(oldlace, white);
}

.el-table .stripe-row {
  background: #F7F7F7;
}
</style>

