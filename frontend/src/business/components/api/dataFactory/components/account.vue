<template>
  <div>
    <h1 style="margin-left: 20px">{{ $t('api_test.data_factory.account_deposit') }}</h1>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="环境">
        <el-select v-model="form.env" placeholder="选择环境" style='width: 200px'>
          <el-option
            v-for="item in envList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站点">
        <el-select v-model="site" placeholder="选择站点" style='width: 200px' disabled>
          <el-option
            v-for="item in ['phemex']"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="form.amount" placeholder="输入金额, 无需放大精度."></el-input>
      </el-form-item>
      <el-form-item label="UID列表">
        <el-input v-model="form.uidListString" placeholder="多个用,隔开"></el-input>
      </el-form-item>
      <el-form-item label="币种列表">
        <el-input v-model="form.currencyListString" placeholder="多个用,隔开" :disabled="form.allCurrency"></el-input>
      </el-form-item>
      <el-form-item label="充值所有币">
        <el-switch v-model="form.allCurrency"></el-switch>
      </el-form-item>
      <el-form-item label="结果">
        <el-input type="textarea" v-model="form.result" :autosize="{ minRows: 2, maxRows: 20}" readonly></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">充 值</el-button>
        <el-button type="primary" @click="reset">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {popUpReminder} from "@/common/js/utils";

export default {
  name: "account",
  data() {
    return {
      form: {
        env: '',
        amount: '',
        uidListString: '',
        currencyListString: '',
        allCurrency: false,
        result: ''
      },
      envList: ['testnet', 'fat1', 'fat2', 'fat3', 'fat4', 'fat5'],
      site: 'phemex'
    }
  },
  methods: {
    onSubmit() {
      const that = this;
      that.$axios.post("/pyServer/Tools/SpotFakeRecharge", that.form)
        .then(res => {
          console.log(res.data)
          that.form.result = JSON.stringify(res.data, null, 4)
          popUpReminder(this, '假充值成功!!', '', 'teal', 'info')
        }).catch(() => {
        popUpReminder(this, '假充值失败!!')
      })
    },
    reset() {
      this.form = {
        env: '',
        amount: '',
        uidListString: '',
        currencyListString: '',
        allCurrency: false,
        completion: false,
        result: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
