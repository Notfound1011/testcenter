<template>
  <ms-container>
    <ms-aside-container>
      <!--router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
      <el-menu router :default-active='$route.path' class="jobSchedulerMenu" active-text-color="rgb(0, 0, 255)"
               :default-openeds="open_list" :unique-opened="true">
        <el-submenu index="1">
          <template v-slot:title>
            <i class="el-icon-location"></i>
            <span>{{ $t('i18n.jobScheduler') }}</span>
          </template>
          <el-menu-item :index="'/api/jobScheduler/analysis'">
            <i class="el-icon-pie-chart"></i>
            <span slot="title"> {{ $t('api_test.job_scheduler.analysis') }}</span>
          </el-menu-item>
          <el-menu-item :index="'/api/jobScheduler/runJobs'">
            <i class="el-icon-video-play"></i>
            <span slot="title"> {{ $t('api_test.job_scheduler.run_jobs') }}</span>
          </el-menu-item>
          <el-menu-item :index="'/api/jobScheduler/reports'">
            <i class="el-icon-document"></i>
            <span slot="title"> {{ $t('api_test.job_scheduler.reports') }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </ms-aside-container>
    <ms-main-container>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import MsAsideContainer from "@/business/components/common/components/MsAsideContainer";
import {jenkinsAuth, noRepeat} from "@/common/js/utils";

export default {
  components: {MsMainContainer, MsContainer, MsAsideContainer},
  name: "jobScheduler",
  created() {
    this.timer = setInterval(() => {
      setTimeout(this.setJenkinsInfo, 0)
    }, 1000 * 1800)
  },
  activated() {
    this.setJenkinsInfo()
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
  data() {
    return {
      JenkinsJobList: [],
      json: {
        Jenkins_Crumb: ''
      },
      open_list: ["1"],
      jenkins_auth: jenkinsAuth()
    }
  },
  methods: {
    async setJenkinsInfo() {
      try {
        // 获取 Jenkins Crumb
        const crumbRes = await this.$axios.get("/jenkins/crumbIssuer/api/xml", {
          params: {'xpath': 'concat(//crumbRequestField,":",//crumb)'},
          headers: {'Authorization': this.jenkins_auth}
        });
        if (crumbRes.status === 200) {
          this.json.Jenkins_Crumb = crumbRes.data.split(":")[1];
          localStorage.setItem("JenkinsInfo", JSON.stringify(this.json));
        } else {
          throw new Error('Failed to retrieve Jenkins Crumb');
        }
        // 使用获取到的 Jenkins Crumb 获取 job 列表
        const jobListRes = await this.$axios.post("/jenkins/api/json?tree=jobs[name,url,description,builds[number,result,duration,timestamp,url]{0,1}]", null, {
          headers: {
            'Authorization': this.jenkins_auth,
            'Jenkins-Crumb': this.json.Jenkins_Crumb // 注意这里使用已经设置好的 Jenkins_Crumb
          }
        });
        if (jobListRes.status === 200) {
          const datas = jobListRes.data.jobs;

          // 先按照构建的时间戳进行排序
          datas.sort((a, b) => {
            const aTimestamp = (a.builds && a.builds.length > 0) ? a.builds[0].timestamp : 0;
            const bTimestamp = (b.builds && b.builds.length > 0) ? b.builds[0].timestamp : 0;
            return bTimestamp - aTimestamp; // 降序排序
          });
          // 然后将每个任务的名称添加到 JenkinsJobList 数组中
          this.JenkinsJobList = datas.map(job => job.name);
          this.json.JenkinsJobList = noRepeat(this.JenkinsJobList);
          localStorage.setItem("JenkinsInfo", JSON.stringify(this.json));
        } else {
          throw new Error('Failed to retrieve job list');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>

<style scoped>
.jobSchedulerMenu {
  border-right: 0;
}
</style>
