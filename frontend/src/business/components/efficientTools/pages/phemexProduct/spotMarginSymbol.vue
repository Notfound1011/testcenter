<template>
  <ms-container>
    <ms-main-container>
      <div class="configTabContainer">
        <div class="searchArea">
          <el-radio-group v-model="apiEnv" size="small" @change="getSymbolConfig(apiEnv)">
            <el-radio-button border label="fat">fat</el-radio-button>
            <el-radio-button border label="fat2">fat2</el-radio-button>
            <el-radio-button border label="fat3">fat3</el-radio-button>
            <el-radio-button border label="prod">prod</el-radio-button>
          </el-radio-group>
          <el-input size="small" v-model="searchFiled.code" placeholder="by Code">
            <template slot="prepend">Code</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.currency" placeholder="by Currency">
            <template slot="prepend">Currency</template>
          </el-input>
          <el-tag>Count: {{ filterSymbolConfig.length }}</el-tag>
        </div>
        <el-table
          class="tableArea" size="small" height="100%" border :data="filterSymbolConfig" stripe
          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="currency" prop="currency" align="center"></el-table-column>
          <el-table-column label="code" prop="code" align="center"></el-table-column>
          <el-table-column label="leverage" prop="leverage" align="center"></el-table-column>
          <el-table-column label="markDelete" prop="markDelete" align="center">
            <template slot-scope="scope"><span v-if="scope.row.markDelete">1</span><span v-else>0</span></template>
          </el-table-column>
          <el-table-column label="coefficient" prop="coefficient" align="center"></el-table-column>
          <el-table-column label="defaultHourlyInterestRate" prop="defaultHourlyInterestRate" align="center"></el-table-column>
          <el-table-column label="minAmountToBorrowPerAccount" prop="minAmountToBorrowPerAccount" align="center"></el-table-column>
          <el-table-column label="defaultMaxAmountToBorrowPerAccount" prop="defaultMaxAmountToBorrowPerAccount" align="center"></el-table-column>
          <el-table-column label="maxAmountToBorrow" prop="maxAmountToBorrow" align="center"></el-table-column>
          <el-table-column label="liqFeeRate" prop="liqFeeRate" align="center"></el-table-column>
          <el-table-column label="priceCoefficientInAdl" prop="priceCoefficientInAdl" align="center"></el-table-column>
        </el-table>
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import * as commonOperator from "@/business/components/report/emergencypublish/common";

export default {
  name: "spotMarginSymbol",
  components: {MsContainer, MsMainContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data() {
    return {
      apiEnv: 'fat',
      symbolConfig: [],
      searchFiled: {code: '', currency: '',},
      routerPath: this.$route.path.toString(),
    }
  },
  computed: {
    filterSymbolConfig() {
      return this.symbolConfig.filter((symbolConfigs) => {
        const codeMatch = this.searchFiled.code === '' || symbolConfigs.code === parseInt(this.searchFiled.code);
        const currencyMatch = symbolConfigs.currency.toLowerCase().includes(this.searchFiled.currency.toLowerCase());
        return codeMatch && currencyMatch;
      });
    },
  },
  created () {
    this.getSymbolConfig()
  },
  methods: {
    async getSymbolConfig (overrideEnv='') {
      const useEnv = overrideEnv || this.apiEnv
      const { data: symbolConfigRes } = await this.$axios.get(
        `/pyServer/public/test-data/tools/get-spot-margin-currency-config?env=${useEnv}&currency=BTC&getAll=true`,
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      this.symbolConfig = symbolConfigRes['data'];
    }
  }
}
</script>

<style lang="less" scoped>
.configTabContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  .tableArea {
    background: transparent;
    overflow:auto;
    margin-top: 10px
  }
  .searchArea {
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
    .el-tag {
      margin-left: auto;
      font-weight: bold;
      font-size: 20px;
    }
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
    /deep/ .el-input-group__prepend {
      padding: 0 10px !important;
    }
    .el-radio-group {
      margin-right: 10px;
    }
  }
}
</style>
