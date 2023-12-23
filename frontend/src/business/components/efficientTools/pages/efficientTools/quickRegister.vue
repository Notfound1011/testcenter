<template>
  <ms-container>
    <ms-main-container>
      <div style="display: flex; flex-direction: row">
        <div class="form_area">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="card_header">Quick Registration</span>
            </div>
            <el-form ref="form_ref" :model="form_data" :rules="form_rule" label-width="150px" size="medium" class="out-form">
              <el-form-item label="Environment" prop="env">
                <el-radio-group v-model="form_data.env" size="medium">
                  <el-radio-button border label="fat">fat</el-radio-button>
                  <el-radio-button border label="fat2">fat2</el-radio-button>
                  <el-radio-button border label="fat3">fat3</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Phemex Site" prop="site">
                <el-radio-group v-model="form_data.site" size="small">
                  <el-radio-button border label="GL">PhemexGL</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Mail Prefix" prop="mail_prefix">
                <el-input v-model="form_data['mail_prefix']" placeholder="input your phemex mail prefix" clearable></el-input>
              </el-form-item>
              <el-form-item label="Mail Suffix" prop="mail_suffix">
                <el-radio-group v-model="form_data.mail_suffix" size="small">
                  <el-tooltip content="mail prefix need input full mail address." placement="top">
                    <el-radio-button border label="custom">Custom</el-radio-button>
                  </el-tooltip>
                  <el-radio-button border label="cmexpro">@cmexpro.com</el-radio-button>
                  <el-radio-button border label="phemex">@phemex.com</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Password" prop="password">
                <el-input v-model="form_data['password']" placeholder="default 123qweasD@" clearable></el-input>
              </el-form-item>
              <el-form-item label="Referral" prop="referral">
                <el-input v-model="form_data['referral']" placeholder="referral code if you need" clearable></el-input>
              </el-form-item>
              <el-form-item label="Group" prop="group">
                <el-input v-model="form_data['group']" placeholder="referral group code if you need" clearable></el-input>
              </el-form-item>
              <el-form-item label="Remark" prop="remark">
                <el-input v-model="form_data['remark']" placeholder="for account remark if you need." clearable></el-input>
              </el-form-item>
              <el-form-item size="medium">
                <el-button icon="el-icon-s-promotion" type="primary" @click="on_submit_form" :loading="loading" style="width: 70%">do registration</el-button>
              </el-form-item>
            </el-form>
            <div></div>
            <pre class="code-container">{{ res_result }}</pre>
          </el-card>
        </div>
        <div class="table-area">
          <el-table height="100%" :data="testUserDataResponse.results" border stripe
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    style="background: transparent;">
            <el-table-column label="userInfo" align="center" prop="user_id" width="155">
              <template slot-scope="scope">
                {{ scope.row['user_id'] }} # {{ scope.row['user_referral'] }}
              </template>
            </el-table-column>
            <el-table-column label="Account Email" align="center" prop="email"></el-table-column>
            <el-table-column label="Password" align="center" prop="pass_word" width="150"></el-table-column>
            <el-table-column label="Referral By" align="center" prop="referral" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row['referral'] === null || scope.row['referral'] === ''">--</span>
                <span v-else>{{ scope.row['referral'] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Remark" prop="remark">
              <template slot-scope="scope">
                {{ scope.row['env'] }} {{ scope.row['remark'] }}
              </template>
            </el-table-column>
            <el-table-column label="CreateAt" align="center" prop="c_time" width="170"></el-table-column>
            <el-table-column label="Action" prop="action" width="80" align="center">
              <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="editRow(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 编辑对话框 -->
          <el-dialog :visible.sync="editDialogVisible" title="Edit User Data" @close="cancelEdit" width="65%">
            <el-form :model="editedRow" size="medium" label-position="right">
              <el-row>
                <el-col :span="12" v-for="(value, key) in editedRow" :key="key">
                  <el-form-item style="text-align: right; padding-right: 10px;" :prop="key">
                    <span style="font-weight: bold; margin:10px">{{ key }}</span>
                    <el-input :disabled="shouldDisableField(key)" v-model="editedRow[key]"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelEdit">Cancel</el-button>
              <el-button type="primary" @click="saveEdit">Save</el-button>
            </div>
          </el-dialog>
          <!-- 编辑对话框 -->
          <el-pagination background :pager-count=12 :current-page = "testUserDataPage.currentPage"
                         layout="total, prev, pager, next" :total="testUserDataPage.testUserDataCount"
                         @current-change="handleCurrentChange" :page-size=40 style="margin-top: 5px"></el-pagination>
        </div>
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import * as commonOperator from "@/common/naguri/naguri";
import {fullScreenLoading, stopFullScreenLoading} from "@/common/js/utils";

export default {
  name: "quickRegister.vue",
  computed: {
    commonOperator() {
      return commonOperator
    }
  },
  components: {MsMainContainer, MsContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data () {
    return {
      form_data: {
        env: 'fat', site: 'GL', mail_prefix: '', mail_suffix: 'cmexpro',
        group: null, referral: null, password: null, remark: ""
      },
      form_rule: {
        env: [{ required: true, message: 'must select environment pls.' }],
        site: [{ required: true, message: 'must select phemex site pls.' }],
        mail_prefix: [{ required: true, message: 'must input your phemex mail prefix pls.' }],
        mail_suffix: [{ required: true, message: 'must select your phemex mail suffix pls.' }],
      },
      res_result: [],
      tableData: [],
      loading: false,
      table_header_style: {
        background: '#eef1f6',
        color: '#606266'
      },
      routerPath: this.$route.path.toString(),
      testUserDataResponse: {results: []},
      testUserDataPage: {testUserDataCount: 0, currentPage: 1,},
      editDialogVisible: false,
      editedRow: {}
    }
  },
  created () {
    this.getCurrentUserMailPrefix()
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
    this.form_data.remark = ""
    this.generateTableData()
    this.testUserDataPage.currentPage = commonOperator.getCurrentPageNo(this.routerPath)
    this.getRegisterTestUsers(this.testUserDataPage.currentPage)
  },
  methods: {
    shouldDisableField(key) {
      return ![
        'remark', 'user_otp', 'api_key', 'api_sec', 'pass_word'
      ].includes(key);
    },
    editRow(row) {
      this.editedRow = { ...row };
      this.editDialogVisible = true;
    },
    cancelEdit() {
      this.editDialogVisible = false;
    },
    // 获取当前人邮箱前缀
    getCurrentUserMailPrefix() {
      const local_mail = JSON.parse(window.localStorage.getItem('Admin-Token'))['email']
      const parts = local_mail.split('@');
      this.form_data.mail_prefix = parts[0]
      const suffix = parts[1].split('.')
      this.form_data.mail_suffix = suffix[0]
    },
    // 绘制请求结果table
    generateTableData() {
      this.tableData = Object.keys(this.res_result).map(key => {
        return { key, value: this.res_result[key] };
      });
    },
    handleCurrentChange (val) {
      commonOperator.setCurrentPageNo(this.routerPath, val)
      this.getRegisterTestUsers(val)
    },
    // 执行请求发送
    on_submit_form () {
      this.$refs.form_ref.validate(async valid => {
        commonOperator.saveCrucialData(this.routerPath, this.form_data, null)
        if (!valid) return
        this.loading = true
        const headers = commonOperator.parseNaguriHeader()
        const { data: res } = await this.$axios.post(
          'naguri/ef_api/quick_register', this.form_data,
          {headers, timeout: 5000}
        ).catch((error) => {
          if (error.response.data['error']) {
            commonOperator.messageTips('error', error.response.data['error']);
          } else {
            commonOperator.messageTips('error', 'error');
          }
          this.loading = false
        })
        this.res_result = res
        commonOperator.saveCrucialData(this.routerPath, null, res)
        this.generateTableData()
        this.loading = false
        commonOperator.messageTips('success', 'response is success.')
        const currentPageNo = commonOperator.getCurrentPageNo(this.routerPath)
        await this.getRegisterTestUsers(currentPageNo);
      })
    },
    async getRegisterTestUsers (page=1, pageSize=30) {
      const loading = fullScreenLoading(this, 'loading...');
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        'naguri/ef_api/quick_register?page='+page+'&page_size='+pageSize,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      }).finally(() => {
        stopFullScreenLoading(loading,1);
        this.loading = false
      });
      this.testUserDataResponse = apiResponse
      this.testUserDataPage.testUserDataCount = apiResponse['count']
    },
    async saveEdit() {
      const loading = fullScreenLoading(this, 'loading...');
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.put(
        'naguri/ef_api/quick_register', this.editedRow,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      }).finally(() => {
        stopFullScreenLoading(loading,1);
        this.loading = false
      });
      const currentPageNo = commonOperator.getCurrentPageNo(this.routerPath)
      await this.getRegisterTestUsers(currentPageNo)
      this.editDialogVisible = false;
    },
  }
}
</script>

<style lang="less" scoped>
/deep/.el-form-item__label {
  font-weight: bold;
}
/deep/.el-card__header{
  padding: 16px 18px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  font-size: 15px;
}
/deep/.el-card__body {
  padding: 6px 10px;
  min-height: 330px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.card_header{
  font-weight: bold;
}
.form_area{
  padding-top: 20px;
  min-width: 450px;
  flex: 1;
}
.table-area{
  height: calc(90vh - 70px);
  padding-top: 20px;
  margin-left: 20px;
  flex: 3;
  min-width: 300px;
}
.el-input{
  width: 80%;
}
.out-form{
  margin: 10px 0 0 -40px;
}
.code-container {
  flex: 1;
  background-color: #242a2e;
  color: #ffffff;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 14px;
  padding: 10px;
  border-radius: 10px;
  overflow: auto;
  max-height: calc(39vh - 100px) !important
}
</style>
