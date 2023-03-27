<template>
  <div>
    <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.common.verify_bitbucket.title') }}</h3>
    <el-form :inline="true" ref="form" :model="form">
      <el-form-item label="类型" required :rules="rules" prop="option">
        <el-select v-model="form.option" placeholder="请选择类型">
          <el-option v-for="(option, index) in types" :key="index" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="环境" required :rules="rules" prop="env">
        <el-select v-model="form.env" placeholder="请选择环境">
          <el-option v-for="(option, index) in envs" :key="index" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'VerifyBitbucket',
  data() {
    return {
      form: {
        option: "",
        env: "",
      },
      types: [
        {label: "currency", value: "currency"},
        {label: "spot", value: "spot_symbol"},
        {label: "contract", value: "contract_symbol"},
      ],
      envs: [
        {label: "fat2", value: "fat2"},
        {label: "fat", value: "fat"},
        {label: "fat3", value: "fat3"},
        {label: "ea", value: "ea"},
        {label: "prod", value: "prod"},
      ],
      // 表单验证内容
      rules: {
        requiredCheck: {required: true, message: "缺少必填参数", trigger: ['change', 'blur']}
      },
    };
  },
  methods: {
    submitForm() {
      // 调用后端API
      // 例如 axios.post('/api/submit-form', this.form)
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log('表单验证通过')
        } else {
          let errField = [];
          if (['', undefined, null].includes(this.form.option)) {
            errField.push('类型')
          }
          if (['', undefined, null].includes(this.form.env)) {
            errField.push('环境')
          }
          this.$warning(`${errField.join(', ')} 尚未补充, 请补充后提交, 如果有特殊需求, 请联系开发者.`);
        }
      })
    },
  },
};
</script>

<style scoped>

</style>
