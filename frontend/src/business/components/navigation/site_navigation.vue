<template>
  <ms-container>
    <ms-main-container>
      <el-alert title="公告：Phemex站点导航上线啦😁" v-show="tips.status"
                description="Phemex导航，现将常用站点归集，如有跳转失效或者新增更换，请联系QA！"
                @close="tipsStatus('save')"
                type="info" effect="dark" style="margin-bottom: 10px" show-icon></el-alert>
      <div class="main-container">
        <div class="left-container">
          <section :key="data.id" v-for="data in this.envBtn" class="btn_box">
            <p class="box_header">{{ data['btn_desc'] }}</p>
            <el-button :disabled="!env_btn['btn_status']"
                       :key="env_btn.id"
                       v-for="env_btn in data['btn_info']"
                       @click="openTarget(env_btn['btn_link'])">{{ env_btn['btn_text'] }}</el-button>
          </section>
        </div>
        <div class="right-container">
          <section :key="item.id" v-for="item in this.lowPriorityBtn" class="btn_box">
            <p class="box_header">{{ item['btn_desc'] }}</p>
            <el-button :disabled="!env_btn['btn_status']"
                       :key="env_btn.id"
                       v-for="env_btn in item['btn_info']"
                       @click="openTarget(env_btn['btn_link'])">{{ env_btn['btn_text'] }}</el-button>
          </section>
        </div>
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";

export default {
  name: "site_navigation",
  components: {MsMainContainer, MsContainer},
  data () {
    return {
      envBtn: [],
      lowPriorityBtn: [],
      routerPath: this.$route.path.toString(),
      tips: {
        status: true
      },
    }
  },
  created() {
    this.tips.status = this.ctlTipsStatus('init', this.routerPath)
    this.initBtnData()
  },
  methods: {
    ctlTipsStatus (type, routePath) {
      const key = routePath + '#tips'
      if (type === 'init') {
        return !window.localStorage.getItem(key)
      }
      if (type === 'save') {
        window.localStorage.setItem(key, 'false')
      }
    },
    openTarget (url) {
      window.open(url)
    },
    tipsStatus (type) {
      this.ctlTipsStatus(type, this.routerPath)
    },
    async initBtnData () {
      const { data: codeRes } = await this.$axios.get('naguri/navi_api/navigation_list')
      this.envBtn = codeRes['env_btn']
      this.lowPriorityBtn = codeRes['low_priority_btn']
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-container {
  height: 100%;
}
/deep/ .el-main {
  background-color: #e6e6e6; //#4b1980
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .main-container {
    display: flex;
  }
  .left-container {
    min-height: 1096px;
    padding: 10px 0 0 0 ;
    width: 60%;
  }
  .right-container {
    min-height: 1096px;
    padding: 10px;
    width: 40%;
  }
}
.el-button {
  margin-bottom: 10px;
  border-radius: 5px;
  font-weight: bold;
  padding: 10px 10px 10px 10px;
}
.btn_box{
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 10px;
}
.box_header {
  font: 500 20px CAPTION;
  border-bottom: 1px solid #d0d0d0;
  font-weight: bold;
  margin: 0 0 10px;
}
</style>
