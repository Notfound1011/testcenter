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
          <el-input size="small" v-model="searchFiled.symbol" placeholder="by symbol">
            <template slot="prepend">Symbol</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.quoteCurrency" placeholder="by quoteCurrency">
            <template slot="prepend">quoteCurrency</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.priceScale" placeholder="by priceScale">
            <template slot="prepend">priceScale</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.status" placeholder="by Status">
            <template slot="prepend">Status</template>
          </el-input>
          <el-tag>Count: {{ filterSymbolConfig.length }}</el-tag>
        </div>
        <el-table
          class="tableArea" size="small" height="100%" stripe border :data="filterSymbolConfig"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="symbol" prop="symbol" align="center" width="120"></el-table-column>
          <el-table-column label="code" prop="code" align="center"></el-table-column>
          <el-table-column label="type" prop="type" align="center" width="100"></el-table-column>
          <el-table-column label="displaySymbol" prop="displaySymbol" align="center" width="150"></el-table-column>
          <el-table-column label="indexSymbol" prop="indexSymbol" align="center"></el-table-column>
          <el-table-column label="markSymbol" prop="markSymbol" align="center"></el-table-column>
          <el-table-column label="fundingRateSymbol" prop="fundingRateSymbol" align="center"></el-table-column>
          <el-table-column label="fundingRate8hSymbol" prop="fundingRate8hSymbol" align="center"></el-table-column>
          <el-table-column label="contractUnderlyingAssets" prop="contractUnderlyingAssets" align="center"></el-table-column>
          <el-table-column label="settleCurrency" prop="settleCurrency" align="center"></el-table-column>
          <el-table-column label="quoteCurrency" prop="quoteCurrency" align="center"></el-table-column>
          <el-table-column label="tickSize" prop="tickSize" align="center"></el-table-column>
          <el-table-column label="priceScale" prop="priceScale" align="center"></el-table-column>
          <el-table-column label="ratioScale" prop="ratioScale" align="center"></el-table-column>
          <el-table-column label="pricePrecision" prop="pricePrecision" align="center"></el-table-column>
          <el-table-column label="baseCurrency" prop="baseCurrency" align="center"></el-table-column>
          <el-table-column label="status" prop="status" align="center"></el-table-column>
          <el-table-column label="tipOrderQty" prop="tipOrderQty" align="center"></el-table-column>
          <el-table-column label="listTime" prop="listTime" align="center"></el-table-column>
          <el-table-column label="majorSymbol" prop="majorSymbol" align="center"></el-table-column>
          <el-table-column label="defaultLeverage" prop="defaultLeverage" align="center"></el-table-column>
          <el-table-column label="fundingInterval" prop="fundingInterval" align="center"></el-table-column>
          <el-table-column label="maxLeverage" prop="maxLeverage" align="center"></el-table-column>
          <el-table-column label="maxOrderQtyRq" prop="maxOrderQtyRq" align="center"></el-table-column>
          <el-table-column label="maxPriceRp" prop="maxPriceRp" align="center"></el-table-column>
          <el-table-column label="minOrderValueRv" prop="minOrderValueRv" align="center"></el-table-column>
          <el-table-column label="minPriceRp" prop="minPriceRp" align="center"></el-table-column>
          <el-table-column label="qtyPrecision" prop="qtyPrecision" align="center"></el-table-column>
          <el-table-column label="qtyStepSize" prop="qtyStepSize" align="center"></el-table-column>
          <el-table-column label="tipOrderQtyRq" prop="tipOrderQtyRq" align="center"></el-table-column>
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
  name: "contractSymbolUsdt",
  components: {MsContainer, MsMainContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data() {
    return {
      apiEnv: 'fat',
      symbolConfig: [],
      searchFiled: {code: '', symbol: '', status: '', priceScale: '', quoteCurrency: ''},
      routerPath: this.$route.path.toString(),
    }
  },
  computed: {
    filterSymbolConfig() {
      return this.symbolConfig.filter((symbolConfigs) => {
        const codeMatch = this.searchFiled.code === '' || symbolConfigs.code === parseInt(this.searchFiled.code);
        const priceScaleMatch = this.searchFiled.priceScale === '' || symbolConfigs.priceScale === parseInt(this.searchFiled.priceScale);
        const quoteCurrencyMatch = this.searchFiled.quoteCurrency === '' || symbolConfigs.quoteCurrency === this.searchFiled.quoteCurrency;
        const symbolMatch = symbolConfigs.symbol.toLowerCase().includes(this.searchFiled.symbol.toLowerCase());
        const statusMatch = symbolConfigs.status.toLowerCase().includes(this.searchFiled.status.toLowerCase());
        return codeMatch && symbolMatch && statusMatch && priceScaleMatch && quoteCurrencyMatch;
      });
    },
  },
  created () {
    this.getSymbolConfig()
  },
  methods: {
    async getSymbolConfig (overrideEnv='') {
      const apiEnv = overrideEnv || this.apiEnv
      const { data: symbolConfigRes } = await this.$axios.get(
        `/pyServer/public/test-data/tools/get-symbol-config?env=${apiEnv}&symbol=BTC&getAll=true&symbolType=PerpetualV2`,
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
