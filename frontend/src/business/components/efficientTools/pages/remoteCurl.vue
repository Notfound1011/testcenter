<template>
  <ms-container>
    <ms-main-container>
      <el-row>
        <el-col class="form_area">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="card_header">Send Remote Curl</span>
            </div>
            <el-form ref="form_ref" :model="form_data" :rules="form_rule" label-width="150px" size="medium" >
              <el-form-item label="Environment" prop="curl_env">
                <el-radio-group v-model="form_data.curl_env" size="medium" @change="get_curl_server_change">
                  <el-radio-button border label="fat">fat</el-radio-button>
                  <el-radio-button border label="fat2">fat2</el-radio-button>
                  <el-radio-button border label="fat3">fat3</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Curl Method" prop="curl_method">
                <el-radio-group v-model="form_data.curl_method" size="small">
                  <el-radio-button border label="get">GET</el-radio-button>
                  <el-radio-button border label="post">POST</el-radio-button>
                  <el-radio-button border label="put">PUT</el-radio-button>
                  <el-radio-button border label="delete">DELETE</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Curl Server" prop="curl_server">
                <div class="server-container">
                  <el-select
                    class="inline-input"
                    v-model="form_data['curl_server']"
                    :multiple=false
                    filterable
                    clearable
                    placeholder="select curl server name.">
                    <el-option
                      v-for="item in curlServerData"
                      :key="item['id']"
                      :label="item['server_name']"
                      :value="item['server_name']">
                      <span>{{ item['server_name'] }}</span>
                    </el-option>
                  </el-select>
                  <el-tooltip content="Add a new server" placement="top">
                    <a class="server-link" href="#" target="_blank" @click="openLink">+</a>
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="Curl Path" prop="curl_path">
                <el-input v-model="form_data['curl_path']" placeholder="input curl path." clearable></el-input>
              </el-form-item>
              <el-form-item label="Curl Headers" prop="curl_headers">
                <el-input v-model="form_data['curl_headers']" placeholder="input curl headers if you need." clearable></el-input>
              </el-form-item>
              <el-form-item label="Curl Params" prop="curl_params">
                <el-input v-model="form_data['curl_params']" placeholder="input curl params." clearable></el-input>
              </el-form-item>
              <el-form-item label="Curl Body" prop="curl_body">
                <el-input type="textarea" v-model="form_data['curl_body']" placeholder="input curl body." clearable></el-input>
              </el-form-item>
              <el-form-item size="medium">
                <el-button icon="el-icon-s-promotion" type="primary" @click="on_submit_form" :loading="loading">Send Curl</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col class="res_area">
          <el-card class="res_card">
            <div slot="header">
              <span class="card_header">Response</span>
            </div>
            <pre class="box">{{ res_result }}</pre>
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
  name: "remoteCurl",
  components: {MsMainContainer, MsContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data () {
    return {
      form_data: {
        curl_env: 'fat', curl_server: '', curl_method: 'post',
        curl_headers: '', curl_path: '', curl_params: '', curl_body: ''
      },
      form_rule: {
        curl_env: [{ required: true, message: 'must select environment pls.' }],
        curl_server: [{ required: true, message: 'must select curl server pls.' }],
        curl_method: [{ required: true, message: 'must select curl method pls.' }],
        curl_path: [{ required: true, message: 'must select curl path pls.' }],
      },
      res_result: {},
      curlServerData: [],
      loading: false,
      table_header_style: {
        background: '#eef1f6',
        color: '#606266'
      },
      routerPath: this.$route.path.toString(),
    }
  },
  created () {
    this.get_curl_server_change('init')
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
  },
  methods: {
    openLink() {
      window.open('http://3.1.250.199:7001/admin/#/admin/efficient_tools/effremotecurlserver/', '_blank');
    },
    // 获取curl server
    async get_curl_server_change (type) {
      const headers = commonOperator.getNaguriSignature()
      let local_curl_env = this.form_data.curl_env
      if (type === 'init') {
        const local_env = window.localStorage.getItem(this.routerPath + '#curl_env')
        local_curl_env = local_env ? local_env : this.form_data.curl_env;
      }
      const { data: res } = await this.$axios.get(
        'naguri/ef_api/remote_curl?env=' + local_curl_env,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      const local_curl_server = window.localStorage.getItem(this.routerPath + '#curl_server')
      const serverExists = res.data.some(item => item['server_name'] === local_curl_server);
      if (serverExists) {
        this.form_data.curl_server = local_curl_server
      } else {
        this.form_data.curl_server = ''
      }
      this.curlServerData = res['data']
    },
    // 执行请求发送
    on_submit_form () {
      this.$refs.form_ref.validate(async valid => {
        commonOperator.saveCrucialData(this.routerPath, this.form_data, null)
        if (!valid) return
        this.loading = true
        const headers = commonOperator.getNaguriSignature()
        const { data: res } = await this.$axios.post(
          'naguri/ef_api/remote_curl', this.form_data,
          {headers, timeout: 5000}
        ).catch((error) => {
          commonOperator.notificationTips('error', error)
          this.loading = false
        })
        this.res_result = res
        commonOperator.saveCrucialData(this.routerPath, null, res)
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
.naguri_container {
  display: flex;
}
.form_area{
  padding-top: 20px;
  width: 500px;
  min-width: 500px;
  margin-left: 20px;
  height: 100%;
}
.table-col{
  width: 80%;
  min-width: 500px;
  padding-top: 20px;
  margin-left: 20px;
  height: 800px;
}
.table-area {
  overflow: scroll;
}
.res_area{
  padding-top: 20px;
  width: 430px;
  min-width: 430px;
  margin-left: 20px;
}
.res_card .box {
  min-height: 60vh;
  height: 60px;
  overflow: scroll;
}
.card_header{
  font-weight: bold;
}
.el-select{
  width: 80%;
}
.el-input{
  width: 80%;
}
.server-container {
  display: flex;
  align-items: center;
}
.server-link {
  margin-left: 10px;
  font-size: 20px;
  text-decoration: none;
  color: #409eff; /* or any other color you prefer */
}
.code-container {
  background-color: #3a3737;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  padding: 10px;
  border-radius: 5px;
  overflow: scroll;
}
.code {
  display: inline-block;
  margin-left: 5px;
}

</style>

