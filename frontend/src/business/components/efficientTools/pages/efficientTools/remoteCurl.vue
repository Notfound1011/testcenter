<template>
  <ms-container>
    <ms-main-container>
      <div class='naguri_container'>
        <div class="form_area">
          <el-card>
            <div slot="header">
              <span class="card_header">Send Remote Curl</span>
            </div>
            <div class="card_body">
              <el-form ref="form_ref" :model="form_data" :rules="form_rule" label-width="150px" size="medium" style="margin-left: -25px">
                <el-form-item label="Environment" prop="curl_env">
                  <el-radio-group v-model="form_data.curl_env" size="medium" @change="getCurlServerChange">
                    <el-radio-button border label="fat">fat</el-radio-button>
                    <el-radio-button border label="fat2">fat2</el-radio-button>
                    <el-radio-button border label="fat3">fat3</el-radio-button>
                    <el-radio-button border label="dev">dev</el-radio-button>
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
                    <el-select style="width: 70%;font-weight: bold;" v-model="form_data['curl_server']" :multiple=false filterable placeholder="select curl server name.">
                      <el-option v-for="item in curlServerData" :key="item['id']" :label="item['server_name']" :value="item['server_name']">
                        <span>{{ item['server_name'] }}</span>
                      </el-option>
                    </el-select>
                    <el-tooltip content="Contact Qa Team To Add a New Environment Server." placement="top">
                      <a class="server-link" href="#" target="_blank" @click="openLink">+</a>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <el-form-item label="Curl Path" prop="curl_path">
                  <el-input style="width: 90%" v-model="form_data['curl_path']" placeholder="input curl path."></el-input>
                </el-form-item>
                <el-form-item label="Curl Headers" prop="curl_headers">
                  <el-input style="width: 90%" v-model="form_data['curl_headers']" placeholder="input curl headers if you need."></el-input>
                </el-form-item>
                <el-form-item label="Curl Params" prop="curl_params">
                  <el-input style="width: 90%" v-model="form_data['curl_params']" placeholder="input curl params."></el-input>
                </el-form-item>
                <el-form-item label="Curl Body" prop="curl_body">
                  <el-input style="width: 90%" v-model="form_data['curl_body']" placeholder="input curl body."></el-input>
                </el-form-item>
                <div style="display: flex;justify-content: center">
                  <el-button icon="el-icon-star-off" type="warning" :loading="loadings.formSave" style="width: 20%"
                             @click="onSubmitForm('save', null, false, 'formSave')">Save</el-button>
                  <el-button icon="el-icon-s-promotion" type="primary" :loading="loadings.formSend" style="width: 40%"
                             @click="onSubmitForm('send', null, false, 'formSend')">Send Curl</el-button>
                </div>
                <div></div>
              </el-form>
              <pre class="code-container">{{ res_result }}</pre>
            </div>
          </el-card>
        </div>
        <div class="table-area">
          <el-table height="100%" :data="curlAssembleResponse.results"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                    style="background: transparent;">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form labelPosition="right" label-width="120px" ref="form_ref_extend" :model="scope.row" :rules="form_rule" inline class="demo-table-expand" >
                  <el-form-item label="Curl Target">
                    <el-tag effect="plain" :type="commonOperator.tagStyle(scope.row['curl_method'])" size="mini" style="margin: 2px" class="cusFont">
                      {{ scope.row['curl_method'] | uppercase }}
                    </el-tag>
                    <span class="cusFont"> http://<span style="color: #FF6C37;font-style: italic;" v-text="'{{'+scope.row['curl_server']+'}}'"></span>{{ scope.row['curl_path'] }}</span>
                  </el-form-item>
                  <el-form-item label="Support Envs">
                    <el-select size="small" v-model="scope.row['curl_env']" :multiple=false placeholder="select support curl env.">
                      <el-option v-for="env in scope.row['support_envs']" :key="env" :label="scope.row['curl_env']" :value="env">
                        <span>{{ env }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Curl Desc">
                    <el-input :disabled="!scope.row['is_creator']" size="small" type="textarea" autosize v-model="scope.row['curl_name']" placeholder="input curl desc."></el-input>
                  </el-form-item>
                  <el-form-item label="Curl Headers">
                    <el-input size="small" type="textarea" autosize v-model="scope.row['curl_headers']" placeholder="input curl headers if you need."></el-input>
                  </el-form-item>
                  <el-form-item label="Curl Params">
                    <el-input size="small" type="textarea" autosize v-model="scope.row['curl_params']" placeholder="input curl params."></el-input>
                  </el-form-item>
                  <el-form-item label="Curl Body">
                    <el-input size="small" type="textarea" autosize v-model="scope.row['curl_body']" placeholder="input curl body."></el-input>
                  </el-form-item>
                  <el-form-item v-if="scope.row['is_creator']" label="Share Curl">
                    <el-switch v-model="scope.row['curl_share']" active-text="Yes" inactive-text="No"></el-switch>
                  </el-form-item>
                  <el-form-item v-if="!scope.row['is_creator']" label="Shared by">
                    <span style="text-decoration: underline;font-weight: bold"> @{{ scope.row['curl_creator'] }}</span>
                  </el-form-item>
                  <div class="extendBtn" v-if="!scope.row['is_creator']">
                    <el-button size="mini" type="success" :loading="loadings.rowSend"
                               @click="onSubmitForm('send', scope.row, true, 'rowSend')">Send Curl</el-button>
                  </div>
                  <div class="extendBtn" v-if="scope.row['is_creator']">
                    <el-button size="mini" type="success" :loading="loadings.rowSend"
                               @click="onSubmitForm('send', scope.row, true, 'rowSend')">Send Curl</el-button>
                    <el-button size="mini" type="warning" :loading="loadings.rowSave"
                               @click="onSubmitForm('save', scope.row, true, 'rowSave')">Apply Edit</el-button>
                    <template>
                      <el-popconfirm
                        title="Are you sure to delete this curl?"
                        confirm-button-text='Confirm' cancel-button-text='Cancel'
                        icon="el-icon-info" icon-color="red"
                        confirm-button-type="danger" cancel-button-type="info"
                        @confirm="deleteCurl(scope.row['curl_id'])">
                        <el-button style="margin-left: 10px" slot="reference" size="mini" type="danger" icon="el-icon-delete"></el-button>
                      </el-popconfirm>
                    </template>
                  </div>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="Curl Desc" align="left" width="270">
              <template slot-scope="scope">
                <el-tag v-if="scope.row['curl_share']" effect="plain" size="mini" style="margin: 2px;color: #6FA9E1;border-color: #6FA9E1;" >Share</el-tag>
                <span class="cusFont">{{ scope.row['curl_name'] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Curl Preview" align="left">
              <template slot-scope="scope">
                <el-tag effect="plain" :type="commonOperator.tagStyle(scope.row['curl_method'])" size="mini" style="margin: 2px;" class="cusFont">
                  {{ scope.row['curl_method'] | uppercase }}
                </el-tag>
                <span class="cusFont"> {{ scope.row['curl_path'] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Send" align="center" width="95">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-s-promotion" :loading="loadings.rowSend" size="medium"
                           @click="onSubmitForm('send', scope.row, true, 'rowSend')" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background :pager-count=12 :current-page = "curlAssemblePage.currentPage"
                         layout="total, prev, pager, next" :total="curlAssemblePage.curlAssembleCount"
                         @current-change="handleCurrentChange" :page-size=20></el-pagination>
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
  name: "remoteCurl",
  components: {MsMainContainer, MsContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  filters: {
    uppercase(value) {
      return value.toUpperCase();
    }
  },
  data () {
    return {
      form_data: {
        curl_env: 'fat', curl_server: '', curl_method: 'post', curl_share: false,
        curl_headers: '', curl_path: '', curl_params: '', curl_body: ''
      },
      form_rule: {
        curl_env: [{ required: true, message: 'must select environment pls.' }],
        curl_server: [{ required: true, message: 'must select curl server pls.' }],
        curl_method: [{ required: true, message: 'must select curl method pls.' }],
        curl_path: [
          { required: true, message: 'must select curl path pls.' },
          { validator: this.validateLinks, trigger: 'blur' }
        ],
      },
      res_result: {}, deleteRes: {}, curlServerData: [],
      loadings: {formSave: false, formSend: false, rowSave: false, rowSend: false},
      table_header_style: {background: '#eef1f6', color: '#606266'},
      routerPath: this.$route.path.toString(),
      curlAssembleResponse: {results: []},
      curlAssemblePage: {curlAssembleCount: 0, currentPage: 1,},
      commonOperator: commonOperator
    }
  },
  created () {
    this.getCurlServerChange('init')
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
    this.getCurlAssemble()
  },
  methods: {
    openLink() {
      window.open('https://cmexpro.slack.com/archives/D03F106JQ80', '_blank');
    },
    async deleteCurl(curlId) {
      const headers = commonOperator.parseNaguriHeader()
      const { data: deleteRes } = await this.$axios.delete(
        'naguri/ef_api/curl_assemble?curl_id='+curlId,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      this.deleteRes = deleteRes
      await commonOperator.sleep(300);
      await this.getCurlAssemble(1, 20)
      commonOperator.notificationTips('success', "response is success.")
    },
    handleCurrentChange (val) {
      this.getCurlAssemble(val)
    },
    validateLinks(rule, value, callback) {
      const link = value;
      if (link.trim() !== '' && (link.trim().startsWith('http') || link.includes('?') || link.includes('='))) {
        return callback(new Error('Only path allowed.'));
      }
      callback();
    },
    async getCurlAssemble (page=1, pageSize=20) {
      const loading = fullScreenLoading(this, 'loading...');
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        'naguri/ef_api/curl_assemble?page='+page+'&page_size='+pageSize,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      }).finally(() => {
        stopFullScreenLoading(loading,1);
        this.loading = false
      });
      this.curlAssembleResponse = apiResponse
      this.curlAssemblePage.curlAssembleCount = apiResponse['count']
    },
    async getCurlServerChange (type) {
      const headers = commonOperator.parseNaguriHeader()
      let localCurlEnv = this.form_data.curl_env
      if (type === 'init') {
        const localEnv = window.localStorage.getItem(this.routerPath + '#curl_env')
        localCurlEnv = localEnv ? localEnv : this.form_data.curl_env;
      }
      const { data: res } = await this.$axios.get(
        'naguri/ef_api/remote_curl?env=' + localCurlEnv,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      const localCurlServer = window.localStorage.getItem(this.routerPath + '#curl_server') || this.form_data.curl_server
      const serverExists = res.data.some(item => item['server_name'] === localCurlServer);
      if (serverExists) {
        this.form_data.curl_server = localCurlServer
      } else {
        this.form_data.curl_server = ''
      }
      this.curlServerData = res['data']
    },
    async performSubmit(actionType, formDataOverride) {
      console.log(actionType)
      const formData = formDataOverride || this.form_data;
      if (formDataOverride == null) {
        commonOperator.saveCrucialData(this.routerPath, formData, null);
      }
      const headers = commonOperator.parseNaguriHeader();
      try {
        const response = await this.$axios.post(
          `naguri/ef_api/remote_curl?curl_type=${actionType}`, formData,
          { headers, timeout: 5000 }
        );
        const res = response.data;
        this.res_result = res;
        commonOperator.saveCrucialData(this.routerPath, null, res);
        if (actionType === 'save' && formDataOverride == null) {
          await commonOperator.sleep(300);
          await this.getCurlAssemble(1, 20)
        }
      } catch (error) {
        commonOperator.messageTips('error', error);
      }
    },
    onSubmitForm(actionType, formDataOverride = null, skipValidation = false, buttonName = '') {
      this[buttonName] = true
      if (!skipValidation) {
        this.$refs.form_ref.validate(async (valid) => {
          if (!valid) return;
          await this.performSubmit(actionType, formDataOverride);
          commonOperator.messageTips('success', `${actionType} ${this.form_data.curl_path} is success.`);
        });
      } else {
        this.performSubmit(actionType, formDataOverride);
        commonOperator.messageTips('success', `${actionType} ${formDataOverride['curl_path']} is success.`)
      }
      this[buttonName] = false
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
.naguri_container {
  display: flex;
  height: calc(98vh - 80px);
}
.form_area{
  padding-top: 20px;
  width: 450px;
  min-width: 450px;
  flex: 1;
}
.card_header{
  font-weight: bold;
}
.card_body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: calc(80vh - 85px);
}
.table-area{
  height: calc(90vh - 70px);
  padding-top: 20px;
  margin-left: 20px;
  flex: 3;
  min-width: 300px;
}
.el-pagination {
  margin-top: 10px;
}
.server-container {
  display: flex;
  align-items: center;
}
.server-link {
  margin-left: 10px;
  font-size: 20px;
  text-decoration: none;
  color: #087cec;
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
.el-form{
  margin-top: 10px;
}
.demo-table-expand {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 50px !important;
  .el-form-item {
    margin-top: 10px;
    width: 95%;
    .el-textarea {
      width: 400px;
    }
  }
  .extendBtn {
    display: flex;
    margin-left: 120px;
    margin-top: 10px
  }
}
.cusFont{
  font-size: 14px;
  font-weight: 500
}
</style>
