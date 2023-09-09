<template>
  <ms-container>
    <el-aside>
      <el-menu :default-active="activePage" router>
        <el-submenu :index="item['id'] + ''" v-for="item in allMenu" :key="item['id']">
          <template slot="title">
            <i :class="item['icon_class']"></i>
            <span>{{ item['menu_name'] }}</span>
          </template>
          <el-menu-item :index="subItem['menu_path']" v-for="subItem in item['sub_menus']" :key="subItem['parent_id']"
                        @click="saveClickMenu(subItem['menu_path'])">
            <template slot="title">
              <i :class="subItem['icon_class']"></i>
              <span>{{ subItem['menu_name'] }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import {notificationTips, parseNaguriHeader} from "@/business/components/report/emergencypublish/common";
export default {
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  name: "efficientTools",
  components: {MsMainContainer, MsContainer},

  data () {
    return {
      allMenu: [],
      activePage: ''
    }
  },
  created () {
    this.getAllMenu()
    if (window.localStorage.getItem('active_page')) {
      this.activePage = window.localStorage.getItem('active_page')
      this.$router.push(this.activePage)
    } else {
      this.saveClickMenu(this.$route.path)
    }
  },
  methods: {
    async getAllMenu () {
      const headers = parseNaguriHeader()
      const { data: menusResponse } = await this.$axios.get(
        'naguri/ef_api/efficient_menus',
        {headers, timeout: 5000}
      ).catch((error) => {
        console.log(error)
        notificationTips('error', 'menus exception pls contact @Pauri.')
      })
      this.allMenu = menusResponse
    },
    saveClickMenu (activePath) {
      window.localStorage.setItem('active_page', activePath)
      this.activePage = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  font-weight: bold;
  width: 260px !important;
  .el-menu {
    border-right: none;
  }
}
.el-main{
  overflow: auto;
  box-sizing: border-box;
  min-width: 1000px;
  min-height: 500px;
}
</style>
