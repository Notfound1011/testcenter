<template>
  <ms-container>
    <ms-main-container class="main_container">
      <div class="left_container">
        <el-alert title="公告：Phemex站点导航上线啦😁" v-show="tips.status"
                  description="Phemex导航，现将常用站点归集，如有跳转失效或者新增更换，请联系QA！"
                  @close="tipsStatus('save')"
                  type="info" effect="dark" style="margin-bottom: 10px" show-icon></el-alert>
        <section :key="data.id" v-for="data in this.env_btn" class="btn_box">
          <p class="box_header">{{ data.btn_desc }}</p>
          <el-button :disabled="!env_btn.btn_status"
                     :key="env_btn.id"
                     v-for="env_btn in data.btn_info"
                     @click="openTarget(env_btn.btn_link)">{{ env_btn.btn_text }}</el-button>
        </section>
      </div>
      <div class="right_container">
        <section :key="item.id" v-for="item in this.low_priority_btn" class="btn_box">
          <p class="box_header">{{ item.btn_desc }}</p>
          <el-button :disabled="!env_btn.btn_status"
                     :key="env_btn.id"
                     v-for="env_btn in item.btn_info"
                     @click="openTarget(env_btn.btn_link)">{{ env_btn.btn_text }}</el-button>
        </section>
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
      env_btn: [],
      low_priority_btn: [],
      routerPath: this.$route.path.toString(),
      tips: {
        status: true
      },
    }
  },
  created() {
    this.tips.status = this.ctlTipsStatus('init', this.routerPath)
    this.init_btn_data()
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
    async init_btn_data () {
      const { data: codeRes } = await this.$axios.get('naguri/navi_api/navigation_list')
      this.env_btn = codeRes.env_btn
      this.low_priority_btn = codeRes.low_priority_btn
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 10px;
  border-radius: 5px;
  font-weight: bold;
  padding: 10px 10px 10px 10px;
}

.main_container{
  display: flex;
  background-color: #e6e6e6; //#4b1980
  flex-direction: row;
}

.left_container {
  min-height: 1096px;
  padding: 10px 0 0 0 ;
  width: 60%;
}

.right_container {
  min-height: 1096px;
  padding: 10px;
  width: 40%;
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
