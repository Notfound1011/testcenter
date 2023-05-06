<template>
  <div>
    <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.spot.fake_recharge.title') }}</h3>
    <el-form :inline="true" :model="form" class="my-form">
      <el-form-item label="充值账号">
        <el-input v-model="form.accounts" placeholder="不填默认自动化账号的uid" class="el-input">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isButtonDisabled" @click="submitForm" class="el-button">
          {{ $t('commons.listing.listing_script.spot.fake_recharge.fake_recharge') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FakeRecharge',
  props: ['form'],
  data() {
    return {}
  },
  computed: {
    // 根据表单的值来判断按钮是否禁用
    isButtonDisabled() {
      // 如果表单中批次和环境都为空字符串，或者currency和环境都为空字符串，则按钮被禁用
      return this.form.env === '' || (this.form.batch === '' && this.form.currencies === '')
    }
  },
  methods: {
    submitForm() {
      this.recharge(this.form.accounts)
    },
    recharge(accounts) {
      accounts = accounts || '924432,922277,922159,922162'
      console.log(accounts)
      // todo: 调用后端API
      // 例如 axios.post('/api/submit-form', this.form)
    }
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
