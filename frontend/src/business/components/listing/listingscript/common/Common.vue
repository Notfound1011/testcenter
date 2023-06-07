<template>
  <!--    <google-login></google-login>-->
  <!--    <el-divider></el-divider>-->
  <el-card class="box-card">
    <sync-prod-info-docs></sync-prod-info-docs>
    <el-divider></el-divider>
    <verify-bitbucket></verify-bitbucket>
    <el-divider></el-divider>
    <order-book :batchOptions="batchOptions"></order-book>
    <el-divider></el-divider>
    <recent-trades :batchOptions="batchOptions"></recent-trades>
  </el-card>
</template>

<script>
import GoogleLogin from "@/business/components/listing/listingscript/common/components/GoogleLogin.vue";
import SyncProdInfoDocs from "@/business/components/listing/listingscript/common/components/SyncProdDocs.vue";
import VerifyBitbucket from "@/business/components/listing/listingscript/common/components/VerifyBitbucket.vue";
import OrderBook from "@/business/components/listing/listingscript/common/components/OrderBook.vue";
import RecentTrades from "@/business/components/listing/listingscript/common/components/RecentTrades.vue";
import LeverageAndRiskLimit
  from "@/business/components/listing/listingscript/contract/components/LeverageAndRiskLimit.vue";

export default {
  name: "Common",
  components: {LeverageAndRiskLimit, RecentTrades, OrderBook, VerifyBitbucket, SyncProdInfoDocs, GoogleLogin},
  data() {
    return {
      batchOptions: []
    };
  },
  mounted() {
    this.getBatchOptions()
  },
  methods: {
    getBatchOptions() {
      this.$axios.get('/pyServer/public/test-data/tools/publish-coins/product-basic-data/search',
        {
          params: {'dataType': 'spot'}
        })
        .then(response => {
          let data = response.data.data;
          // console.log(this.batchOptions)
          // 提取 batchAlias 和 symbol
          const batchAliases = data.map(item => item.batchAlias);
          const symbols = data.flatMap(item => item.productData.map(product => product.symbol));

          // 创建映射对象数组
          this.batchOptions = data.map(item => ({
            label: item.batchAlias,
            value: item.productData.map(product => product.symbol).join(',')
          }));

          console.log(this.batchOptions);

        })
        .catch(() => {
          this.$message({message: '接口返回值异常, 请联系开发者！！！', type: 'error'});
        });
    }
  }
}
</script>

<style scoped>
.box-card {
  margin: 10px;
}
</style>
