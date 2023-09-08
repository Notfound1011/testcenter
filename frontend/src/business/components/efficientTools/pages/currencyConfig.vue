<template>
  <ms-container>
    <ms-main-container>
      <el-tabs type="border-card" class="configTabContainer">
        <el-tab-pane label="Currency">
          <div class="table-area">
            <!-- <div class="search-area">
              <el-input style="width: 300px" size="small" v-model="searchText" placeholder="input search text."></el-input>
            </div> -->
            <el-table size="small" height="95%" :data="currencyPageNationData" highlight-current-row
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}" border
                      stripe style="background: transparent; overflow:auto">
              <el-table-column label="code" prop="code" align="center" width="auto"></el-table-column>
              <el-table-column label="name" prop="name" align="center" width="160"></el-table-column>
              <el-table-column label="currency" prop="currency" align="center"></el-table-column>
              <el-table-column label="displayCurrency" prop="displayCurrency" align="center"></el-table-column>
              <el-table-column label="valueScale" prop="valueScale" align="center"></el-table-column>
              <el-table-column label="needAddrTag" prop="needAddrTag" align="center"></el-table-column>
              <el-table-column label="inAssetsDisplay" prop="inAssetsDisplay" align="center"></el-table-column>
              <el-table-column label="perpetual" prop="perpetual" align="center"></el-table-column>
              <el-table-column label="stableCoin" prop="stableCoin" align="center"></el-table-column>
              <el-table-column label="assetsPrecision" prop="assetsPrecision" align="center"></el-table-column>
              <el-table-column label="status" prop="status" align="center"></el-table-column>
              <el-table-column label="minValueEv" prop="minValueEv" align="center"></el-table-column>
              <el-table-column label="maxValueEv" prop="maxValueEv" align="center" width="160"></el-table-column>
            </el-table>
            <el-pagination
              class="currencyConfigPageNation" background
              @current-change="handleCurrentChange"
              :current-page="pageNation.currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageNation.pageSize"
              layout=" prev, pager, next"
              :total="currencyConfig.length"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Chain Settings" disabled>Spot Margin Symbol Config</el-tab-pane>
        <el-tab-pane label="Spot Symbol" disabled>Spot Symbol Config</el-tab-pane>
        <el-tab-pane label="Contract Symbol(USD/ETH/BTC)" disabled>Spot Symbol Config</el-tab-pane>
        <el-tab-pane label="Contract Symbol(USDT)" disabled>Spot Symbol Config</el-tab-pane>
        <el-tab-pane label="Spot Margin Symbol" disabled>Spot Margin Symbol Config</el-tab-pane>
      </el-tabs>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import * as commonOperator from "@/business/components/report/emergencypublish/common";

export default {
  name: "currencyConfig",
  components: {MsContainer, MsMainContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data() {
    return {
      formData: {
        env: 'fat'
      },
      searchText: '',
      pageNation: {
        currentPage: 1, pageSize: 30
      },
      currencyConfig: [],
      routerPath: this.$route.path.toString(),
    }
  },
  computed: {
    currencyPageNationData() {
      const startIndex = (this.pageNation.currentPage - 1) * this.pageNation.pageSize;
      const endIndex = startIndex + this.pageNation.pageSize;
      return this.currencyConfig.slice(startIndex, endIndex);
    },
  },
  created () {
    this.getCurrencyConfig()
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNation.currentPage = val;
    },
    async getCurrencyConfig () {
      const { data: currencyConfigRes } = await this.$axios.get(
        `/pyServer/public/test-data/tools/get-currency-config?env=${this.form.env}&currency=BTC&getAll=true`,
        // `naguri/ef_api/mock?env=${this.formData.env}&currency=BTC&getAll=true`,
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      console.log(currencyConfigRes)
      this.currencyConfig = currencyConfigRes['data']
    },
  }
}
</script>

<style lang="less" scoped>
.configTabContainer{
  margin-top: 10px
}
.table-area{
  height: calc(88vh - 66px);
}
.currencyConfigPageNation{
  margin-top: 10px;
}
</style>
