<template>
  <div>
    <el-card class="box-card">
      <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.contract.account_param') }}</h3>
      <el-form :inline="true" ref="form" :model="account" class="my-form">
        <el-form-item label="用户名" prop="username" :rules="rules">
          <el-input v-model="account.username" placeholder="用户名" class="el-input">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="rules">
          <el-input v-model="account.password" placeholder="密码" class="el-input">
          </el-input>
        </el-form-item>
        <el-form-item label="2fa" prop="twofa" :rules="rules">
          <el-input v-model="account.twofa" placeholder="2fa" class="el-input">
          </el-input>
        </el-form-item>
        <el-form-item label="secret" prop="secret" :rules="rules">
          <el-input v-model="account.secret" placeholder="secret" class="el-input">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="el-button" :disabled="isSaveDisabled" @click="save">保存</el-button>
          <el-button type="primary" class="el-button" @click="confirmReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <h3><i class="el-icon-document"></i> {{ $t('commons.listing.listing_script.contract.public_param') }}</h3>
      <el-form :inline="true" :model="form" class="my-form">
        <el-form-item label="环境">
          <el-select v-model="form.env" placeholder="选择环境">
            <el-option v-for="item in envs" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次">
          <el-tooltip class="tooltip" effect="dark" content='币对和批次二选一' placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-select v-model="form.batch" placeholder="请选择批次" :disabled="symbolsEnabled"
                     clearable class="el-select">
            <el-option v-for="item in batchOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="币对">
          <el-tooltip class="tooltip" effect="dark" content="币对和批次二选一" placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-input v-model="form.symbols" placeholder="请输入symbol，用逗号分隔" :disabled="batchOptionsEnabled"
                    class="el-input">
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <position-handler :form="form"></position-handler>
      <el-divider></el-divider>
      <leverage-and-risk-limit :form="form"></leverage-and-risk-limit>
    </el-card>
  </div>
</template>

<script>

import PositionHandler from "@/business/components/listing/listingscript/contract/components/PositionHandler.vue";
import LeverageAndRiskLimit
  from "@/business/components/listing/listingscript/contract/components/LeverageAndRiskLimit.vue";
import {isValid} from "js-base64";

export default {
  name: "Contract",
  components: {LeverageAndRiskLimit, PositionHandler},

  data() {
    return {
      account: {
        username: '',
        password: '',
        twofa: '',
        secret: ''
      },
      form: {
        env: 'fat2',
        symbols: '',
        batch: ''
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
      ],
      // 表单验证内容
      rules: {required: true, message: "缺少必填参数", trigger: ['change', 'blur']},
    };
  },
  computed: {
    symbolsEnabled() {
      return this.form.symbols !== '';
    },
    batchOptionsEnabled() {
      return this.form.batch !== '';
    },
    isSaveDisabled() {
      return Object.values(this.account).every(value => value === '');
    }
  },
  mounted() {
    this.getBatchOptions();
    this.loadAccountInfo();
  },
  methods: {
    // todo: 批次从接口获取  默认最新一个
    getBatchOptions() {
      this.$axios.get('/pyServer/public/test-data/tools/publish-coins/product-basic-data/search',
        {params: {'dataType': 'contract'}}
      )
        .then(response => {
          let data = response.data.data;
          // console.log(this.batchOptions)
          // 提取 batchAlias 和 symbol
          const batchAliases = data.map(item => item.batchAlias);
          const symbols = data.flatMap(item => item.productData.map(product => product.symbol));

          // 创建映射对象数组
          const mapping = data.map(item => ({
            batchAlias: item.batchAlias,
            symbols: item.productData.map(product => product.symbol)
          }));

          console.log(mapping);

        })
        .catch(() => {
          this.$message({message: '接口返回值异常, 请联系开发者！！！', type: 'error'});
        });
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 将账号信息保存到缓存中
          localStorage.setItem("account-info", JSON.stringify(this.account));
          this.$success(`自定义测试账号保存成功`);
        } else {
          this.$warning(`缺少必填参数, 请补充后提交, 如果有特殊需求, 请联系开发者.`);
        }
      })
    },
    confirmReset() {
      this.$confirm('确认重置表单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除缓存中的数据
          localStorage.removeItem("account-info");
          this.account = this.createEmptyAccount();
          this.$success(`自定义测试账号重置成功`);
        })
        .catch(() => {
          // 取消重置操作
        });
    },
    loadAccountInfo() {
      const cachedAccount = localStorage.getItem("account-info");
      if (cachedAccount) {
        this.account = JSON.parse(cachedAccount);
      } else {
        this.account = this.createEmptyAccount();
      }
    },
    createEmptyAccount() {
      return {
        username: '',
        password: '',
        twofa: '',
        secret: ''
      };
    },
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
