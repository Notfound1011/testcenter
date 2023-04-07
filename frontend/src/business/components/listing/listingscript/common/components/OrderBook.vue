<template>
  <div>
    <h3>
      <i class="iconfont icon-lefenshichang"></i>{{ $t('commons.listing.listing_script.common.orderbook.title') }}
    </h3>
    <el-form :inline="true" :model="form" class="my-form">
      <el-form-item label="环境">
        <el-select v-model="form.env" placeholder="选择环境">
          <el-option v-for="item in envs" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币对">
        <el-tooltip class="tooltip" effect="dark" content="币对和批次二选一" placement="right">
          <i class="el-icon-question"/>
        </el-tooltip>
        <el-input v-model="form.symbols" placeholder="请输入symbols，用逗号分隔" :disabled="batchOptionsEnabled"
                  class="el-input">
        </el-input>
      </el-form-item>
      <el-form-item label="批次">
        <el-tooltip class="tooltip" effect="dark" content='币对和批次二选一' placement="right">
          <i class="el-icon-question"/>
        </el-tooltip>
        <el-select v-model="form.batch" placeholder="请选择批次" :disabled="symbolsEnabled"
                   clearable class="el-select">
          <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="深度">
        <el-input v-model="form.verifyLength" placeholder="摆单预期深度,不填默认100" class="el-input">
        </el-input>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" :disabled="isButtonDisabled" @click="subscribe" class="el-button">
          {{ $t('commons.listing.listing_script.common.orderbook.buttons.socketVerify') }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="el-button">
          {{ $t('commons.listing.listing_script.common.orderbook.buttons.apiVerify') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-input type="textarea" v-model="form.result" :autosize="{ minRows: 4, maxRows: 20}" readonly></el-input>
  </div>
</template>

<script>
export default {
  name: 'OrderBook',
  data() {
    return {
      websocket: null,
      form: {
        env: 'wss://fat2.phemex.com/ws',
        symbols: '',
        batch: '',
        result: '',
        verifyLength: ''
      },
      envs: [
        {label: 'fat2', value: 'wss://fat2.phemex.com/ws'},
        {label: 'ea', value: 'wss://ea.phemex.com/ws'},
        // {label: 'fat', value: 'wss://fat.phemex.com/ws'},
        // {label: 'fat3', value: 'wss://fat3.phemex.com/ws'}
      ],
      // todo: 批次从接口获取  默认最新一个
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
    symbolsEnabled() {
      return this.form.symbols !== '';
    },
    batchOptionsEnabled() {
      return this.form.batch !== '';
    },
    // 根据表单的值来判断按钮是否禁用
    isButtonDisabled() {
      // 如果表单中批次和环境都为空字符串，或者币对和环境都为空字符串，则按钮被禁用
      return this.form.env === '' || (this.form.batch === '' && this.form.symbols === '')
    }
  },
  methods: {
    subscribe() {
      if (!this.isButtonDisabled) {
        this.isButtonDisabled = true;
        this.websocket = new WebSocket(this.form.env);
        this.websocket.onopen = this.onWebSocketOpen;
        this.websocket.onerror = this.onWebSocketError;
        this.websocket.onclose = this.onWebSocketClose;
        setTimeout(() => {
          this.websocket.close();
        }, 7000);
      }
    },
    onWebSocketOpen() {
      console.log('WebSocket connection is open');
      // this.websocket.send('{"method": "tick.subscribe", "params": [".MUSDT"], "id": 1}');
      // todo: 根据批次batchOptions 来查找symbols
      let symbols
      if (this.form.symbols !== '') {
        symbols = this.form.symbols.split(',');
      } else {
        // axios调用接口，根据批次batchOptions 来查找symbols
      }
      symbols.forEach((symbol, index) => {
        const currentLabel = this.envs.find(item => item.value === this.form.env).label;
        const bookStr = this.getType(currentLabel, symbol) === "PerpetualV2" ? 'orderbook_p' : 'orderbook'
        const id = index + 2;
        const subscribe = `{"method": "${bookStr}.subscribe", "params": ["${symbol}", true], "id": ${id}}`;
        this.websocket.send(subscribe);
      });
      this.verifyOrderBook(this.form.verifyLength);
    },
    onWebSocketError(event) {
      console.error('WebSocket connection error', event);
    },
    onWebSocketClose(event) {
      console.log('WebSocket connection is closed', event);
      this.isButtonDisabled = false;
    },
    async verifyOrderBook(verifyLength) {
      verifyLength = verifyLength || 100;
      if (verifyLength <= 0) {
        throw new Error('verifyLength must be a positive number');
      }
      // 将symbols从字符串转换为数组
      let symbols = this.form.symbols.split(',');
      // 创建一个Set用于去重
      const resultSet = new Set();
      const failedList = [];
      const passedList = [];
      this.websocket.onmessage = event => {
        // 解析WebSocket接收到的消息
        const message = JSON.parse(event.data);
        // 解构message对象
        const {type, symbol, orderbook_p, book} = message;
        // 初始化result和detail
        let result, detail;

        // 如果消息类型不是snapshot或者symbol不在symbols数组中，则直接返回
        if (type !== 'snapshot' || !symbols.includes(symbol)) {
          return;
        }

        // 获取orderbook_p或者book数据
        const bookData = orderbook_p?.length > 0 ? orderbook_p : book;

        // 如果没有获取到bookData，则返回错误信息
        if (!bookData) {
          result = '数据结构不符合要求';
          this.$message({message: result, type: 'error'});
          return;
        }

        // 获取asks和bids数组
        const {asks, bids} = bookData;

        // 如果asks或者bids长度小于等于verifyLength，则验证失败
        if (asks.length <= verifyLength || bids.length <= verifyLength) {
          failedList.push(symbol)
          result = `${symbol}, 验证失败, asks_length = ${asks.length}, bids_length = ${bids.length}`;
          this.$message({message: result, type: 'warning'});
        } else {
          passedList.push(symbol)
          result = `${symbol}, asks_length = ${asks.length}, bids_length = ${bids.length}, length > ${verifyLength}, 验证通过;`;
        }

        // 记录result和detail到resultSet中，将symbol从symbols数组中删除
        detail = JSON.stringify(message);
        resultSet.add(`${result} | ${detail}`);
        this.form.result = [...resultSet].join('\n');
        // 从symbols数组中移除当前symbol
        symbols = symbols.filter(s => s !== symbol);
      };
      // 等待3秒钟，模拟异步操作的等待时间
      await new Promise(resolve => setTimeout(resolve, 3000));
      let msgFailed = '';
      let msgSuccess = '';
      if (symbols.length > 0 || failedList.length > 0) {
        msgFailed = `以下币对摆单深度验证失败??: ${failedList}`
        this.$message({message: msgFailed, type: 'error'});
      } else {
        msgSuccess = '全部币对均校验通过！'
        this.$message({message: msgSuccess, type: 'success'});
      }
      this.form.result = `汇总结果：${msgFailed}${msgSuccess}\n详细结果：${this.form.result}`;
    },

    getType(env, symbol) {
      const productsInfo = JSON.parse(localStorage.getItem("products-info"));
      const matchingProduct = productsInfo.find(product => product.env === env && product.symbols.some(s => s.symbol === symbol));
      if (matchingProduct) {
        const matchingSymbol = matchingProduct.symbols.find(s => s.symbol === symbol);
        return matchingSymbol.type;
      } else {
        console.log('Not found');
        return null;
      }
    }

  },
  destroyed() {
    this.websocket !== null ? this.websocket.close() : null;
  },
};

</script>

<style>
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

.tooltip {
  margin-right: 10px;
}
</style>
