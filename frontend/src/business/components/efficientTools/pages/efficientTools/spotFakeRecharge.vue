<template>
  <div>
    <el-row>
      <el-col class="form_area">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="card_header">{{ $t('api_test.data_factory.account_deposit') }}</span>
          </div>
          <el-form ref="form_ref" :model="form" :rules="form_rule" label-width="150px">
            <!--<el-form-item label="Environment" prop="env">
              <el-radio-group v-model="form.env" size="medium">
                <el-radio-button border label="testnet" disabled>testnet</el-radio-button>
                <el-radio-button border label="fat1">fat</el-radio-button>
                <el-radio-button border label="fat2" disabled>fat2</el-radio-button>
                <el-radio-button border label="fat3" disabled>fat3</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Phemex Site" prop="site">
              <el-radio-group v-model="site" size="small">
                <el-radio-button border label="phemex">PhemexGL</el-radio-button>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="等价USDT金额" prop="amount">
              <el-input type="number" v-model="form.amount" placeholder="baseCureency, 输入金额, 无需放大精度."></el-input>
            </el-form-item>
            <el-form-item label="UID列表" prop="uidListString">
              <el-input v-model="form.uidListString" placeholder="多个用,隔开"></el-input>
            </el-form-item>
            <el-form-item label="币种列表" prop="currencyListString">
              <el-select style="width: 100%" multiple filterable clearable v-model="form.currencyListString">
                <el-option
                  v-for="item in currencyConfig"
                  :key="item.currency"
                  :label="`${item.currency} - ${item.name} - ${item.code}`"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="常用币种" prop="recommendCurrency">
              <el-button
                v-for="currency in suggestCurrency"
                :key="currency" plain size="small"
                @click="toggleCurrency(currency)">
                {{ currency }}
              </el-button>
            </el-form-item>
            <!-- <el-form-item label="充值所有币">
              <el-switch v-model="form.allCurrency"></el-switch>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="onSubmit">充 值</el-button>
              <!-- <el-button type="primary" @click="reset">重 置</el-button> -->
            </el-form-item>
            <pre class="code-container">{{ res_result }}</pre>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import * as commonOperator from "@/business/components/report/emergencypublish/common";

export default {
  name: "account",
  data() {
    return {
      form: {
        env: 'fat',
        amount: '',
        uidListString: '',
        currencyListString: [],
        allCurrency: false,
      },
      res_result: '',
      form_rule: {
        amount: [{ required: true, message: 'must input amount pls.', trigger: 'change' }],
        uidListString: [{ required: true, message: 'must input uid pls.', trigger: 'change' }],
        currencyListString: [{ required: true, message: 'must input currency pls.' , trigger: 'change'}],
      },
      currencyConfig: {},
      site: 'phemex',
      suggestCurrency: ['USD', 'USDT', 'USDC', 'BTC', 'ETH', 'TRX', 'BRZ', 'TRY', 'XRP'],
      routerPath: this.$route.path.toString(),
    }
  },
  created() {
    this.getCurrencyConfig()
    this.form = commonOperator.initCrucialFromData(this.routerPath, this.form)
    this.res_result = commonOperator.initCrucialResultData(this.routerPath)
  },
  methods: {
    toggleCurrency(currency) {
      const index = this.form.currencyListString.indexOf(currency);
      if (index === -1) {
        this.form.currencyListString.push(currency);
      } else {
        this.form.currencyListString.splice(index, 1);
      }
    },
    async getCurrencyConfig () {
      const { data: currencyConfig } = await this.$axios.get(
        `/pyServer/public/test-data/tools/get-currency-config?env=${this.form.env}&currency=BTC&getAll=true`,
        // `naguri/ef_api/mock?env=${this.form.env}&currency=BTC&getAll=true`,
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      })
      this.currencyConfig = currencyConfig['data']
    },
    onSubmit() {
      commonOperator.saveCrucialData(this.routerPath, this.form, null);
      this.$refs.form_ref.validate(async (valid) => {
        if (!valid) return;
        this.$axios.post("/pyServer/public/test-data/tools/spot-fake-recharge", this.form)
        // this.$axios.post("naguri/ef_api/mock", this.form)
          .then(res => {
            this.res_result = res.data
            commonOperator.messageTips('success', '假充值成功!!')
            commonOperator.saveCrucialData(this.routerPath, null, res.data);
          }).catch(() => {
          commonOperator.messageTips('error', '假充值失败!!')
        })
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
      }
      this.res_result = ''
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
.card_header{
  font-weight: bold;
}
.el-form{
  margin-top: 10px;
}
.code-container {
  flex: 1;
  background-color: #242a2e;
  color: #ffffff;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 14px;
  padding: 10px;
  border-radius: 10px;
  overflow: auto;
  max-height: calc(39vh - 100px) !important
}
</style>
