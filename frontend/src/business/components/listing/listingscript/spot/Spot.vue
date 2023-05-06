<template>
  <div>
    <el-card class="box-card">
      <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.contract.public_param') }}</h3>
      <el-form :inline="true" :model="form" class="my-form">
        <el-form-item label="环境">
          <el-select v-model="form.env" placeholder="选择环境">
            <el-option v-for="item in envs" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次">
          <el-tooltip class="tooltip" effect="dark" content='Currency和批次二选一' placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-select v-model="form.batch" placeholder="请选择批次" :disabled="currencyEnabled"
                     clearable class="el-select">
            <el-option v-for="item in batchOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
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
      </el-form>
    </el-card>
    <el-card class="box-card">
      <currency-init :form="form"></currency-init>
      <el-divider></el-divider>
      <fake-recharge :form="form"></fake-recharge>
    </el-card>
  </div>
</template>

<script>
import CurrencyInit from "@/business/components/listing/listingscript/spot/components/CurrencyInit.vue";
import FakeRecharge from "@/business/components/listing/listingscript/spot/components/FakeRecharge.vue";
import LeverageAndRiskLimit
  from "@/business/components/listing/listingscript/contract/components/LeverageAndRiskLimit.vue";

export default {
  name: "spot",
  components: {LeverageAndRiskLimit, FakeRecharge, CurrencyInit},

  data() {
    return {
      form: {
        env: 'fat2',
        currencies: '',
        batch: '',
        accounts: ''
      },
      envs: [
        {label: 'fat', value: 'fat'},
        {label: 'fat2', value: 'fat2'},
        {label: 'fat3', value: 'fat3'}
      ],
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
    currencyEnabled() {
      return this.form.currencies !== '';
    },
    batchOptionsEnabled() {
      return this.form.batch !== '';
    },
  },
  mounted() {
    // this.getBatchOptions()
  },
  methods: {
    // todo: 批次从接口获取  默认最新一个
    getBatchOptions() {
      this.$axios.get('/xxx/xxx',
        {params: {'type': 'contract'}}
      )
        .then(response => {
          this.batchOptions = response.body;
        })
        .catch(() => {
          this.$message({message: '接口返回值异常, 请联系开发者！！！', type: 'error'});
        });
    }
  }
}
</script>

<style scoped>
.my-form .el-input {
  width: 250px;
}

.my-form .el-select {
  width: 250px;
}

.box-card {
  margin: 10px;
}
</style>
