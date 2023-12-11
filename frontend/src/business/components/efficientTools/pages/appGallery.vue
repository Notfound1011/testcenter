<template>
  <ms-container>
    <ms-main-container>
      <el-radio-group v-model="form_data.channel" size="small" @change="changePage">
        <el-radio-button border label="ALL">ALL</el-radio-button>
        <el-radio-button border label="iOS">iOS</el-radio-button>
        <el-radio-button border label="Android">Android</el-radio-button>
      </el-radio-group>
      <div class="table-area">
        <el-table height="100%" :data="privilegesRecordResponse.results" border stripe
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  :style="{ height: tableHeight }"
                  style="background: transparent;">
          <el-table-column label="Channel" prop="channel" align="center">
            <template slot-scope="scope">
              <span style="font-weight: bold">{{scope.row['channel']}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Build Time" prop="build_time" align="center"></el-table-column>
          <el-table-column label="Version Desc" prop="version_desc" align="center" width="300"></el-table-column>
          <el-table-column v-if="['iOS', 'ALL'].includes(this.form_data.channel)" label="iPA" prop="ipa_image_url" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row['ipa_image_url'] !== null && scope.row['ipa_image_url'] !== ''">
                <el-popover placement="left" width="200" trigger="hover">
                  <img :src="scope.row['ipa_image_url']" alt="QR Code" style="max-width: 100%; max-height: 100%;">
                  <el-button style="font-weight: bold" type="text" size="mini" icon="el-icon-view" slot="reference">View QR Code</el-button>
                </el-popover>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column v-if="['Android', 'ALL'].includes(this.form_data.channel)" label="Apk" prop="apk_image_url" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row['apk_image_url'] !== null && scope.row['apk_image_url'] !== ''">
                <el-popover placement="left" width="200" trigger="hover">
                  <img :src="scope.row['apk_image_url']" alt="QR Code" style="max-width: 100%; max-height: 100%;">
                  <el-button style="font-weight: bold" type="text" size="mini" icon="el-icon-view" slot="reference">View QR Code</el-button>
                </el-popover>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column v-if="['Android', 'ALL'].includes(this.form_data.channel)" label="Aab" prop="abb_image_url" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row['abb_image_url'] !== null && scope.row['abb_image_url'] !== ''">
                <el-popover placement="left" width="200" trigger="hover">
                  <img :src="scope.row['abb_image_url']" alt="QR Code" style="max-width: 100%; max-height: 100%;">
                  <el-button style="font-weight: bold" type="text" size="mini" icon="el-icon-view" slot="reference">View QR Code</el-button>
                </el-popover>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column v-if="['Android', 'ALL'].includes(this.form_data.channel)" label="Apk Url" prop="apk_url" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['apk_url'] === null">--</span>
              <span v-else style="font-weight: bold">
                <el-button style="font-weight: bold" @click="copyToClipboard(scope.row['apk_url'])" size="mini" type="text">Copy Apk Url</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="['Android', 'ALL'].includes(this.form_data.channel)" label="Aab Url" prop="abb_url" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['abb_url'] === null">--</span>
              <span v-else style="font-weight: bold">
                <el-button style="font-weight: bold" @click="copyToClipboard(scope.row['abb_url'])" size="mini" type="text">Copy Aab Url</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Builder" prop="builder" align="center"></el-table-column>
          <el-table-column label="Jenkins" prop="build_url" align="center">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row['build_url']" target="_blank">To Jekins</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :pager-count=12 :current-page = "privilegesRecord.currentPage"
                       layout="total, prev, pager, next" :total="privilegesRecord.privilegesRecordCount"
                       @current-change="handleCurrentChange" :page-size=40 style="margin-top: 5px">
        </el-pagination>
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import * as commonOperator from "@/common/naguri/naguri";

export default {
  name: "appGallery.vue",
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
        channel: "ALL"
      },
      tableHeight: 'calc(90vh - 65px)',
      form_rule: {},
      res_result: [],
      tableData: [],
      loading: false,
      routerPath: this.$route.path.toString(),
      privilegesRecordResponse: {results: []},
      privilegesRecord: {privilegesRecordCount: 0, currentPage: 1,},
    }
  },
  created () {
    this.form_data = commonOperator.initCrucialFromData(this.routerPath, this.form_data)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
    this.getPrivilegesRecord()
  },
  watch: {
    'form_data.channel': function(newVal, oldVal) {
      console.log('form_data.channel changed:', newVal, oldVal);
      this.adjustTableHeight();
    },
  },
  methods: {
    adjustTableHeight() {
      console.log('Adjusting table height...');
      this.tableHeight = 'calc(90vh - 65px)';
      this.$forceUpdate();
    },
    copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$message.success('Copied to clipboard.');
    },
    handleCurrentChange (val) {
      this.getPrivilegesRecord(val)
    },
    changePage(){
      this.privilegesRecord = {privilegesRecordCount: 0, currentPage: 1,}
      this.getPrivilegesRecord(1, 30)
    },
    async getPrivilegesRecord (page=1, pageSize=30) {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        `naguri/ef_api/app_gallery?page=${page}&page_size=${pageSize}&channel=${this.form_data.channel}`,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      this.privilegesRecordResponse = apiResponse['data']
      this.privilegesRecord.privilegesRecordCount = apiResponse['data']['count']
    }
  }
}
</script>

<style lang="less" scoped>
.table-area{
  height: calc(90vh - 65px);
  padding-top: 5px;
}
</style>
