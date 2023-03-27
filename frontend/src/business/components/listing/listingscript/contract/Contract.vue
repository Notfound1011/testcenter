<template>
  <div>
    <el-divider></el-divider>
  </div>
</template>

<script>
import GoogleLogin from "@/business/components/listing/listingscript/common/components/GoogleLogin.vue";
import SyncProdInfoDocs from "@/business/components/listing/listingscript/common/components/SyncProdDocs.vue";

export default {
  name: "spot",
  components: {SyncProdInfoDocs, GoogleLogin}
}
</script>

<style scoped>

</style>
