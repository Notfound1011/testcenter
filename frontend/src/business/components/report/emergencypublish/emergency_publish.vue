<template>
  <ms-container>
    <ms-main-container class="container_main">
      <!--<div class="chart_are">
        <span>图表区域</span>
      </div>-->
      <div class="table_action">
        <el-button style="margin: 0 20px;" icon="el-icon-circle-plus-outline" type="primary" @click="dialogVisible = true">提交紧急发布</el-button>
      </div>
      <div class="table_are">
        <el-table :data="emPublishDataResponse.results" style="width: 100%;background: transparent; overflow:auto;" height="100%" border>
          <!-- <el-table-column type="index" label="#" align="center"></el-table-column> -->
          <el-table-column fixed label="ID" prop="publish_id" align="center" width="55"></el-table-column>
          <!-- <el-table-column label="Serial.No" prop="publish_tid" width="260" align="center"></el-table-column> -->
          <el-table-column label="发布类型" align="center">
            <template slot-scope="scope">
              <el-tag effect="dark" size="mini" style="margin: 2px" v-for="item in scope.row.publish_type" :key="item.Id">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布服务" align="center">
            <template slot-scope="scope">
              <el-tag effect="dark" type="warning" size="mini" style="margin: 2px" v-for="item in scope.row.relation_service" :key="item.Id">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布原因" header-align="center" align="left" prop="publish_reason" width="300"></el-table-column>
          <!-- <el-table-column label="发布原因" align="center">
            <template slot-scope="scope">
              <el-popover placement="top-start" width="200" trigger="hover" :content="scope.row.publish_reason">
                <el-button type="text" size="small" icon="el-icon-view" slot="reference">查看</el-button>
              </el-popover>
            </template>
          </el-table-column> -->
          <el-table-column label="相关链接" align="center">
            <template slot-scope="scope">
              <el-popover placement="right" width="400" trigger="hover">
                <el-table :data="scope.row.publish_link">
                  <el-table-column property="link_type" label="链接类型"></el-table-column>
                  <el-table-column property="link_alias" label="链接别名">
                    <template slot-scope="scope">
                      <a type="primary" :href="scope.row.ori_link" target="_blank">{{ scope.row.link_alias }}</a>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="text" size="mini" icon="el-icon-view" slot="reference">查看</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="期望发布时间" width="180" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 5px">{{ scope.row.publish_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Tech审批状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="publishStatusTag(scope.row.publish_status.code)">{{ scope.row.publish_status.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Developer">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row.publish_user">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="developer in publishUser.developer" :key="developer.Id">{{ developer }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Reviewer">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row.publish_user">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="reviewer in publishUser.reviewer" :key="reviewer.Id">{{ reviewer }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Executor">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row.publish_user">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="executor in publishUser.executor" :key="executor.Id">{{ executor }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Tester">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row.publish_user">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="tester in publishUser.tester" :key="tester.Id">{{ tester }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Auditor">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row.publish_user">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="auditor in publishUser.auditor" :key="auditor.Id">{{ auditor }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" prop="c_time" width="160" align="center"></el-table-column>
        </el-table>
      </div>

      <el-drawer size="40%" title="提交紧急发布变更" :visible.sync="dialogVisible" direction="ltr" :before-close="handleClose" :with-header="false">
        <el-container class="main_submit">
          <el-card class="sub_card" shadow="never" style="height: 100%;padding: 0 0;border: 0" >
            <div slot="header" class="clearfix">
              <span style="font-size: 25px">提交紧急发布变更</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="handleClose">X</el-button>
            </div>
            <el-form style="padding: 10px" ref="emergencyChangeForm" :model="formData" :rules="rules" size="small" label-width="0px" label-position="top">
              <div class="form_body">
                <div class="u_body">
                  <el-col :span="24">
                    <el-form-item label="紧急变更概述/原因" prop="publish_reason" maxlength="256">
                      <el-input v-model="formData.publish_reason" type="textarea" placeholder="请输入紧急变更概述"
                                :maxlength="200" show-word-limit :autosize="{minRows: 3, maxRows: 5}" :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="紧急发布类型" prop="publish_type">
                      <el-cascader v-model="formData.publish_type" :options="emergencyPublishTypeOptions"
                                   :props="emergencyPublishTypeProps" :style="{width: '100%'}" placeholder="请选择紧急发布类型"
                                   separator=" # " clearable></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="serviceInputShow" :span="24">
                    <el-form-item label-width="80px" label="相关变更服务" prop="publish_service">
                      <el-select v-model="formData.publish_service" placeholder="请选择服务相关变更服务" multiple filterable
                                 clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in serviceNameOptions" :key="index" :label="item.service_name"
                                   :value="item.service_id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="configInputShow" :span="24">
                    <el-form-item label-width="110px" label="配置文件PR链接 (NewConfig/Nacos 多个请保持每行一条)" prop="links.configPrLink.link">
                      <el-input v-model="formData.links.configPrLink.link" type="textarea" :autosize="{minRows: 1, maxRows: 3}" placeholder="请输入JIRA链接newconfig PR 链接" clearable
                                prefix-icon='el-icon-link' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="changeAuditShow" :span="24">
                    <el-form-item label-width="110px" label="数据库变更(changeAudit)PR链接 (多个请保持每行一条)" prop="links.changeAuditLink.link">
                      <el-input v-model="formData.links.changeAuditLink.link" type="textarea" :autosize="{minRows: 1, maxRows: 3}" placeholder="请输入JIRA链接change_audit 链接" clearable
                                prefix-icon='el-icon-link' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label-width="110px" label="相关JIRA链接 (多个请保持每行一条)" prop="links.jiraLink.link">
                      <el-input v-model="formData.links.jiraLink.link" type="textarea" :autosize="{minRows: 1, maxRows: 3}" placeholder="请输入JIRA链接相关JIRA链接" clearable
                                prefix-icon='el-icon-link' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label-width="150px" label="相关Confluence链接 (多个请保持每行一条)" prop="links.confluenceLink.link">
                      <el-input v-model="formData.links.confluenceLink.link" type="textarea" :autosize="{minRows: 1, maxRows: 3}" placeholder="请输入(若有)相关confluence链接" clearable
                                prefix-icon='el-icon-link' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                </div>
                <div class="d_body">
                  <el-col :span="10">
                    <el-form-item label="回滚策略" prop="rollback_action">
                      <el-select v-model="formData.rollback_action" placeholder="请择选回滚策略" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="(item, index) in rollbackOptions" :key="index" :label="item.type_name" :value="item.type_id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="预计变更时间" prop="publish_time">
                      <el-date-picker type="datetime" v-model="formData.publish_time"
                                      format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :style="{width: '90%'}"
                                      placeholder="请选择预计变更时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="相关开发人员" prop="developer.users">
                      <el-select v-model="formData.developer.users" placeholder="请选择相关开发人员" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="(item, index) in techUserListDataResponse" :key="index" :label="item.display_name" :value="item.user_id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="Review人员" prop="reviewer.users">
                      <el-select v-model="formData.reviewer.users" placeholder="请选择开发review人员" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="(item, index) in techUserListDataResponse" :key="index" :label="item.display_name" :value="item.user_id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="变更执行人(测试/开发/OPS)" prop="executor.users">
                      <el-select v-model="formData.executor.users" placeholder="请选择变更执行人" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="(item, index) in techUserListDataResponse" :key="index" :label="item.display_name" :value="item.user_id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="验证人(自测验证请选自己)" prop="tester.users">
                      <el-select v-model="formData.tester.users" placeholder="测试验证人员或自己" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="(item, index) in techUserListDataResponse" :key="index" :label="item.display_name" :value="item.user_id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </div>
              </div>
            </el-form>
          </el-card>
        </el-container>
        <div class="sub_btn">
          <el-button size="medium" @click="handleClose">取消提交</el-button>
          <el-button size="medium" type="primary" @click="on_submit_form" :loading="submitLoading">提交发布审批</el-button>
        </div>
      </el-drawer>
    </ms-main-container>
  </ms-container>
