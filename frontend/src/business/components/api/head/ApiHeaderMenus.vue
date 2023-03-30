<template>
  <div id="menu-bar" v-if="isRouterAlive">
    <el-row type="flex" :gutter="0">
      <project-change :project-name="currentProject"/>
      <el-col :span="20">
        <el-menu class="header-menu" :unique-opened="true" mode="horizontal" router :default-active='currentPath'>

          <el-menu-item :index="'/api/home'" v-if="isVisible()">
            {{ $t("i18n.home") }}
          </el-menu-item>

          <el-menu-item :index="'/api/testCaseRecord'" v-permission="['PROJECT_API_CASE_RECORD:READ']">
            {{ $t("i18n.testCaseRecord") }}
          </el-menu-item>

          <el-menu-item :index="'/api/jobScheduler'" v-permission="['PROJECT_JOB_SCHEDULER:READ']">
            {{ $t("i18n.jobScheduler") }}
          </el-menu-item>

          <el-menu-item :index="'/api/dataFactory'">
            {{ $t('api_test.data_factory.title') }}
          </el-menu-item>

          <el-menu-item :index="'/api/definition'" v-permission="['PROJECT_API_DEFINITION:READ']" v-if="isVisible()">
            {{ $t("i18n.definition") }}
          </el-menu-item>

          <el-menu-item :index="'/api/automation'" v-permission="['PROJECT_API_SCENARIO:READ']" v-if="isVisible()">
            {{ $t("i18n.automation") }}
          </el-menu-item>

          <el-menu-item :index="'/api/automation/report'" v-permission="['PROJECT_API_REPORT:READ']" v-if="isVisible()">
            {{ $t("i18n.report") }}
          </el-menu-item>

          <el-menu-item :index="'/api/autoTestAccount'" v-permission="['PROJECT_API_REPORT:READ']">
            {{ $t("i18n.autoTestAccount") }}
          </el-menu-item>

          <el-menu-item :index="'/api/globalVariablesForAutoTest'" v-permission="['PROJECT_API_REPORT:READ']">
            {{ $t("i18n.globalVariablesForAutoTest") }}
          </el-menu-item>
<!--          <el-menu-item :index="'/api/writeCode'" v-permission="['PROJECT_API_REPORT:READ']">-->
<!--            {{ $t("i18n.writeCode") }}-->
<!--          </el-menu-item>-->
        </el-menu>
      </el-col>
    </el-row>
  </div>

</template>

<script>

import MsRecentList from "../../common/head/RecentList";
import MsShowAll from "../../common/head/ShowAll";
import MsCreateButton from "../../common/head/CreateButton";
import ProjectChange from "@/business/components/common/head/ProjectSwitch";
import {mapGetters} from "vuex";
import {PROJECT_ID, PROJECT_NAME} from "@/common/js/constants";

export default {
  name: "MsApiHeaderMenus",
  components: {MsCreateButton, MsShowAll, MsRecentList, ProjectChange},
  data() {
    return {
      currentPath: '',
      isRouterAlive: true,
      apiTestProjectPath: '',
      currentProject: ''
    };
  },
  watch: {
    '$route': {
      immediate: true,
      handler(to) {
        let path = to.path.split("/", 4);
        this.currentPath = '/' + path[1] + '/' + path[2];
        if (path[3] === "report") {
          this.currentPath = this.currentPath + '/' + path[3];
        }
      }
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    // 判断sessionStorage中的PROJECT_NAME值是否为"接口测试"
    isVisible() {
      return sessionStorage.getItem(PROJECT_NAME) === '接口测试';
    }
  },
  mounted() {

  },
  beforeDestroy() {

  }
};

</script>

<style scoped>
#menu-bar {
  border-bottom: 1px solid #E6E6E6;
  background-color: #FFF;
}

.menu-divider {
  margin: 0;
}

.blank_item {
  display: none;
}

.deactivation >>> .el-submenu__title {
  border-bottom: white !important;
}

.el-menu-item {
  padding: 0 10px;
}

</style>
