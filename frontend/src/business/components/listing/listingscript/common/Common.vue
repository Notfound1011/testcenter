<template>
  <div>
    <google-login></google-login>
    <el-divider></el-divider>
    <sync-prod-info-docs></sync-prod-info-docs>
    <el-divider></el-divider>
    <verify-bitbucket></verify-bitbucket>
    <el-divider></el-divider>
    <order-book></order-book>
  </div>
</template>

<script>
import GoogleLogin from "@/business/components/listing/listingscript/common/components/GoogleLogin.vue";
import SyncProdInfoDocs from "@/business/components/listing/listingscript/common/components/SyncProdDocs.vue";
import VerifyBitbucket from "@/business/components/listing/listingscript/common/components/VerifyBitbucket.vue";
import OrderBook from "@/business/components/listing/listingscript/common/components/OrderBook.vue";

export default {
  name: "Common",
  components: {OrderBook, VerifyBitbucket, SyncProdInfoDocs, GoogleLogin}
}
</script>

<style scoped>

</style>
