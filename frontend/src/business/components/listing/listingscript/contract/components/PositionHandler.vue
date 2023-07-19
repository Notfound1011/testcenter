<template>
  <div>
    <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.contract.position_handler.title') }}</h3>
    <el-form :inline="true" :model="form" class="my-form">
      <el-form-item>
        <el-radio-group v-model="type">
          <el-radio :label="1">开多仓</el-radio>
          <el-radio :label="2">开空仓</el-radio>
          <el-radio :label="3">全部平仓</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" :disabled="isButtonDisabled" @click="submitForm" class="el-button">
          {{ $t('commons.listing.listing_script.contract.position_handler.run') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-input type="textarea" v-model="result" :autosize="{ minRows: 4, maxRows: 20}" readonly></el-input>
  </div>
</template>

<script>
export default {
  name: 'PositionHandler',
  props: ['form'],
  data() {
    return {
      type: 1,
      result: ''
    };
  },
  computed: {
    // 根据表单的值来判断按钮是否禁用
    isButtonDisabled() {
      // 如果表单中批次和环境都为空字符串，或者currency和环境都为空字符串，则按钮被禁用
      return this.form.env === '' || (this.form.batch === '' && this.form.symbols === '')
    }
  },
  methods: {
    submitForm() {
      // todo: 调用后端API
      // 例如 axios.post('/api/submit-form', this.form)
      this.result = 'test result'
    },
  },
};
</script>

<style scoped>
.my-form .el-button {
  margin-right: 10px;
  margin-left: 10px;
}
</style>
