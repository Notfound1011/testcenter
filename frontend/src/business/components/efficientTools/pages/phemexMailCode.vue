<template>
  <ms-container>
    <ms-main-container>
      <el-row>
        <el-col class="form_area">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="card_header">Query Phemex Email Code</span>
            </div>
            <el-form :model="form_data" :rules="form_rule" ref="form_ref" label-width="80px" size="medium">
              <el-form-item label="Email" prop="email">
                <el-input
                  prefix-icon="el-icon-message"
                  v-model="form_data.email"
                  show-word-limit
                  placeholder="input email addreass"
                  @input="on_submit_form"
                  clearable></el-input>
              </el-form-item>
              <el-form-item size="medium">
                <el-button icon="el-icon-s-promotion" type="primary" @click="on_submit_form" :loading="loading">Query</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col class="res_area">
          <el-card class="res_card">
            <div slot="header">
              <span class="card_header">Response</span>
            </div>
            <el-table :data="res_result" :header-cell-style="table_header_style" border>
              <el-table-column prop="mail_type" label="business" width="240px" align="center"></el-table-column>
              <el-table-column prop="mail_code" label="code" width="150px" align="center"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import * as commonOperator from "@/business/components/report/emergencypublish/common"

export default {
  name: "phemexMailCode",
  components: {MsMainContainer, MsContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data () {
    return {
      form_data: {
        email: ''
      },
      form_rule: {
        email: [{ required: true, message: 'email is required.' }]
      },
      res_result: [],
      loading: false,
      table_header_style: {
        background: '#eef1f6',
        color: '#606266'
      },
      routerPath: this.$route.path.toString()
    }
  },
  created () {
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
    this.init_submit()
  },
  methods: {
    async init_submit () {
      if (this.form_data.email) {
        commonOperator.saveCrucialData(this.routerPath, this.form_data, null)
        const { data: codeRes } = await this.$axios.get('naguri/ef_api/mail_code?email=' + encodeURIComponent(this.form_data.email)).catch((error) => {
          commonOperator.messageTips('error', error)
          this.loading = false
        })
        this.res_result = codeRes
        commonOperator.saveCrucialData(this.routerPath, null, codeRes)
      }
    },
    on_submit_form () {
      this.$refs.form_ref.validate(async valid => {
        if (!valid) return
        commonOperator.saveCrucialData(this.routerPath, this.form_data, null)
        this.loading = true
        const { data: codeRes } = await this.$axios.get('naguri/ef_api/mail_code?email=' + encodeURIComponent(this.form_data.email)).catch((error) => {
          commonOperator.messageTips('error', error)
          this.loading = false
        })
        this.res_result = codeRes
        commonOperator.saveCrucialData(this.routerPath, null, codeRes)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-card__header{
  padding: 16px 18px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  font-size: 15px;
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
</style>
