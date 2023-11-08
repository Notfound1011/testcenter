<template>
  <ms-container>
    <ms-main-container class="container_main">
      <!-- 操作按钮区域 -->
      <div class="table_action">
        <!-- <div class="input-text">serverName：</div><el-autocomplete clearable :fetch-suggestions="serverNameSearch" placeholder="select serverName." @select="handleServerNameSelect" style="width: 15%"></el-autocomplete> -->
        <el-button size="medium" type="primary" icon="el-icon-circle-plus-outline" @click="preData.dialogVisible = true">Create Coverage Report</el-button>
        <el-button size="medium" type="primary" icon="el-icon-refresh-right" @click="getListCoveragePage(1,20)">Reload Data</el-button>
      </div>
      <!-- 表格数据区域 -->
      <div class="table_are">
        <el-table :data="res.coverageListRes['data']" height="100%" stripe border
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  style="width: 100%;background: transparent; overflow:auto;">
          <el-table-column label="#" type="index" width="45"></el-table-column>
          <el-table-column label="serverName" prop="serverName" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['serverName'] === null">--</span>
              <span v-else style="font-weight: bold">{{ scope.row['serverName'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="currentBranch" prop="currentBranch" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['currentBranch'] === null">--</span>
              <span v-else style="font-weight: bold">{{ scope.row['currentBranch'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="currentCommit" prop="currentCommit" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['currentCommit'] === null">--</span>
              <span v-else>{{ scope.row['currentCommit'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="compareCommit" prop="compareCommit" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row['compareCommit'] === null">--</span>
              <span v-else>{{ scope.row['compareCommit'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="startTime" prop="startTime" align="center" width="160"></el-table-column>
          <el-table-column label="endTime" prop="endTime" align="center" width="160"></el-table-column>
          <el-table-column label="taskStatus" prop="taskStatus" align="center" width="110">
            <template slot-scope="scope">
              <el-tag style="font-weight: bold" v-if="scope.row['taskStatus'] === 0" type="info">Not Started</el-tag>
              <el-tag style="font-weight: bold" v-else-if="scope.row['taskStatus'] === 1" type="warning">In Progress</el-tag>
              <el-tag style="font-weight: bold" v-else-if="scope.row['taskStatus'] === 2" type="danger">Failed</el-tag>
              <el-tag style="font-weight: bold" v-else-if="scope.row['taskStatus'] === 3" type="success">Completed</el-tag>
              <span v-else style="font-weight: bold">{{ scope.row['taskStatus'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="description" prop="description" align="center" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row['description'] !== null && scope.row['description'] !== ''">
                <el-popover placement="left" width="200" trigger="hover" :content="scope.row['description']">
                  <el-button type="text" size="mini" icon="el-icon-view" slot="reference">view</el-button>
                </el-popover>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="creatTime" prop="creatTime" align="center" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row['creatTime'] === null">--</span>
              <span v-else>{{ scope.row['creatTime'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="creator" prop="creator" align="center" width="110">
            <template slot-scope="scope">
              <el-tag size="medium">@{{ scope.row['creator'] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Action" align="center" width="140">
            <template slot-scope="scope">
              <el-button :disabled="scope.row['reportPath'] === null" type="success" size="medium"
                         @click="openReportDialog(scope.row['reportPath'])">View Report</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 查看报告dialog -->
      <el-dialog title="查看报告" custom-class="report-dialog"
                 :visible="preData.reportDialogVisible"
                 @close="closeReportDialog">
        <iframe :src="reportURL" width="100%" height="100%"></iframe>
      </el-dialog>
      <!-- 创建报告dialog -->
      <el-dialog
        @open="coFormParamsInit" width="30%" top="13vh"
        title="Create Coverage Report" :with-header="false"
        :visible.sync="preData.dialogVisible" :before-close="handleClose">
        <el-form ref="codeCoverageFormRef" :model="formData" :rules="formRule" size="medium" label-position="top">
          <el-form-item label="Target Server" prop="selectId">
            <el-cascader v-model="formData.selectId" :options="res.coverageServerConfigRes" change-on-select
                         :props="coverageServerConfigProps" :style="{width: '90%'}" placeholder="pls select server."
                         separator=" # " clearable @change="handleServerConfChange" filterable></el-cascader>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="Start Time" prop="startTime">
              <el-date-picker type="datetime" v-model="formData.startTime"
                              format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '80%'}"
                              placeholder="pls select start time."></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="End Time" prop="endTime">
              <el-date-picker type="datetime" v-model="formData.endTime"
                              format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '80%'}"
                              placeholder="pls select end time."></el-date-picker>
            </el-form-item>
          </el-col>
          <el-form-item label="Current Branch" prop="currentBranch">
            <el-select v-model="formData.currentBranch" placeholder="pls select server first." filterable clearable :style="{width: '90%'}" @change="handleBranchChange">
              <el-option v-for="(item, index) in res.coverageBranchRes['values']" :key="index" :label="item['displayId']" :value="item['displayId']"></el-option>
            </el-select>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="Current Commit No." prop="currentCommit">
              <el-select v-model="formData.currentCommit" placeholder="pls select branch first." filterable clearable :style="{width: '80%'}">
                <el-option v-for="(item, index) in res.coverageBranchCommitRes['values']"
                           :key="index" :label="item['displayId']" :value="item['displayId']">
                  <span v-if="item['isMerge']" style="float: left; font-weight: bold">{{ item['displayId'] }}</span>
                  <span v-else style="float: left">{{ item['displayId'] }}</span>
                  <el-tag size="mini" v-if="item['isMerge']" style="float: right;margin-top: 8px;font-weight: bold">M</el-tag>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Compare Commit No." prop="compareCommit">
              <el-select v-model="formData.compareCommit" placeholder="pls select branch first." filterable clearable :style="{width: '80%'}">
                <el-option v-for="(item, index) in res.coverageBranchCommitRes['values']" :key="index" :label="item['displayId']" :value="item['displayId']">
                  <span v-if="item['isMerge']" style="float: left; font-weight: bold">{{ item['displayId'] }}</span>
                  <span v-else style="float: left">{{ item['displayId'] }}</span>
                  <el-tag size="mini" v-if="item['isMerge']" style="float: right;margin-top: 8px;font-weight: bold">M</el-tag>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div class="button-container">
            <el-button size="medium" type="primary" @click="on_submit_form" :loading="preData.submitLoading">Submit</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 翻页区域 -->
      <el-pagination background :pager-count=12 :current-page = "listCoveragePage.currentPage"
                     layout="total, prev, pager, next" :total="listCoveragePage.listCoverageCount"
                     @current-change="handleCurrentChange" :page-size="listCoveragePage.pageSize"></el-pagination>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import * as commonOperator from "@/common/naguri/naguri";

export default {
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  name: "codeCoverage",
  components: {MsMainContainer, MsContainer},
  data() {
    return {
      preData: {
        submitLoading: false,
        dialogVisible: false,
        reportDialogVisible: false,
        reportPath: ''
      },
      formRule: {
        selectId: [{ required: true, message: 'pls select target server.', trigger: 'blur' }],
        currentBranch: [{ required: true, message: 'pls select current branch.', trigger: 'blur' }],
        compareCommit: [{ required: true, message: 'pls select compare commit.', trigger: 'blur' }],
        currentCommit: [{ required: true, message: 'pls select current commit.', trigger: 'blur' }],
        startTime: [{ required: true, message: 'pls select start time.', trigger: 'blur' }],
        endTime: [{ required: true, message: 'pls select end time.', trigger: 'blur' }],
        compareType: [{ required: true, message: 'pls select compare type.', trigger: 'blur' }],
      },
      formData: {
        selectId: [],
        projectId: '',
        serverId: '',
        currentBranch: '',
        compareCommit: '',
        currentCommit: '',
        startTime: '',
        endTime: '',
        compareType: 2,
        creator: '',
        creatorId: ''
      },
      res: {
        coverageListRes: {data: []},
        coverageServerConfigRes: [],
        coverageBranchRes: {},
        coverageBranchCommitRes: {},
      },
      listCoveragePage: {listCoverageCount: 0, currentPage: 1, pageSize: 20},
      coverageServerConfigProps: {
        "value": "id",
        "label": "serverName",
        "children": "serverConfigs",
        "checkStrictly": false,
        "expandTrigger": "hover"
      },
    }
  },
  computed: {
    reportURL() {
      return `http://tc.cmex.corp/api/tc/codeCoverage/${this.preData.reportPath}`;
    },
  },
  created() {
    this.getListCoveragePage()
    this.techUserListResponse()
  },
  methods: {
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    // handleServerNameSelect (item) {
    //   console.log("已选择：" + item)
    // },
    // serverNameSearch(queryString, cb) {
    //   this.getCoverageConfigs()
    //   console.log("输入查询：" + queryString)
    //   console.log("接口返回值：" + this.res.coverageServerConfigRes)
    //   const serverList = []
    // },
    openReportDialog(reportPath) {
      this.preData.reportPath = reportPath;
      this.preData.reportDialogVisible= true;
    },
    closeReportDialog() {
      this.preData.reportDialogVisible = false;
      this.preData.reportPath = "";
    },
    coFormParamsInit () {
      this.getCoverageConfigs()
      this.formData.startTime = new Date(new Date().getTime())
      this.formData.endTime = new Date(new Date().getTime() + 30 * 60 * 1000)
    },
    handleBranchChange(value) {
      this.res.coverageBranchCommitRes = this.getCoverageBranchCommit(this.formData.projectId, value)
      this.formData.currentCommit = ''
      this.formData.compareCommit = ''
    },
    handleServerConfChange(value) {
      this.formData.currentBranch = ''
      this.formData.currentCommit = ''
      this.formData.compareCommit = ''
      if (Array.isArray(value) && value.length !== 0) {
        this.formData.projectId = value[0]
        this.formData.serverId = value[value.length - 1];
        this.res.coverageBranchRes = this.getCoverageBranch(this.formData.projectId)
      }
    },
    handleClose(done) {
      this.$confirm('Cancel Create Coverage Report?')
        .then(_ => {
          this.preData.dialogVisible = false
          this.$refs['codeCoverageFormRef'].resetFields()
          done();
        })
        .catch(_ => {});
    },
    handleCurrentChange (val) {
      this.getListCoveragePage(val)
    },
    async getCoverageBranchCommit (serverId, branch) {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        `codeCoverage/git/getCommits/${serverId}?branch=${branch}`,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error.response.data)
      })
      this.res.coverageBranchCommitRes = apiResponse['data']
    },
    async getCoverageBranch (serverId) {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        `codeCoverage/git/getBranches/${serverId}`,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error.response.data)
      })
      this.res.coverageBranchRes = apiResponse['data']
    },
    async getCoverageConfigs () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        'codeCoverage/config/getConfigs',
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error.response.data)
      })
      apiResponse.data.forEach(item => {
        item.serverName = item['repos'];
        delete item['repos'];
      });
      console.log(apiResponse.data)
      this.res.coverageServerConfigRes = apiResponse['data']
    },
    async getListCoveragePage (page=1, pageSize=20) {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.post(
        'codeCoverage/report/list?pageNum='+page+'&pageSize='+pageSize,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error.response.data)
      })
      this.res.coverageListRes = apiResponse['data']
      this.listCoveragePage.listCoverageCount = apiResponse['data']['total']
    },
    async techUserListResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.put('naguri/em_api/tech_user_list', {"email": JSON.parse(window.localStorage.getItem('Admin-Token'))['email']}, {headers, timeout: 5000})
      this.formData.creator = apiResponse['display_name']
      this.formData.creatorId = apiResponse['user_id']
    },
    // for submit
    on_submit_form() {
      this.$refs['codeCoverageFormRef'].validate(async (valid) => {
        if (!valid) return
        let sendForm = {...this.formData}
        delete sendForm['selectId']
        sendForm['startTime'] = sendForm['startTime'].toLocaleString().replaceAll('/', '-')
        sendForm['endTime'] = sendForm['endTime'].toLocaleString().replaceAll('/', '-')
        console.log(sendForm)
        const headers = commonOperator.parseNaguriHeader()
        const { data: apiResponse } = await this.$axios.post(
          'codeCoverage/report/creat ', sendForm,
          {headers, timeout: 5000}
        ).catch((error) => {
          commonOperator.messageTips('error', error.response.data)
          this.preData.submitLoading = false
        })
        commonOperator.messageTips('success', apiResponse['msg'])
        this.sleep(500).then(() => {
          this.preData.submitLoading = false
          this.preData.dialogVisible = false
          this.$refs['codeCoverageFormRef'].resetFields()
          this.getListCoveragePage()
        })
      });
    }
  }
}
</script>

<style lang="less" scoped>
.input-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.container_main {
  display: flex;
  flex-direction: column;
}
.table_action {
  margin-bottom: 10px;
  display: flex;
}
.table_are {
  display: flex;
  margin-bottom: 10px;
  height: 160vh;
}
/deep/ .el-dialog__body {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  height: 90%;
}
.button-container {
  text-align: center;
  .el-button {
    margin-top: 25px;
    width: 100%;
  }
}
/deep/ .report-dialog {
  margin-top: 5vh !important;
  width: 80% !important;
  height: 90% !important;
}
</style>
