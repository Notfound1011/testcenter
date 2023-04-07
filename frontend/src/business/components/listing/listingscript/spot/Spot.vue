<template>
  <div>
    <currency-init></currency-init>
    <el-divider></el-divider>
    <fake-recharge></fake-recharge>
  </div>
</template>

<script>
import CurrencyInit from "@/business/components/listing/listingscript/spot/components/CurrencyInit.vue";
import FakeRecharge from "@/business/components/listing/listingscript/spot/components/FakeRecharge.vue";

export default {
  name: "spot",
  components: {FakeRecharge, CurrencyInit},
}
</script>

<style scoped>

</style>
