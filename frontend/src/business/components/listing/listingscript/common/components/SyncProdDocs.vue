<template>
  <div>
    <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.common.sync_prod_info.title') }}</h3>
    <el-form :inline="true" ref="form" :model="form">
      <el-form-item label="类型" required :rules="rules" prop="option">
        <el-tooltip effect="dark" placement="top"
                    content="与产品信息文档对应关系：spot-->现货；contract-->USDT合约,正向USD合约,反向合约；currency-->资产参数">
          <el-select v-model="form.option" placeholder="请选择类型">
            <el-option v-for="(option, index) in options" :key="index" :label="option.label"
                       :value="option.value"></el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="批次" required :rules="rules" prop="batch">
        <el-input v-model="form.batch" placeholder="多个批次用,隔开"></el-input>
      </el-form-item>
      <el-form-item label="别名" required :rules="rules" prop="alias">
        <el-input v-model="form.alias" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :disabled="!isFormValid">同步并创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import pyRequest from "@/common/js/request";

export default {
  name: 'SyncProdInfoDocs',
  data() {
    return {
      form: {
        option: "",
        batch: "",
        alias: "",
        remark: ""
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
  computed: {
    isFormValid() {
      return (
        this.form.option !== '' && this.form.batch !== '' && this.form.alias !== ''
      );
    }
  },
  methods: {
    submitForm() {
      // 创建批次
      let requestBody = {
        dataType: this.form.option,
        batchKeywords: this.form.batch.split(','),
        batchAlias: this.form.alias,
      };
      if (this.form.remark !== "") {
        requestBody.remark = this.form.remark;
      }

      this.$refs['form'].validate(valid => {
        if (valid) {
          pyRequest.post("/test-data/tools/publish-coins/product-basic-data/create", requestBody).then(res => {
            this.$notify.success({
              title: "创建批次成功",
              message: res.data.msg
            });
          })
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
