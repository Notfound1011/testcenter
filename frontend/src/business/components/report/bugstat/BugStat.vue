<template>
  <ms-container>
    <ms-main-container v-loading="result.loading" style="background: #fbfbfb">
      <h2 style="margin-left: 20px;font-weight:bold">{{ "BUG统计" }}</h2>
      <el-form :inline="true" style="margin-left: 56%;margin-right: 2%;">
        <el-form-item label="选择时间">
          <el-tooltip style="margin-right: 10px;" effect="dark"
                      content="默认本年度，可点选时间区间或手动输入">
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-date-picker
            style='margin-left: 20px'
            :picker-options="pickerOptions"
            v-model="timePicker"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" style='margin-left: 10px'>{{
              $t('commons.adv_search.search')
            }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10">
        <el-col :span="23" class="grid-content">
          <el-card class="card">
            <dev-bug-stat ref="devBugStat" id="devBugStat" :qaCreatedBugJQL="qaCreatedBugJQL"
                          :ldapUser="ldapUser"></dev-bug-stat>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="11" class="grid-content">
          <el-card class="card">
            <bug-by-status-pie-stat ref="bugByStatusPieStat" id="bugByStatusPieStat" :bugTotal="bugTotal"
                                    :qaCreatedBugJQL="qaCreatedBugJQL"></bug-by-status-pie-stat>
          </el-card>
        </el-col>
        <el-col :span="12" class="grid-content">
          <el-card class="card">
            <bug-by-project-pie-stat ref="bugByProjectPieStat" id="bugByProjectPieStat" :bugTotal="bugTotal"
                                     :qaCreatedBugJQL="qaCreatedBugJQL"></bug-by-project-pie-stat>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="11" class="grid-content">
          <el-card class="card">
            <bug-trend-stat ref="bugTrendStat" id="bugTrendStat"
                            :qaCreatedBugJQL="qaCreatedBugJQL"></bug-trend-stat>
          </el-card>
        </el-col>
        <el-col :span="12" class="grid-content">
          <el-card class="card">
            <filter-bug-by-user ref="filterBugByUser" :qaCreatedBugJQL="qaCreatedBugJQL"></filter-bug-by-user>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="11" class="grid-content">
          <el-card class="card">
            <qa-bug-created-stat ref="qaBugCreatedStat" id="qaBugCreatedStat"
                                 :groupData="groupData" :group1="group1" :group2="group2" :group3="group3"
                                 :group4="group4" :group5="group5" :groupTotalData="groupTotalData"
                                 :qaCreatedBugJQL="qaCreatedBugJQL"></qa-bug-created-stat>
          </el-card>
        </el-col>
        <el-col :span="12" class="grid-content">
          <el-card class="card">
            <online-bug-rate ref="onlineBugRate" id="onlineBugRate" :percentage="percentage"
                             :onlineBugTotal="onlineBugTotal" :onlineBugJQL="onlineBugJQL"></online-bug-rate>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="11" class="grid-content">
          <el-card class="card">
            <qa-online-bug-rate :onlineBug="onlineBug" :qaBug="qaBug" :onlineBugJQL="onlineBugJQL"
                                :groupData="groupData" :group1="group1" :group2="group2" :group3="group3"
                                :group4="group4" :group5="group5" :groupTotalData="groupTotalData"
                                v-if="onlineBugFlag&&qaBugFlag"></qa-online-bug-rate>
          </el-card>
        </el-col>
        <el-col :span="12" class="grid-content">
          <el-card class="card">
            <online-bug-stat ref="onlineBugStat" id="onlineBugStat"
                             :groupData="groupData" :group1="group1" :group2="group2" :group3="group3"
                             :group4="group4" :group5="group5" :groupTotalData="groupTotalData"
                             :onlineBugJQL="onlineBugJQL"></online-bug-stat>
          </el-card>
        </el-col>
      </el-row>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsContainer from "@/business/components/common/components/MsContainer";
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import BugTrendStat from "@/business/components/report/bugstat/components/bugTrendStat";
import FilterBugByUser from "@/business/components/report/bugstat/components/filterBugByUser";
import BugByProjectPieStat from "@/business/components/report/bugstat/components/bugByProjectPieStat";
import BugByStatusPieStat from "@/business/components/report/bugstat/components/bugByStatusPieStat";
import OnlineBugRate from "@/business/components/report/bugstat/components/onlineBugRate";
import QaBugCreatedStat from "@/business/components/report/bugstat/components/qaBugCreatedStat";
import OnlineBugStat from "@/business/components/report/bugstat/components/onlineBugStat";
import {ChangeDecimalToPercentage, fullScreenLoading, jiraAuth, stopFullScreenLoading} from "@/common/js/utils";
import QaOnlineBugRate from "@/business/components/report/bugstat/components/qaOnlineBugRate";
import DevBugStat from "@/business/components/report/bugstat/components/devBugStat";

