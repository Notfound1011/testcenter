<template>
  <div>
    <el-row>
      <el-col class="form_area">
        <el-card>
          <h1 style="margin-left: 20px">{{ $t('api_test.data_factory.account_deposit') }}</h1>
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="环境" prop="env">
              <el-radio-group v-model="form.env" size="medium">
                <el-radio-button border label="testnet">testnet</el-radio-button>
                <el-radio-button border label="fat1">fat</el-radio-button>
                <el-radio-button border label="fat2">fat2</el-radio-button>
                <el-radio-button border label="fat3">fat3</el-radio-button>
              </el-radio-group>
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {popUpReminder} from "@/common/js/utils";

export default {
  name: "account",
  data() {
    return {
      form: {
        env: 'fat1',
        amount: '',
        uidListString: '',
        currencyListString: '',
        allCurrency: false,
        result: ''
      },
      site: 'phemex'
    }
  },
  methods: {
    onSubmit() {
      const that = this;
      that.$axios.post("/pyServer/public/test-data/tools/spot-fake-recharge", that.form)
        .then(res => {
          console.log(res.data)
          that.form.result = JSON.stringify(res.data, null, 4)
          popUpReminder(this, '假充值成功!!', '', 'info')
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

<style lang="less" scoped>
/deep/.el-form-item__label {
  font-weight: bold;
}
/deep/.el-card__header{
  padding: 16px 18px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  font-size: 15px;
}
/deep/.el-card__body {
  padding: 6px 10px;
  min-height: 330px;
}
.form_area{
  padding-top: 20px;
  width: 50%;
  min-width: 500px;
  margin-left: 20px;
  height: 100%;
}
</style>
