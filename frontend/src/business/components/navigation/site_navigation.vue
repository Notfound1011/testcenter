<template>
  <div class="main_container">
    <div class="left_container">
      <el-alert title="公告：Phemex站点导航上线啦😁" v-show="tips.status"
                description="Phemex导航，现将常用站点归集，如有跳转失效或者新增更换，请联系QA！"
                @close="tipsStatus('save')"
                type="info" effect="dark" style="margin-bottom: 10px" show-icon></el-alert>
      <section :key="data.Id" v-for="data in this.env_btn" class="btn_box">
        <p class="box_header">{{ data.btnDesc }}</p>
        <el-button :disabled="!envBtn.btnStatus"
                   :key="envBtn.Id"
                   v-for="envBtn in data.btnInfo"
                   @click="openTarget(envBtn.btnLink)">{{ envBtn.btnText }}</el-button>
      </section>
    </div>
    <div class="right_container">
      <section :key="item.Id" v-for="item in this.low_priority_btn" class="btn_box">
        <p class="box_header">{{ item.btnDesc }}</p>
        <el-button :disabled="!envBtn.btnStatus"
                   :key="envBtn.Id"
                   v-for="envBtn in item.btnInfo"
                   @click="openTarget(envBtn.btnLink)">{{ envBtn.btnText }}</el-button>
      </section>
    </div>
  </div>
</template>

<script>
import { btn_data, tipsStatus } from '@/business/components/navigation/btn_data'
export default {
  name: "site_navigation",
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
    this.tips.status = tipsStatus('init', this.routerPath)
    this.env_btn = btn_data().envBtn
    this.low_priority_btn = btn_data().lowPriorityBtn
  },
  methods: {
    openTarget (url) {
      window.open(url)
    },
    tipsStatus (type) {
      tipsStatus(type, this.routerPath)
    },
  }
}
</script>

<style lang="less" scoped>
.el-button {
  //border: 1px solid #ccc;
  //border-color: #000;
  margin-bottom: 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  padding: 10px 10px 10px 10px;
  margin-left: 5px;
}

.main_container{
  background-color: #f4f4f5; //#4b1980
  display: flex;
  position: fixed;
  overflow-x: hidden;
}

.left_container {
  min-height: 1200px;
  padding: 18px 8px;
  width: 55%;
}

.right_container {
  min-height: 1200px;
  padding: 18px 8px;
  flex: 1;
}

.btn_box{
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 10px;
}

.box_header {
  font: 500 20px CAPTION;
  border-bottom: 1px solid #f1f4f9;
  font-weight: bold;
  margin: 0 0 10px;
}

</style>
