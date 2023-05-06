<template>
  <div>
    <!--    <google-login></google-login>-->
    <!--    <el-divider></el-divider>-->
    <el-card class="box-card">
      <sync-prod-info-docs></sync-prod-info-docs>
      <el-divider></el-divider>
      <verify-bitbucket></verify-bitbucket>
      <el-divider></el-divider>
      <order-book></order-book>
      <el-divider></el-divider>
      <recent-trades></recent-trades>
    </el-card>
  </div>
</template>

<script>
import GoogleLogin from "@/business/components/listing/listingscript/common/components/GoogleLogin.vue";
import SyncProdInfoDocs from "@/business/components/listing/listingscript/common/components/SyncProdDocs.vue";
import VerifyBitbucket from "@/business/components/listing/listingscript/common/components/VerifyBitbucket.vue";
import OrderBook from "@/business/components/listing/listingscript/common/components/OrderBook.vue";
import RecentTrades from "@/business/components/listing/listingscript/common/components/RecentTrades.vue";

export default {
  name: "Common",
  components: {RecentTrades, OrderBook, VerifyBitbucket, SyncProdInfoDocs, GoogleLogin}
}
</script>

<style scoped>
.box-card {
  margin: 10px;
}
</style>
