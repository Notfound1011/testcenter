<template>

  <ms-container>
    <ms-aside-container>
      <!--router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
      <el-menu router :default-active='$route.path' class="Menu" :default-openeds="open_list" :unique-opened="true">
        <el-menu-item :index="'/listing/script/common'">
          <i class="el-icon-menu"></i>
          <span>{{ $t('commons.listing.listing_script.common.title') }}</span>
        </el-menu-item>
        <el-menu-item :index="'/listing/script/spot'">
          <i class="iconfont icon-BTC"></i>
          <span>{{ $t('commons.listing.listing_script.spot.title') }}</span>
        </el-menu-item>
        <el-menu-item :index="'/listing/script/contract'">
          <i class="iconfont icon-ETH"></i>
          <span>{{ $t('commons.listing.listing_script.contract.title') }}</span>
        </el-menu-item>
      </el-menu>
    </ms-aside-container>
    <ms-main-container class="listing-container">
      <keep-alive>
        <el-row :gutter="10">
          <el-col :span="24" class="grid-content">
            <router-view v-if="!hideCard"/>
          </el-col>
        </el-row>
      </keep-alive>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import MsAsideContainer from "@/business/components/common/components/MsAsideContainer";

export default {
  components: {MsMainContainer, MsContainer, MsAsideContainer},
  name: "jobScheduler",

  data() {
    return {
      open_list: ["1"],
      envs: [
        {"env": "fat", "host": "api10-fat.phemex.com"},
        {"env": "fat2", "host": "api10-fat2.phemex.com"},
        {"env": "fat3", "host": "api10-fat3.phemex.com"},
        {"env": "ea", "host": "api10-ea.phemex.com"},
        {"env": "prod", "host": "api10.phemex.com"}
      ]
    }
  },
  computed: {
    hideCard() {
      return this.$route.meta.hideCard;
    }
  },
  created() {
    this.getProductsPlus()
  },
  methods: {
    async getProductsPlus() {
      // 从本地存储中获取所有已知的产品信息
      const data = JSON.parse(localStorage.getItem("products-info") || "[]");

      // 遍历所有环境
      for (const env of this.envs) {
        try {
          // 获取产品信息版本号
          const res1 = await this.$axios.get(this.getProductVersionUrl(env.host), this.setHeaders());
          const md5New = res1.data.data.md5Checksum;

          // 查找本地存储中是否已存在该环境的产品信息
          const index = data.findIndex(item => item.env === env.env);
          const md5Old = index >= 0 ? data[index].md5Checksum : null;
          // 比较版本号，如果版本号不同或者不存在本地存储中，就重新获取该环境的产品信息
          if (res1.status === 200 && (md5New !== md5Old || index < 0)) {
            const res2 = await this.$axios.get(this.getProductsUrl(env.host), this.setHeaders());
            if (res2.status === 200) {
              // 从响应数据中提取所有产品的符号和类型，存储在结果数组中
              const results = res2.data.data.perpProductsV2.concat(res2.data.data.products)
                .map(item => ({symbol: item.symbol, type: item.type}));
              // 创建一个新的产品信息对象，包括环境、MD5校验和以及所有产品的symbol和type
              const newObject = {env: env.env, md5Checksum: res2.data.data.md5Checksum, symbols: results};
              if (index >= 0) {
                // 覆盖已有的产品信息
                data[index] = newObject;
              } else {
                // 将新的产品信息对象添加到 data 数组中
                data.push(newObject);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }

      // 如果有新的产品信息，就将它们添加到本地存储中
      if (data.length !== 0) {
        localStorage.setItem("products-info", JSON.stringify([...data]));
      }
    },
    // 获取产品信息版本号的 URL
    getProductVersionUrl(host) {
      return `https://${host}/public/products-plus-version`;
    },
    // 获取产品信息的 URL
    getProductsUrl(host) {
      return `https://${host}/public/products-plus`;
    },
    // 设置请求头
    setHeaders() {
      return {headers: {"bid": Math.random()}};
    }

  }
}
</script>

<style scoped>
.listing-container {
  /* 或者使用以下代码设置背景图片 */
  background-image: url("~@/assets/white.jpg"); /* 设置背景图片路径 */
  background-position: center;
  background-repeat: no-repeat; /* 设置图片不重复 */
  background-size: cover; /* 将背景图片缩放到完全覆盖元素 */
}

.Menu {
  border-right: 0;
}
</style>

