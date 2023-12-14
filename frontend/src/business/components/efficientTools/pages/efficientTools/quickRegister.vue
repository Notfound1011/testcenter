<template>
  <ms-container>
    <ms-main-container>
      <div style="display: flex; flex-direction: row">
        <div class="form_area">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="card_header">Quick Registration</span>
            </div>
            <el-form ref="form_ref" :model="form_data" :rules="form_rule" label-width="150px" size="medium" >
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
                <el-button icon="el-icon-s-promotion" type="primary" @click="on_submit_form" :loading="loading" style="width: 70%">do register</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card style="margin-top: 10px">
            <div slot="header">
              <span class="card_header">Response</span>
            </div>
            <el-table :data="tableData" :show-header="false" border>
              <el-table-column width="100px" prop="key"></el-table-column>
              <el-table-column prop="value"></el-table-column>
            </el-table>
          </el-card>
        </div>
        <div class="table-area">
          <el-table height="100%" :data="testUserDataResponse.results" border stripe
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    style="background: transparent;">
            <el-table-column label="Env" prop="env" width="60"></el-table-column>
            <el-table-column label="UserId" align="center" prop="user_id" width="100"></el-table-column>
            <!-- <el-table-column label="Given Prefix" align="center" prop="mail_prefix" width="270"></el-table-column> -->
            <el-table-column label="Account Email" align="center" prop="email" width="330"></el-table-column>
            <el-table-column label="Referral" align="center" prop="user_referral" width="100"></el-table-column>
            <el-table-column label="Password" align="center" prop="pass_word" width="150"></el-table-column>
            <el-table-column label="Group" align="center" prop="group" width="70"></el-table-column>
            <el-table-column label="Referral By" align="center" prop="referral" width="100"></el-table-column>
            <el-table-column label="Remark" prop="remark"></el-table-column>
          </el-table>
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
    }
  },
  created () {
    this.getCurrentUserMailPrefix()
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
    this.form_data.remark = ""
    this.generateTableData()
    this.getRegisterTestUsers()
  },
  methods: {
    // 获取当前人邮箱前缀
    getCurrentUserMailPrefix() {
      const local_mail = JSON.parse(window.localStorage.getItem('Admin-Token'))['email']
      const parts = local_mail.split('@');
      this.form_data.mail_prefix = parts[0]
      const suffix = parts[1].split('.')
      this.form_data.mail_suffix = suffix[0]
      console.log(suffix[0])
    },
    // 绘制请求结果table
    generateTableData() {
      this.tableData = Object.keys(this.res_result).map(key => {
        return { key, value: this.res_result[key] };
      });
    },
    handleCurrentChange (val) {
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
        await this.getRegisterTestUsers(1,30);
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
.el-form{
  margin: 10px 0 0 -40px;
}
</style>
