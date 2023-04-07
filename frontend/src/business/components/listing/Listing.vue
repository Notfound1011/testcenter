<template>
  <el-col>
    <listing-header-menus/>
    <div>
      <transition>
        <keep-alive>
          <router-view :baseUrl="baseUrl"/>
        </keep-alive>
      </transition>
    </div>
  </el-col>
</template>

<script>
import ListingHeaderMenus from "@/business/components/listing/head/ListingHeaderMenus.vue";
export default {
  name: "Listing",
  components: {ListingHeaderMenus},
  data() {
    return {
      baseUrl: "listing",
    }
  },
  methods: {
  },
}
</script>

<style scoped>

</style>
