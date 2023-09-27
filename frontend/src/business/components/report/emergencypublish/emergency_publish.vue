<template>
  <ms-container>
    <ms-main-container class="container_main">
      <!-- 操作按钮区域 -->
      <div class="table_action">
        <el-button :disabled="onPublish['status']" style="margin: 0 auto 0 20px;" icon="el-icon-circle-plus-outline" type="primary" @click="preData.dialogVisible = true">提交紧急发布</el-button>
        <el-button :disabled="onPublish['status']" plain type="primary" icon="el-icon-odometer" @click="preData.chartVisible = true">统计图</el-button>
        <el-button :disabled="onPublish['status']" plain style="margin: 0 20px" type="success" icon="el-icon-odometer" @click="monthlyChartVisible = true">月度概览</el-button>
      </div>
      <!-- 表格数据区域 -->
      <div v-if="onPublish['status'] > 0" style="display: flex;justify-content: center;align-items: center;">
        <el-empty style="display: flex;flex-direction: column;justify-content: center;align-items: center;" :image-size="300" description="系统更新中，请稍后..."></el-empty>
      </div>
      <div class="table_are">
        <el-table v-if="onPublish['status'] <= 0"
                  :data="emPublishDataResponse.results"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  style="width: 100%;background: transparent; overflow:auto;"
                  height="100%"
                  border highlight-current-row>
          <el-table-column label="ID" prop="publish_id" align="center" width="55"></el-table-column>
          <el-table-column label="发布类型" align="center" width="150">
            <template slot-scope="scope">
              <el-tag effect="dark" size="mini" style="margin: 2px" v-for="item in scope.row.publish_type" :key="item.Id">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布服务" align="center" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row['relation_service'].length > 0">
                <el-tag effect="dark" type="warning" size="mini" style="margin: 2px" v-for="item in scope.row['relation_service']" :key="item.Id">{{ item }}</el-tag>
              </div>
              <span v-else> -- </span>
            </template>
          </el-table-column>
          <el-table-column label="变更原因/简述" header-align="center" align="left" prop="publish_reason" width="300">
            <template slot-scope="scope">
              <span style="font-weight: bold">{{ scope.row['publish_reason'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="相关链接" align="center" width="81">
            <template slot-scope="scope">
              <el-popover placement="right" width="273" trigger="hover">
                <el-table :data="scope.row['publish_link']" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                  <el-table-column property="link_type" label="链接类型" width="120"></el-table-column>
                  <el-table-column property="link_alias" label="链接别名" width="150">
                    <template slot-scope="scope">
                      <a type="primary" :href="scope.row['ori_link']" target="_blank">{{ scope.row['link_alias'] }}</a>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button :disabled="!scope.row['publish_link'].length" type="text" size="mini" icon="el-icon-view" slot="reference">查看</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="变更时间" width="155" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 5px;">{{ scope.row.publish_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批状态" align="center" width="91">
            <template slot-scope="scope">
              <el-tag style="font-weight: bold" :type="publishStatusTag(scope.row['publish_status'].code)">
                {{ scope.row['publish_status'].status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Developer">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row['publish_user']">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="developer in publishUser.developer" :key="developer.Id">{{ developer }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Reviewer">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row['publish_user']">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="reviewer in publishUser.reviewer" :key="reviewer.Id">{{ reviewer }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Executor">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row['publish_user']">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="executor in publishUser.executor" :key="executor.Id">{{ executor }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Tester">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row['publish_user']">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="tester in publishUser.tester" :key="tester.Id">{{ tester }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Auditor">
            <template slot-scope="scope">
              <template v-for="publishUser in scope.row['publish_user']">
                <el-tag effect="plain" size="mini" style="margin: 2px" v-for="auditor in publishUser['auditor']" :key="auditor.Id">{{ auditor }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="消息列直达">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row['slack_msg_thread']" target="_blank">定位到聊天位置</el-link>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" prop="c_time" width="160" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- 表单抽屉区 -->
      <el-drawer @open="emFormParamsInit" size="40%" title="提交紧急发布变更" :visible.sync="preData.dialogVisible" direction="ltr" :before-close="handleClose" :with-header="false">
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
                  <el-col v-if="preData.serviceInputShow" :span="24">
                    <el-form-item label-width="80px" label="相关变更服务" prop="publish_service">
                      <el-select v-model="formData.publish_service" placeholder="请选择服务相关变更服务" multiple filterable
                                 clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in serviceNameOptions" :key="index" :label="item['service_name']"
                                   :value="item['service_id']"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="preData.configInputShow" :span="24">
                    <el-form-item label-width="110px" label="配置文件PR链接 (NewConfig/Nacos 多个请保持每行一条)" prop="links.configPrLink.link">
                      <el-input v-model="formData.links.configPrLink.link" type="textarea" :autosize="{minRows: 1, maxRows: 3}" placeholder="请输入JIRA链接newconfig PR 链接" clearable
                                prefix-icon='el-icon-link' :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="preData.changeAuditShow" :span="24">
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
                        <el-option v-for="(item, index) in rollbackOptions" :key="index" :label="item['type_name']" :value="item['type_id']"></el-option>
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
                    <el-form-item label="开发人员" prop="developer.users">
                      <el-select v-model="formData.developer.users" placeholder="请选择相关开发人员" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="developer in techUserListDataResponse" :key="developer['user_id']" :label="developer['display_name']" :value="developer['user_id']"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="Review人员" prop="reviewer.users">
                      <el-select v-model="formData.reviewer.users" placeholder="请选择开发review人员" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="reviewer in techUserListDataResponse" :key="reviewer['user_id']" :label="reviewer['display_name']" :value="reviewer['user_id']"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="变更执行人(测试/开发/OPS)" prop="executor.users">
                      <el-select v-model="formData.executor.users" placeholder="请选择变更执行人" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="executor in techUserListDataResponse" :key="executor['id']" :label="executor['display_name']" :value="executor['user_id']"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="验证人(自测验证请选自己)" prop="tester.users">
                      <el-select v-model="formData.tester.users" placeholder="测试验证人员或自己" multiple filterable clearable :style="{width: '90%'}">
                        <el-option v-for="tester in techUserListDataResponse" :key="tester['user_id']" :label="tester['display_name']" :value="tester['user_id']"></el-option>
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
          <el-button size="medium" type="primary" @click="on_submit_form" :loading="preData.submitLoading">提交发布审批</el-button>
        </div>
      </el-drawer>
      <!-- 翻页区域 -->
      <el-pagination style="height: 70px;" :disabled="onPublish['status']"
                     background
                     :pager-count=12
                     :current-page = "publishPage.currentPage"
                     layout="prev, pager, next"
                     :total="publishPage.emPublishCount"
                     @current-change="handleCurrentChange"
                     :page-size=20></el-pagination>
      <!-- 图表区域 -->
      <el-drawer class="chartAre" :with-header="false" :visible.sync="preData.chartVisible" direction="rtl" :show-close="false" size="55%" @open="emEChartOpen">
        <div class="chartAreSub">
          <div ref="lastTwoWeekChart" style="height: 500px;width: 500px; margin: 20px 0 20px 0;"></div>
          <div ref="typePercentageChart" style="height: 500px;width: 500px; margin: 20px 0 20px 0;"></div>
          <div ref="topServiceChart" style="height: 500px;width: 500px; margin: 20px 0 20px 0;"></div>
          <div ref="topDeveloperChart" style="height: 500px;width: 500px; margin: 20px 0 20px 0;"></div>
        </div>
      </el-drawer>
      <!-- 月度概览 -->
      <el-dialog title="月度紧急发布数据概览" :visible.sync="monthlyChartVisible" @open="monthlyStatisticalResponse"
                 @close="monthlyChartVisibleStatus" width="80%" top="10vh" ref="monthlyDialog">
        <el-table :data="monthlyStatistical.results" :span-method="yearSpanMethod" border
                  :header-cell-style="{background:'#eef1f6',color:'#606266',}"
                  style="width: 100%;background: transparent; overflow:auto;">
          <el-table-column prop="year" align="center" label="年份" width="120" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <i class="el-icon-date"></i>
              <span style="margin-left: 5px;font-size: 18px;font-weight: bold;color: grey;">{{ scope.row['year'] }}年</span>
            </template>
          </el-table-column>
          <el-table-column label="季度" prop="quarter" align="center" width="120" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <i class="el-icon-c-scale-to-original"></i>
              <span style="margin-left: 5px;font-size: 17px;font-weight: bold;color: grey;">{{ scope.row['year'] }} Q{{ scope.row['quarter'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="月度" prop="year_monthly" align="center" width="100" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <span style="margin-left: 5px;font-size: 16px;font-weight: bold;color: grey;">{{ scope.row['month'] }}月</span>
            </template>
          </el-table-column>
          <el-table-column label="发布总次数" prop="em_release_count" align="center" width="100" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <span style="margin-left: 5px;font-size: 16px;font-weight: bold;color: grey;}">{{ scope.row['em_release_count'] }} 次</span>
            </template>
          </el-table-column>
          <el-table-column label="环比上月" align="center" width="165" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <el-tag size="small" :type="publishStatusTag(scope.row['em_growth_type'])">
                <span style="font-size: 16px;font-weight: bold;">
                  {{ scope.row['em_growth_type'] === 1 ? '下降' : scope.row['em_growth_type'] === 2 ? '上升' : scope.row['em_growth_type'] === 3 ? '-' : '' }} {{ scope.row['em_growth_type'] === 3 ? '' : scope.row['em_growth'] }}
                </span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="topInfo.monthlyLabel.types" align="center" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <el-table :data="scope.row['most_publish_type_top']" :show-header="false" stripe>
                <el-table-column align="left" prop="publish_type"></el-table-column>
                <el-table-column align="center" prop="count" width="60"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column :label="topInfo.monthlyLabel.service" align="center" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <el-table :data="scope.row['most_publish_server_top']" :show-header="false" stripe>
                <el-table-column align="left" prop="publish_server"></el-table-column>
                <el-table-column align="center" prop="count" width="60"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column :label="topInfo.monthlyLabel.developer" align="center" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <el-table :data="scope.row['most_publish_developer_top']" :show-header="false" stripe>
                <el-table-column align="left" prop="publish_developer">
                  <template slot-scope="scope_sub">
                    <el-tag size="mini" effect="plain" :key="scope_sub.index">
                      {{ scope_sub.row['publish_developer'] }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="count" width="80"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column :label="topInfo.monthlyLabel.tester" align="center" :label-class-name="'monthly-label'">
            <template slot-scope="scope">
              <el-table :data="scope.row['most_publish_tester_top']" :show-header="false" stripe>
                <el-table-column align="left" prop="publish_tester">
                  <template slot-scope="scope_sub">
                    <el-tag size="mini" effect="plain" :key="scope_sub.index">
                      {{ scope_sub.row['publish_tester'] }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="count" width="80"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </ms-main-container>
  </ms-container>
</template>

<style>
.container_main {
  display: flex;
  flex-direction: column;
}
.table_action {
  margin-bottom: 6px;
  display: flex;
  justify-content: flex-end;
}
.table_are {
  display: flex;
  margin-bottom: 10px;
  height: 160vh;
}
.el-drawer__body {
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.el-drawer__container ::-webkit-scrollbar{
  display: none;
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
.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
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
.chartAre {
  height: 100%;
  display: flex;
  justify-content: center;
}
.chartAreSub {
  margin: 0 0 0 50px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.monthlyChartAre {
  display: flex;
  justify-content: center;
  margin: auto;
  height: 100%;
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
.monthly-label {
  font-size: 15px;
}
</style>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import {messageTips, notificationTips} from "@/business/components/report/emergencypublish/common"
import * as echarts from 'echarts';
import * as commonOperator from "@/business/components/report/emergencypublish/common";

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
          jiraLink: {link: [
              { required: false, message: '请输入相关JIRA链接', trigger: 'blur' },
              { validator: this.validateLinks, trigger: 'blur' }
            ]},
          confluenceLink: {link: [
              {required: false, message: '请输入confluence链接',trigger: 'blur'},
              {validator: this.validateLinks, trigger: 'blur'}
            ]},
          configPrLink: {link: [
              {required: true, message: '请输入newConfig PR 链接',trigger: 'blur'},
              {validator: this.validateLinks, trigger: 'blur'}
            ]},
          changeAuditLink: {link: [
              {required: true, message: '请输入changeAudit PR链接',trigger: 'blur'},
              {validator: this.validateLinks, trigger: 'blur'}
            ]}
        },
        developer: {users: [{required: true, type: 'array', message: '请至少选择一个相关开发人员', trigger: 'change'}]},
        reviewer: {users: [{required: true, type: 'array', message: '请至少选择一个开发review人员,无则选自己', trigger: 'change'}]},
        executor: {users: [{required: true, type: 'array', message: '请至少选择一个执行人', trigger: 'change'}]},
        tester: {users: [{required: true, type: 'array', message: '请至少选择一个验证人，自测选自己', trigger: 'change'}]},
        rollback_action: [{required: true, type: 'array', message: '请至少选择一个回滚策略', trigger: 'change'}],
        publish_time: [{required: true, message: '请选择预计变更时间', trigger: 'change'}],
      },
      preData: {
        serviceInputShow: false,
        configInputShow: false,
        changeAuditShow: false,
        submitLoading: false,
        dialogVisible: false,
        chartVisible: false,
      },
      monthlyChartVisible: false,
      publishPage: {
        emPublishCount: 0,
        currentPage: 1,
      },
      emPublishDataResponse: {results: []},
      monthlyStatistical: {results: []},
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
        submitter: {user_type: 32, users: []},
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
      },
      statistics: {},
      onPublish: {status: false},
      yearRanges: {},
      quarterRanges: {},
      topInfo: {
        monthlyLabel: {
          types: 'Top Publish Types',
          service: 'Top Publish Server',
          developer: 'Top Developers',
          tester: 'Top Testers'
        },
        topNStatistical: {
          topServer: '',
          topDeveloper: ''
        }
      },
    }
  },
  watch: {
    formData: {
      handler:function(changeValue){
        const newPublishType = Array.from(new Set(changeValue.publish_type.reduce((prev, curr) => (prev.concat(curr)), [])))
        this.preData.serviceInputShow = newPublishType.includes(18) || newPublishType.includes(19) || newPublishType.includes(20); // 服务变更
        this.preData.configInputShow = newPublishType.includes(19) || newPublishType.includes(30); // 配置变更
        this.preData.changeAuditShow = newPublishType.includes(17); // DB变更
        //数据订正jira修改为必填
        // const baseRule = { validator: this.validateLinks, trigger: 'blur' };
        // this.rules.links.jiraLink.link = newPublishType.includes(31) || newPublishType.includes(32)
        //   ? [
        //     { required: true, message: '请输入相关JIRA链接', trigger: 'blur' },
        //     baseRule
        //   ]
        //   : [baseRule];
      },
      deep:true
    }
  },
  created() {
    this.publishListResponse()
    this.onPublishStatusResponse()
    this.topInfoResponse()
  },
  mounted() {
    this.statisticsResponse()
    this.monthlyChartVisibleStatus('open')
  },
  inject: ["reload"],
  methods: {
    validateLinks(rule, value, callback) {
      const linksArray = value.split('\n');
      for (const link of linksArray) {
        if (link.trim() !== '' && !link.trim().startsWith('http')) {
          return callback(new Error('链接必须以http或者https开头'));
        }

        const httpCount = link.split('http').length - 1;
        if (httpCount >= 2) {
          return callback(new Error('多个链接请换行填写,保持每行一条'));
        }
      }
      callback();
    },
    monthlyChartVisibleStatus(action = 'close') {
      const query = { ...this.$route.query };
      const isOpen = query.monthlyChartVisible === 'open';

      if (action === 'open' && isOpen) {
        this.$nextTick(() => {
          this.monthlyChartVisible = true;
        });
      } else if (action === 'close' && isOpen) {
        delete query.monthlyChartVisible;
        this.$router.replace({ query });
      }
    },
    yearSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const year = row.year;
        const yearRange = this.yearRanges[year] || this.getYearRange(year);
        if (rowIndex === yearRange.startIndex) {
          const rowspan = yearRange.endIndex - yearRange.startIndex + 1;
          return { rowspan, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      } else if (columnIndex === 1) {
        const quarter = row.quarter;
        const quarterRange = this.quarterRanges[quarter] || this.getQuarterRange(row.year, quarter);
        if (rowIndex === quarterRange.startIndex) {
          const rowspan = quarterRange.endIndex - quarterRange.startIndex + 1;
          return { rowspan, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
    },
    getQuarterRange(year, quarter) {
      let startIndex = -1;
      let endIndex = -1;
      for (let i = 0; i < this.monthlyStatistical.results.length; i++) {
        if (this.monthlyStatistical.results[i].year === year && this.monthlyStatistical.results[i].quarter === quarter) {
          if (startIndex === -1) {
            startIndex = i;
          }
          endIndex = i;
        }
      }
      const quarterRange = { startIndex, endIndex };
      this.quarterRanges[`${year}-${quarter}`] = quarterRange;
      return quarterRange;
    },
    getYearRange(year) {
      let startIndex = -1;
      let endIndex = -1;
      for (let i = 0; i < this.monthlyStatistical.results.length; i++) {
        if (this.monthlyStatistical.results[i].year === year) {
          if (startIndex === -1) {
            startIndex = i;
          }
          endIndex = i;
        }
      }
      const yearRange = { startIndex, endIndex };
      this.yearRanges[year] = yearRange;
      return yearRange;
    },
    emFormParamsInit () {
      this.formData.publish_time = new Date(new Date().getTime() + 30 * 60 * 1000)
      this.emUserInfoResponse()
      this.techUserListResponse()
      this.serviceResponse()
      this.publishTypeResponse()
      this.getRollbackAction()
    },
    emEChartOpen() {
      this.$nextTick(() => { //  执行echarts方法
        this.lastTwoWeekChart()
        this.typePercentageChart()
        this.topServiceChart()
        this.topDeveloperChart()
      })
    },
    lastTwoWeekChart() {
      const lastTwoWeekChart = echarts.init(this.$refs.lastTwoWeekChart);
      lastTwoWeekChart.setOption({
        title: {text: '最近'+ this.statistics['ltw']['days'] +'紧急发布走势'},
        tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
        xAxis: {type: 'category', data: this.statistics['ltw']['date'], axisLabel: {interval: 0, rotate:"45",}},
        yAxis: {type: 'value'},
        series: [{name: "发布次数", type: 'line', smooth: true, data: this.statistics['ltw']['count'], itemStyle: {normal: {color:function(){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}},}}]
      });
    },
    typePercentageChart() {
      const typePercentageChart = echarts.init(this.$refs.typePercentageChart);
      typePercentageChart.setOption({
        title: {text: '紧急发布类型占比'},
        tooltip: {trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)'},
        legend: {top: 'bottom'},
        series: [{name: '紧急发布类型', type: 'pie', radius: [15, 170], center: ['50%', '50%'], itemStyle: {borderRadius: 8}, data: this.statistics['tp']}]
      });
    },
    topServiceChart() {
      const topServiceChart = echarts.init(this.$refs.topServiceChart);
      topServiceChart.setOption({
        title: {text: '紧急发布服务排行' + this.topInfo.topNStatistical.topServer},
        grid: {left: '3%', right: '4%', containLabel: true},
        tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
        xAxis: {type: 'category', data: this.statistics['ts']['service'], axisLabel: {interval: 0, rotate:"45",}},
        yAxis: {type: 'value'},
        series: [{name: "发布次数", type: 'bar', smooth: true, data: this.statistics['ts']['count']}]
      });
    },
    topDeveloperChart() {
      const topDeveloperChart = echarts.init(this.$refs.topDeveloperChart);
      topDeveloperChart.setOption({
        title: {text: 'Developer提交排行' + this.topInfo.topNStatistical.topDeveloper},
        grid: {left: '3%', right: '4%', containLabel: true},
        tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
        xAxis: {type: 'value', boundaryGap: [0, 0.01]},
        yAxis: {type: 'category', data: this.statistics['td']['name'], axisLabel: {interval: 0, rotate:0,}},
        series: [{name: "发布次数", type: 'bar', data: this.statistics['td']['count'], itemStyle: {normal: {color:function(){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}}}}]
      });
    },
    handleCurrentChange (val) {
      this.publishListResponse(val)
    },
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
          this.preData.dialogVisible = false
          this.$refs['emergencyChangeForm'].resetFields()
          done();
        })
        .catch(_ => {});
    },
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    async statisticsResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/statistics', {headers, timeout: 5000})
      this.statistics = apiResponse
    },
    async serviceResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/service_list', {headers, timeout: 5000})
      this.serviceNameOptions = apiResponse
    },
    async publishTypeResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/publish_type_list', {headers, timeout: 5000})
      this.emergencyPublishTypeOptions = apiResponse
    },
    async publishListResponse (page=1, pageSize=20) {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/publish?page='+page+'&page_size='+pageSize, {headers, timeout: 5000})
      this.emPublishDataResponse = apiResponse
      this.publishPage.emPublishCount = apiResponse['count']
    },
    async monthlyStatisticalResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/monthly_statistics', {headers, timeout: 5000})
      this.monthlyStatistical = apiResponse
    },
    async topInfoResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/top_info', {headers, timeout: 5000})
      this.topInfo = apiResponse
    },
    async techUserListResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/tech_user_list', {headers, timeout: 5000})
      this.techUserListDataResponse = apiResponse
    },
    async emUserInfoResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.put('naguri/em_api/tech_user_list', {"email": JSON.parse(window.localStorage.getItem('Admin-Token'))['email']}, {headers, timeout: 5000})
      this.formData.developer.users = this.formData.reviewer.users = this.formData.submitter.users = [apiResponse['user_id']]
    },
    async getRollbackAction () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/get_collect_type?type=2', {headers, timeout: 5000})
      this.rollbackOptions = apiResponse
    },
    async onPublishStatusResponse () {
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get('naguri/em_api/on_publish', {headers, timeout: 5000})
      this.onPublish = apiResponse
    },
    on_submit_form () {
      console.log(this.formData)
      const headers = commonOperator.parseNaguriHeader()
      this.$refs.emergencyChangeForm.validate(async valid => {
        if (!valid) return
        this.preData.submitLoading = true
        const { data: apiResponse } = await this.$axios.post('naguri/em_api/publish', this.formData, {headers, timeout: 5000}).catch((error) => {
          console.log(error)
          notificationTips('error', '提交失败，请检查表单内容！或联系 @Pauri')
          this.preData.submitLoading = false
        })
        console.log(apiResponse)
        this.submitFormResponse = apiResponse
        if (apiResponse.publish < 1) {
          messageTips('error', '提交失败，请检查表单内容！')
          this.preData.submitLoading = false
        } else {
          messageTips('success', '提交成功，请关注Slack审批！')
          this.$refs['emergencyChangeForm'].resetFields()
          this.sleep(500).then(() => {
            this.preData.submitLoading = false
            this.preData.dialogVisible = false
            this.reload()
          })
        }
      })
    }
  }
}
</script>
