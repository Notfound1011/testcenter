<template>
  <ms-container>
    <ms-main-container>
      <div style="display: flex; flex-direction: row">
        <div class="form_area">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="card_header">Get Privileges</span>
            </div>
            <el-form ref="form_ref" :model="form_data" :rules="form_rule" label-width="150px" size="medium" >
              <el-form-item label="Environment" prop="env">
                <el-radio-group v-model="form_data.env" size="medium">
                  <el-radio-button border label="fat">fat</el-radio-button>
                  <el-radio-button border label="fat2">fat2</el-radio-button>
                  <el-radio-button border label="fat3">fat3</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="SendType" prop="sendType">
                <el-radio-group v-model="form_data.sendType" size="medium">
                  <el-radio-button border label="voucher">voucher</el-radio-button>
                  <el-radio-button border label="bonus">bonus</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form_data.sendType === 'voucher'" label="Vouchers" prop="desc">
                <el-radio @change="handleSelectChange" v-model="form_data['desc']" v-for="item in voucherOptionResponse" :key="item.Id" :label="item['voucher_desc']" :value="item['voucher_desc']">
                  <span>{{ item['voucher_desc'] }}</span>
                </el-radio>
              </el-form-item>
              <el-form-item v-if="form_data.sendType === 'bonus'" label="Currency" prop="currency">
                <el-radio-group v-model="form_data.currency" size="small">
                  <el-radio-button border label="BTC">BTC</el-radio-button>
                  <el-radio-button border label="ETH">ETH</el-radio-button>
                  <el-radio-button border label="USD">USD</el-radio-button>
                  <el-radio-button border label="USDT">USDT</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="User Id" prop="users">
                <el-input @input="validateInput" v-model="form_data['users']" type="textarea" style="width: 370px" :autosize="{ minRows: 3, maxRows: 8}" placeholder="One userId per line, no other characters allowed." clearable></el-input>
              </el-form-item>
              <el-form-item size="medium">
                <el-button icon="el-icon-s-promotion" type="primary" @click="on_submit_form" :loading="loading" style="width: 70%">Get Privileges</el-button>
              </el-form-item>
            </el-form>
            <pre class="code-container">{{ res_result }}</pre>
          </el-card>
        </div>
        <div class="table-area">
          <el-table height="100%" :data="privilegesRecordResponse.results" border stripe
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    style="background: transparent;">
            <el-table-column label="env" prop="env" align="center"></el-table-column>
            <el-table-column label="userId" align="center" prop="user_id"></el-table-column>
            <el-table-column label="privilegeDesc" align="center" prop="privilege_desc"></el-table-column>
            <el-table-column label="sendTime" align="center" prop="c_time"></el-table-column>
          </el-table>
          <el-pagination background :pager-count=12 :current-page = "privilegesRecord.currentPage"
                         layout="total, prev, pager, next" :total="privilegesRecord.privilegesRecordCount"
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
        env: 'fat', users: [], sendType: "voucher", desc: "", activity_id: "", group_id: "", currency: "USDT"
      },
      form_rule: {
        env: [{ required: true, message: 'must select environment pls.' }],
        sendType: [{ required: true, message: 'must select sendType pls.' }],
        desc: [{ required: true, message: 'must select voucher pls.' }],
        currency: [{ required: true, message: 'must select currency pls.' }],
        users: [{ required: true, message: 'must input user id pls.' }],
      },
      res_result: [],
      tableData: [],
      loading: false,
      routerPath: this.$route.path.toString(),
      privilegesRecordResponse: {results: []},
      privilegesRecord: {privilegesRecordCount: 0, currentPage: 1,},
      voucherOptionResponse: []
    }
  },
  created () {
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
    this.privilegesRecord.currentPage = commonOperator.getCurrentPageNo(this.routerPath)
    this.getPrivilegesRecord(this.privilegesRecord.currentPage)
    this.getVoucherOption()
    this.validateInput()
  },
  methods: {
    validateInput() {
      this.form_data.users = this.form_data.users.replace(/[^0-9\n]/g, "");
    },
    handleCurrentChange (val) {
      commonOperator.setCurrentPageNo(this.routerPath, val)
      this.getPrivilegesRecord(val)
    },
    handleSelectChange() {
      const selectedOption = this.voucherOptionResponse.find((option) => option['voucher_desc'] === this.form_data['desc']);
      if (selectedOption) {
        this.form_data.activity_id = selectedOption.activity_id;
        this.form_data.group_id = selectedOption.group_id;
      }
      console.log(this.form_data)
    },
    async getPrivilegesRecord (page=1, pageSize=30) {
      const loading = fullScreenLoading(this, 'loading...');
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        'naguri/ef_api/privileges_record?page='+page+'&page_size='+pageSize,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      }).finally(() => {
        stopFullScreenLoading(loading,1);
        this.loading = false
      });
      this.privilegesRecordResponse = apiResponse['data']
      this.privilegesRecord.privilegesRecordCount = apiResponse['data']['count']
    },
    async getVoucherOption () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        'naguri/ef_api/voucher_option',
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      this.voucherOptionResponse = apiResponse
      this.form_data.desc = apiResponse[0]['voucher_desc']
      this.handleSelectChange()
    },
    // 执行请求发送
    on_submit_form () {
      this.$refs.form_ref.validate(async valid => {
        if (!valid) return
        commonOperator.saveCrucialData(this.routerPath, this.form_data, null)
        this.form_data['user_id'] = this.form_data.users.split('\n');
        this.loading = true
        console.log(this.form_data)
        const headers = commonOperator.parseNaguriHeader()
        const { data: res } = await this.$axios.post(
          `naguri/ef_api/privilege_import/${this.form_data.sendType}`, this.form_data,
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
        this.loading = false
        commonOperator.messageTips('success', 'response is success.')
        const currentPageNo = commonOperator.getCurrentPageNo(this.routerPath)
        await this.getPrivilegesRecord(currentPageNo);
      })
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
  width: 550px;
}
.table-area{
  height: calc(90vh - 70px);
  padding-top: 20px;
  margin-left: 20px;
  flex: 2;
}
.el-input{
  width: 80%;
}
.el-form{
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