</template>

<style>
  .container_main {
    display: flex;
    flex-direction: column;
  }
  .table_action {
    margin-bottom: 10px;
    display: flex;
  }
  .table_are {
    margin-bottom: 10px;
    height: 80vh;
  }
  .el-drawer__body {
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  .el-drawer__container ::-webkit-scrollbar{
    display: none;
  }
  .el-table tbody tr:hover>td {
    background-color: #f5f5f5 !important
  }
  .el-form-item {
    font-weight: bold;
  }
  .main_submit {
    display: flex;
    flex-direction: column;
  }
  .sub_card {
    padding: 15px;
  }
  .sub_btn {
    display: flex;
  }
  .sub_btn button {
    flex: 1;
    padding: 12px 10px;
    font-size: 14px;
    border-radius: 7px;
    margin: 10px 20px;
  }
  .form_body {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .chart_are {
    display: flex;
    width: 100%;
    height: 300px;
    background: #d2d2f1;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import {messageTips, notificationTips} from "@/business/components/report/emergencypublish/common"

export default {
  inheritAttrs: false,
  props: [],
  name: "emergency_publish",
  components: {MsMainContainer, MsContainer},
  data() {
    return {
      rules: {
        publish_type: [{required: true, type: 'array', message: '请至少选择一个紧急发布类型', trigger: 'change'}],
        publish_service: [{required: true, type: 'array', message: '请至少选择一个相关变更服务', trigger: 'change'}],
        publish_reason: [{required: true, message: '请输入紧急变更概述',trigger: 'blur'}],
        links: {
          jiraLink: {link: [{required: false,message: '请输入JIRA链接',trigger: 'blur'}]},
          confluenceLink: {link: [{required: false, message: '请输入confluence链接',trigger: 'blur'}]},
          configPrLink: {link: [{required: true, message: '请输入newConfig PR 链接',trigger: 'blur'}]},
          changeAuditLink: {link: [{required: true, message: '请输入changeAudit PR链接',trigger: 'blur'}]}
        },
        developer: {users: [{required: true, type: 'array', message: '请至少选择一个相关开发人员', trigger: 'change'}]},
        reviewer: {users: [{required: true, type: 'array', message: '请至少选择一个开发review人员,无则选自己', trigger: 'change'}]},
        executor: {users: [{required: true, type: 'array', message: '请至少选择一个执行人', trigger: 'change'}]},
        tester: {users: [{required: true, type: 'array', message: '请至少选择一个验证人，自测选自己', trigger: 'change'}]},
        rollback_action: [{required: true, type: 'array', message: '请至少选择一个回滚策略', trigger: 'change'}],
        publish_time: [{required: true, message: '请选择预计变更时间', trigger: 'change'}],
      },
      serviceInputShow: false,
      configInputShow: false,
      changeAuditShow: false,
      submitLoading: false,
      dialogVisible: false,
      emPublishDataResponse: {results: []},
      techUserListDataResponse: [],
      serviceNameOptions: [],
      rollbackOptions: [],
      formData: {
        publish_reason: "",
        publish_time: "",
        publish_type: [],
        publish_service: [],
        rollback_action: [],
        reviewer: {user_type: 4, users: []},
        executor: {user_type: 6, users: []},
        developer: {user_type: 5, users: []},
        tester: {user_type: 29, users: []},
        links: {
          jiraLink: {id: 10, link: ""},
          confluenceLink: {id: 11, link: ""},
          configPrLink: {id: 12, link: ""},
          changeAuditLink: {id: 13, link: ""}
        }
      },
      submitFormResponse: {},
      emergencyPublishTypeOptions: [],
      emergencyPublishTypeProps: {
        "multiple": true,
        "label": "type_name",
        "value": "id",
        "children": "children",
        "checkStrictly": false
      }
    }
  },
  watch: {
    formData: {
      handler:function(changeValue){
        const newPublishType = Array.from(new Set(changeValue.publish_type.reduce((prev, curr) => (prev.concat(curr)), [])))
        this.serviceInputShow = newPublishType.includes(16); // 服务变更
        this.configInputShow = newPublishType.includes(19); // 配置变更
        this.changeAuditShow = newPublishType.includes(17); // DB变更
      },
      deep:true
    }
  },
  created() {
    this.serviceResponse()
    this.publishTypeResponse()
    this.publishResponse()
    this.techUserListResponse()
    this.getRollbackAction()
  },
  inject: ["reload"],
  methods: {
    publishStatusTag (status) {
      if (status === 0) {
        return 'warning'
      } else if (status === 1) {
        return 'success'
      } else if (status === 2) {
        return 'danger'
      } else if (status === 3) {
        return 'info'
      }
    },
    handleClose(done) {
      this.$confirm('是否确认取消提交紧急发布？')
        .then(_ => {
          this.dialogVisible = false
          this.$refs['emergencyChangeForm'].resetFields()
          done();
        })
        .catch(_ => {});
    },
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    async serviceResponse () {
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/service_list')
      this.serviceNameOptions = apiResponse
    },
    async publishTypeResponse () {
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/publish_type_list')
      this.emergencyPublishTypeOptions = apiResponse
    },
    async publishResponse () {
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/publish')
      this.emPublishDataResponse = apiResponse
    },
    async techUserListResponse () {
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/tech_user_list')
      this.techUserListDataResponse = apiResponse
    },
    async getRollbackAction () {
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/get_collect_type?type=2')
      this.rollbackOptions = apiResponse
    },
    on_submit_form () {
      console.log(this.formData)
      this.$refs.emergencyChangeForm.validate(async valid => {
        if (!valid) return
        this.submitLoading = true
        const { data: apiResponse } = await this.$axios.post('naguri/em_api/publish', this.formData).catch((error) => {
          console.log(error)
          notificationTips('error', '提交失败，请检查表单内容！或联系 @Pauri')
          this.submitLoading = false
        })
        console.log(apiResponse)
        this.submitFormResponse = apiResponse
        if (apiResponse.publish < 1) {
          messageTips('error', '提交失败，请检查表单内容！')
          this.submitLoading = false
        } else {
          messageTips('success', '提交成功，请关注Slack审批！')
          this.$refs['emergencyChangeForm'].resetFields()
          this.sleep(1000).then(() => {
            this.submitLoading = false
            this.dialogVisible = false
            this.reload()
          })
        }
      })
    }
  }
}
</script>
