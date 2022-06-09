<template>
  <ms-container>
    <ms-aside-container>
      <!--router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
      <el-menu router :default-active='$route.path' class="Menu" active-text-color="rgb(0, 0, 255)"
               :default-openeds="open_list" :unique-opened="true">
        <el-submenu index="1">
          <template v-slot:title>
            <i class="el-icon-location"></i>
            <span>{{ $t('api_test.data_factory.title') }}</span>
          </template>
          <el-menu-item :index="'/api/dataFactory/account'">
            <i class="el-icon-s-custom"></i>
            <span slot="title">{{ $t('api_test.data_factory.account_related') }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </ms-aside-container>
    <ms-main-container>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import MsAsideContainer from "@/business/components/common/components/MsAsideContainer";
import {jenkinsAuth} from "@/common/js/utils";

export default {
  components: {MsMainContainer, MsContainer, MsAsideContainer},
  name: "jobScheduler",

  data() {
    return {
      open_list: ["1"],
    }
  },
  methods: {}
}
</script>

<style scoped>
.Menu {
  border-right: 0;
}
</style>
