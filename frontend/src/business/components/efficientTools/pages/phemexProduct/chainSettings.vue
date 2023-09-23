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
          <el-input size="small" v-model="searchFiled.currencyCode" placeholder="by currencyCode">
            <template slot="prepend">currencyCode</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.currency" placeholder="by Currency">
            <template slot="prepend">Currency</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.chainName" placeholder="by chainName">
            <template slot="prepend">chainName</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.chainId" placeholder="by chainId">
            <template slot="prepend">chainId</template>
          </el-input>
          <el-tag>Count: {{ filterSymbolConfig.length }}</el-tag>
        </div>
        <el-table
          class="tableArea" size="small" height="100%" border :data="filterSymbolConfig" stripe
          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="chainId" prop="chainId" align="center"></el-table-column>
          <el-table-column label="chain" prop="chain" align="center"></el-table-column>
          <el-table-column label="chainName" prop="chainName" align="center" width="90"></el-table-column>
          <el-table-column label="addrExtra" prop="addrExtra" align="center"></el-table-column>
          <el-table-column label="assetsPrecision" prop="assetsPrecision" align="center"></el-table-column>
          <el-table-column label="chainTokenUrl" prop="chainTokenUrl" align="center"></el-table-column>
          <el-table-column label="contractName" prop="contractName" align="center" width="320"></el-table-column>
          <el-table-column label="currency" prop="currency" align="center"></el-table-column>
          <el-table-column label="currencyCode" prop="currencyCode" align="center"></el-table-column>
          <el-table-column label="depositConfirmationNo" prop="depositConfirmationNo" align="center"></el-table-column>
          <el-table-column label="depositMinAmount" prop="depositMinAmount" align="center"></el-table-column>
          <el-table-column label="depositOpen" prop="depositOpen" align="center"></el-table-column>
          <el-table-column label="isDelayDepositWithManual" prop="isDelayDepositWithManual" align="center"></el-table-column>
          <el-table-column label="permanentlyClosed" prop="permanentlyClosed" align="center"></el-table-column>
          <el-table-column label="withdrawFixFeeEv" prop="withdrawFixFeeEv" align="center"></el-table-column>
          <el-table-column label="withdrawMinAmountEv" prop="withdrawMinAmountEv" align="center"></el-table-column>
          <el-table-column label="withdrawOpen" prop="withdrawOpen" align="center"></el-table-column>
          <el-table-column label="withdrawPrecision" prop="withdrawPrecision" align="center"></el-table-column>
          <el-table-column label="withdrawRatioFee" prop="withdrawRatioFee" align="center"></el-table-column>
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
  name: "chainSettings",
  components: {MsContainer, MsMainContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data() {
    return {
      apiEnv: 'fat',
      symbolConfig: [],
      searchFiled: {currencyCode: '', currency: '', chainName: '', chainId: ''},
      routerPath: this.$route.path.toString(),
    }
  },
  computed: {
    filterSymbolConfig() {
      return this.symbolConfig.filter((currencyConfigs) => {
        const codeMatch = this.searchFiled.currencyCode === '' || currencyConfigs.currencyCode === parseInt(this.searchFiled.currencyCode);
        const chainIdMatch = this.searchFiled.chainId === '' || currencyConfigs.chainId === parseInt(this.searchFiled.chainId);
        const currencyMatch = currencyConfigs.currency.toLowerCase().includes(this.searchFiled.currency.toLowerCase());
        const chainNameMatch = currencyConfigs.chainName.toLowerCase().includes(this.searchFiled.chainName.toLowerCase());
        return codeMatch && currencyMatch && chainIdMatch && chainNameMatch;
      });
    },
  },
  created () {
    this.getSymbolConfig()
  },
  methods: {
    async getSymbolConfig (overrideEnv='') {
      const headers = commonOperator.parseNaguriHeader()
      const apiEnv = overrideEnv || this.apiEnv
      const { data: symbolConfigRes } = await this.$axios.get(
        'naguri/ef_api/chain_settings?env=' + apiEnv,
        {headers, timeout: 5000}
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
