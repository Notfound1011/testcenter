<template>
  <div>
    <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.spot.currency_init.title') }}</h3>
    <el-form :inline="true" :model="form" class="my-form">
      <el-form-item label="环境">
        <el-select v-model="form.env" placeholder="选择环境">
          <el-option v-for="item in envs" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Currency">
        <el-tooltip class="tooltip" effect="dark" content="Currency和批次二选一" placement="right">
          <i class="el-icon-question"/>
        </el-tooltip>
        <el-input v-model="form.currencies" placeholder="请输入currency，用逗号分隔" :disabled="batchOptionsEnabled"
                  class="el-input">
        </el-input>
      </el-form-item>
      <el-form-item label="批次">
        <el-tooltip class="tooltip" effect="dark" content='Currency和批次二选一' placement="right">
          <i class="el-icon-question"/>
        </el-tooltip>
        <el-select v-model="form.batch" placeholder="请选择批次" :disabled="currenciesEnabled"
                   clearable class="el-select">
          <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" :disabled="isButtonDisabled" @click="submitForm" class="el-button">
          {{ $t('commons.listing.listing_script.spot.currency_init.initialize') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CurrencyInit',
  data() {
    return {
      form: {
        env: 'fat2',
        currencies: '',
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
    currenciesEnabled() {
      return this.form.currencies !== '';
    },
    batchOptionsEnabled() {
      return this.form.batch !== '';
    },
    // 根据表单的值来判断按钮是否禁用
    isButtonDisabled() {
      // 如果表单中批次和环境都为空字符串，或者currency和环境都为空字符串，则按钮被禁用
      return this.form.env === '' || (this.form.batch === '' && this.form.currencies === '')
    }
  },
  methods: {
    submitForm() {
      // todo: 调用后端API
      // 例如 axios.post('/api/submit-form', this.form)
    },
  },
};
</script>

<style scoped>
.my-form .el-input {
  width: 250px;
}

.my-form .el-select {
  width: 250px;
}

.my-form .el-button {
  margin-right: 10px;
  margin-left: 10px;
}
</style>
