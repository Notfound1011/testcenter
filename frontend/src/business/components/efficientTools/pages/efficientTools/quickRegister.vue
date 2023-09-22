<template>
  <ms-container>
    <ms-main-container>
      <el-row>
        <el-col class="form_area">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="card_header">Quickly Register</span>
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
                    <el-radio-button border label="custom">CustomSuffix</el-radio-button>
                  </el-tooltip>
                  <el-radio-button border label="cmexpro">@cmexpro.com</el-radio-button>
                  <el-radio-button border label="phemex">@phemex.com</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Referral" prop="referral">
                <el-input v-model="form_data['referral']" placeholder="referral code if you need" clearable></el-input>
              </el-form-item>
              <el-form-item label="Group" prop="group">
                <el-input v-model="form_data['group']" placeholder="referral group code if you need" clearable></el-input>
              </el-form-item>
              <el-form-item size="medium">
                <el-button icon="el-icon-s-promotion" type="primary" @click="on_submit_form" :loading="loading">do register</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col class="res_area">
          <el-card class="res_card">
            <div slot="header">
              <span class="card_header">Response</span>
            </div>
            <el-table :data="tableData" :show-header="false" border>
              <el-table-column width="100px" prop="key"></el-table-column>
              <el-table-column prop="value"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import * as commonOperator from "@/business/components/report/emergencypublish/common";

export default {
  name: "quickRegister.vue",
  components: {MsMainContainer, MsContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data () {
    return {
      form_data: {
        env: 'fat',site: 'GL', mail_prefix: '', mail_suffix: 'cmexpro', group: '', referral: ''
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
      routerPath: this.$route.path.toString()
    }
  },
  created () {
    this.getCurrentUserMailPrefix()
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
    this.generateTableData()
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
          commonOperator.messageTips('error', error)
          this.loading = false
        })
        this.res_result = res
        commonOperator.saveCrucialData(this.routerPath, null, res)
        this.generateTableData()
        this.loading = false
        commonOperator.messageTips('success', 'response is success.')
      })
    }
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
.res_card .box {
  min-height: 60vh;
  height: 60px;
  overflow: scroll;
}
.card_header{
  font-weight: bold;
}
.form_area{
  padding-top: 20px;
  width: 550px;
  min-width: 550px;
}
.res_area{
  padding-top: 20px;
  width: 430px;
  min-width: 430px;
  margin-left: 20px;
}
.el-input{
  width: 80%;
}
.el-form{
  margin-top: 10px;
}
</style>
