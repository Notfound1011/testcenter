<template>
  <div>
    <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.common.sync_prod_info.title') }}</h3>
    <el-form :inline="true" ref="form" :model="form">
      <el-form-item label="类型" required :rules="rules" prop="option">
        <el-select v-model="form.option" placeholder="请选择类型">
          <el-option v-for="(option, index) in options" :key="index" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批次" required :rules="rules" prop="text">
        <el-input v-model="form.text" placeholder="多个批次用,隔开"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SyncProdInfoDocs',
  data() {
    return {
      form: {
        option: "",
        text: "",
      },
      options: [
        {label: "currency", value: "currency"},
        {label: "spot", value: "spot"},
        {label: "contract", value: "contract"},
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
          if (['', undefined, null].includes(this.form.text)) {
            errField.push('批次')
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
