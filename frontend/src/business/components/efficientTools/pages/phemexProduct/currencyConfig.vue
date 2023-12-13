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
          <el-input size="small" v-model="searchFiled.valueScale" placeholder="by valueScale">
            <template slot="prepend">valueScale</template>
          </el-input>
          <el-input size="small" v-model="searchFiled.status" placeholder="by Status">
            <template slot="prepend">Status</template>
          </el-input>
          <el-tag>Count: {{ filterSymbolConfig.length }}</el-tag>
        </div>
        <el-table
          class="tableArea" size="small" height="100%" border :data="filterSymbolConfig" stripe
          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="currencyCode" prop="code" align="center"></el-table-column>
          <el-table-column label="currencyName" prop="name" align="center" width="160"></el-table-column>
          <el-table-column label="currency" prop="currency" align="center"></el-table-column>
          <el-table-column label="displayCurrency" prop="displayCurrency" align="center" width="120"></el-table-column>
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
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import * as commonOperator from "@/common/naguri/naguri";
import {fullScreenLoading, stopFullScreenLoading} from "@/common/js/utils";

export default {
  name: "currencyConfig",
  components: {MsContainer, MsMainContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data() {
    return {
      apiEnv: 'fat',
      symbolConfig: [],
      searchFiled: {code: '', symbol: '', status: '', valueScale: '', currency: ''},
      routerPath: this.$route.path.toString(),
    }
  },
  computed: {
    filterSymbolConfig() {
      return this.symbolConfig.filter((currencyConfigs) => {
        const codeMatch = this.searchFiled.code === '' || currencyConfigs.code === parseInt(this.searchFiled.code);
        const valueScaleMatch = this.searchFiled.valueScale === '' || currencyConfigs.valueScale === parseInt(this.searchFiled.valueScale);
        const currencyMatch = currencyConfigs.currency.toLowerCase().includes(this.searchFiled.currency.toLowerCase());
        const statusMatch = currencyConfigs.status.toLowerCase().includes(this.searchFiled.status.toLowerCase());
        return codeMatch && currencyMatch && statusMatch && valueScaleMatch;
      });
    },
  },
  created () {
    this.getSymbolConfig()
  },
  methods: {
    async getSymbolConfig (overrideEnv='') {
      const loading = fullScreenLoading(this, 'loading...');
      const apiEnv = overrideEnv || this.apiEnv
      const { data: symbolConfigRes } = await this.$axios.get(
        `/pyServer/public/test-data/tools/get-currency-config?env=${apiEnv}&currency=BTC&getAll=true`,
      ).catch((error) => {
        commonOperator.messageTips('error', error)
        stopFullScreenLoading(loading,1);
      })
      this.symbolConfig = symbolConfigRes['data'];
      stopFullScreenLoading(loading,1);
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