export default {
  name: "BugStat",
  components: {
    BugTrendStat,
    DevBugStat,
    QaOnlineBugRate,
    OnlineBugStat,
    QaBugCreatedStat,
    OnlineBugRate,
    BugByStatusPieStat,
    BugByProjectPieStat,
    FilterBugByUser,
    MsMainContainer,
    MsContainer
  },
  mounted() {
    this.search()
  },
  data() {
    return {
      jira_auth: jiraAuth(),
      result: {},
      currentYear: new Date().getFullYear().toString(),
      timePicker: [this.startOfCurrentQuarter(), new Date().toISOString().split('T')[0]],
      pickerMinDate: "",//第一次选中的时间
      pickerOptions: {
        onPick: (obj) => {
          this.pickerMinDate = new Date(obj.minDate).getTime();
        },
        disabledDate: (time) => {
          if (this.pickerMinDate) {
            const day1 = 366 * 24 * 3600 * 1000
            let maxTime = this.pickerMinDate + day1
            let minTime = this.pickerMinDate - day1
            return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      bugTotal: 0,
      onlineBugTotal: 0,
      percent: 0,
      onlineBugData: null,
      qaBugData: null,
      onlineBugFlag: false,
      qaBugFlag: false,
      ldapUser: null,
      groupData: null,
      group1: null,
      group2: null,
      group3: null,
      group4: null,
      group5: null,
      groupTotalData: null
    }
  },
  computed: {
    percentage() {
      return ChangeDecimalToPercentage(this.onlineBugTotal / this.bugTotal);
    },
    qaBug() {
      return this.qaBugData
    },
    onlineBug() {
      return this.onlineBugData
    },
    qaCreatedBugJQL() {
      return this.buildJQL("issuetype = Bug AND status != Cancelled AND Developer is not EMPTY AND creator in membersOf(QA)", this.timePicker);
    },
    onlineBugJQL() {
      return this.buildJQL("project = \"CS Technical Issues\" AND IssueTypes = Bug AND (labels in (qa-issue) OR Tester in membersOf(QA))", this.timePicker);
    },
  },
  methods: {
    buildJQL(baseJQL, timeRange) {
      if (timeRange && timeRange.length === 2) {
        return `${baseJQL} AND "created" >= "${timeRange[0]}" AND "created" <= "${timeRange[1]}"`;
      }
      return `${baseJQL} AND created > startOfYear()`;
    },

    async search() {
      const loading = fullScreenLoading(this);
      try {
        await Promise.all([
          this.qaCreatedBugQuery(this.qaCreatedBugJQL),
          this.onlineBugQuery(this.onlineBugJQL),
          this.ldapUserQuery(),
          this.qaUserGroupQuery()
        ]);
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        stopFullScreenLoading(loading, 2000);
      }
    },

    async jiraQuery(JQL, fields) {
      const maxResults = 1000;
      const url = `/jira/rest/api/2/search?jql=${encodeURIComponent(JQL)}&maxResults=${maxResults}`;
      const instance = this.$axios.create({
        headers: {'Authorization': this.jira_auth}
      });

      const initResponse = await instance.get(`${url}&fields=creator`);
      const total = initResponse.data.total;
      const totalPages = Math.ceil(total / maxResults);

      const promises = Array.from({length: totalPages}, (_, i) =>
        instance.get(`${url}&fields=${fields}&startAt=${i * maxResults}`)
      );

      const responses = await Promise.all(promises);
      return responses.flatMap(response => response.data.issues);
    },

    async qaCreatedBugQuery(JQL) {
      const fields = 'creator,assignee,status,issuetype,project,customfield_10300,created';
      const data = await this.jiraQuery(JQL, fields);
      this.bugTotal = data.length;
      this.qaBugData = data;
      this.qaBugFlag = true;
      this.updateQaBugStats(data);
    },

    async onlineBugQuery(JQL) {
      const fields = 'creator,assignee,status,issuetype,customfield_10406';
      const data = await this.jiraQuery(JQL, fields);
      this.onlineBugTotal = data.length;
      this.onlineBugData = data;
      this.onlineBugFlag = true;
      this.updateOnlineBugStats(data);
    },

    updateQaBugStats(data) {
      this.$refs.qaBugCreatedStat.qaBugCreatedStat(data);
      this.$refs.bugByStatusPieStat.bugByStatus(data);
      this.$refs.bugByProjectPieStat.bugByProject(data);
      this.$refs.filterBugByUser.filterBugByUser(data);
      this.$refs.filterBugByUser.filterBugByProject(data)
      this.$refs.devBugStat.devBugStat(data);
      this.$refs.bugTrendStat.recentlyCreated(data);
    },

    updateOnlineBugStats(data) {
      this.$refs.onlineBugStat.onlineBugStat(data);
      this.$refs.onlineBugRate.onlineBugRate(data);
    },

    async ldapUserQuery() {
      let url = "dataFactory/ldap/getUsers"
      this.$axios.get(url).then(res => {
          this.ldapUser = res.data.data
        }
      )
    },

    async qaUserGroupQuery() {
      let url = "dataFactory/group/list"
      this.$axios.get(url).then(res => {
          let qaUserGroup = res.data.data
          this.groupData = qaUserGroup[0].content.split(",")
          this.group1 = qaUserGroup[1].content.split(",")
          this.group2 = qaUserGroup[2].content.split(",")
          this.group3 = qaUserGroup[3].content.split(",")
          this.group4 = qaUserGroup[4].content.split(",")
          this.group5 = qaUserGroup[5].content.split(",")
          this.groupTotalData = qaUserGroup[6].content.split(",").map(Number)
        }
      )
    },

    startOfYear() {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      startOfYear.setMinutes(startOfYear.getMinutes() - startOfYear.getTimezoneOffset());
      return startOfYear.toISOString().substring(0, 10);
    },

    startOfCurrentQuarter() {
      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3);
      const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
      startOfQuarter.setMinutes(startOfQuarter.getMinutes() - startOfQuarter.getTimezoneOffset());

      // 检查当前日期是否在季度开始后的第一个月内
      if (now - startOfQuarter < 30 * 24 * 60 * 60 * 1000) { // 30天的毫秒数
        // 如果是，则计算上一个季度的开始日期
        const startOfPreviousQuarter = new Date(startOfQuarter);
        startOfPreviousQuarter.setMonth(startOfPreviousQuarter.getMonth() - 3);
        return startOfPreviousQuarter.toISOString().substring(0, 10);
      }

      // 否则返回当前季度的开始日期
      return startOfQuarter.toISOString().substring(0, 10);
    }
  }
}
</script>

<style scoped>

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  margin: 10px;
}

.card {
  overflow: auto;
}
</style>
