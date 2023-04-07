<template>
  <div>
    <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.contract.public_param') }}</h3>
    <el-form :inline="true" :model="form" class="my-form">
      <el-form-item label="环境">
        <el-select v-model="form.env" placeholder="选择环境">
          <el-option v-for="item in envs" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币对">
        <el-tooltip class="tooltip" effect="dark" content="symbols和批次二选一" placement="right">
          <i class="el-icon-question"/>
        </el-tooltip>
        <el-input v-model="form.symbols" placeholder="请输入currency，用逗号分隔" :disabled="batchOptionsEnabled"
                  class="el-input">
        </el-input>
      </el-form-item>
      <el-form-item label="批次">
        <el-tooltip class="tooltip" effect="dark" content='币对和批次二选一' placement="right">
          <i class="el-icon-question"/>
        </el-tooltip>
        <el-select v-model="form.batch" placeholder="请选择批次" :disabled="symbolsEnabled"
                   clearable class="el-select">
          <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider>下方验证</el-divider>
    <position-handler :form="form"></position-handler>
    <el-divider></el-divider>
    <leverage-and-risk-limit :form="form"></leverage-and-risk-limit>
  </div>
</template>

<script>

import PositionHandler from "@/business/components/listing/listingscript/contract/components/PositionHandler.vue";
import LeverageAndRiskLimit
  from "@/business/components/listing/listingscript/contract/components/LeverageAndRiskLimit.vue";

export default {
  name: "spot",
  components: {LeverageAndRiskLimit, PositionHandler},

  data() {
    return {
      form: {
        env: 'fat2',
        symbols: '',
        batch: ''
      },
      envs: [
        {label: 'fat', value: 'fat'},
        {label: 'fat2', value: 'fat2'},
        {label: 'fat3', value: 'fat3'}
      ],
      // todo: 批次从接口获取  默认最新一个
      batchOptions: [
        {label: '批次1', value: 'batch1'},
        {label: '批次2', value: 'batch2'},
        {label: '批次3', value: 'batch3'},
        {label: '批次4', value: 'batch4'},
        {label: '批次5', value: 'batch5'},
      ]
    };
  },
  computed: {
    symbolsEnabled() {
      return this.form.symbols !== '';
    },
    batchOptionsEnabled() {
      return this.form.batch !== '';
    },
  },
}
</script>

<style scoped>
.my-form .el-input {
  width: 250px;
}

.my-form .el-select {
  width: 250px;
}
</style>
