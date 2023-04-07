<template>
  <ms-container>
    <ms-aside-container>
      <el-input v-model.trim="searchText" placeholder="搜索" size="small" @keydown.enter.native="filterData" @blur="filterData">
        <el-select v-model="displayType" slot="prepend" placeholder="请选择" style="width: 80px">
          <el-option label="类型" value="codeType"></el-option>
          <el-option label="名称" value="codeAlias"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="filterData"></el-button>
      </el-input>
      <!-- default-active 当前展开菜单的index, default-openeds是子菜单的index -->
      <el-menu :default-active="dataList.length > 0 ? dataList[0]['codeType'] : ''"
               :default-openeds="rawReviewList.length > 0 ? ['2'] : ['1']"
               :unique-opened="true" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">代码列表</span>
          </template>
          <el-menu-item :index="item.codeType" :key="item.codeType" v-for="item in dataList">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">{{ item[displayType] }}</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="2" v-if="rawReviewList.length > 0">
          <template slot="title">
            <i class="el-icon-document-checked"></i>
            <span slot="title">审核列表</span>
            <el-badge :value="rawReviewList.length" class="badge-item" />
          </template>
          <el-menu-item :index="item.codeType" :key="item.codeType" v-for="item in reviewList">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">{{ item[displayType] }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </ms-aside-container>

    <ms-main-container>
      <el-card>
        <writeCodeContent ref="writeCodeContent" />
      </el-card>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import MsAsideContainer from "@/business/components/common/components/MsAsideContainer";
import writeCodeContent from "@/business/components/api/writeCode/content.vue";

export default {
  components: {MsMainContainer, MsContainer, MsAsideContainer, writeCodeContent},
  name: "writeCode",

  data() {
    return {
      displayType: 'codeAlias',
      searchText: '',
      currentType: 'test1',
      addStatus: true,
      // 用于渲染到列表里的值
      dataList: [
        {codeType: 'test1', codeAlias: '干啥用的?', codeText: 'print("前端太难啦1!")', remark: '这个是备注哟'},
        {codeType: 'test2', codeAlias: '干啥用的2', codeText: 'print("前端太难啦2!")', remark: '这个是备注哟2'}
      ],
      reviewList: [],
      // 接口请求回来的原始值
      rawDataList: [
        {codeType: 'test1', codeAlias: '干啥用的?', codeText: 'print("前端太难啦1!")', remark: '这个是备注哟'},
        {codeType: 'test2', codeAlias: '干啥用的2', codeText: 'print("前端太难啦2!")', remark: '这个是备注哟2'}
      ],
      rawReviewList: []
    }
  },
  methods: {
    /**
     * 选择不同的脚本后,
     * @param newCurrentType
     */
    handleSelect(newCurrentType){
      this.$refs.writeCodeContent.downloadData(newCurrentType)
    },
    /**
     * 筛选器, 模糊筛选列表里的值
     */
    filterData(){
      this.addStatus = this.searchText === '';
      this.dataList = this.rawDataList.filter(data => !this.searchText || data[this.displayType].toLowerCase().includes(this.searchText.toLowerCase()))
      this.reviewList = this.rawReviewList.filter(data => !this.searchText || data[this.displayType].toLowerCase().includes(this.searchText.toLowerCase()))
    }
  }
}
</script>

<style scoped>
.Menu {
  border-right: 0;
}
.badge-item {
  margin-left: 8px;
}
</style>
