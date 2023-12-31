<template>
  <div>
    <h3>
      <i class="iconfont icon-lefenshichang"></i>{{ $t('commons.listing.listing_script.common.recent_trades.title') }}
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
      <el-form-item label="成交间隔">
        <el-input v-model="form.expectInterval" placeholder="成交间隔预期值,不填默认300s" class="el-input">
        </el-input>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" :disabled="isButtonDisabled" @click="subscribe" class="el-button">
          {{ $t('commons.listing.listing_script.common.recent_trades.verify') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-input type="textarea" v-model="form.result" :autosize="{ minRows: 4, maxRows: 20}" readonly></el-input>
  </div>
</template>

<script>
export default {
  name: 'RecentTrades',
  props: ['batchOptions'],
  data() {
    return {
      websocket: null,
      form: {
        env: 'wss://ws10-fat2.phemex.com',
        symbols: '',
        batch: '',
        result: '',
        expectInterval: ''
      },
      envs: [
        {label: 'fat2', value: 'wss://ws10-fat2.phemex.com'},
        {label: 'ea', value: 'wss://ws10-ea.phemex.com'}
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
        this.form.result = ''
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
      let symbols
      if (this.form.symbols !== '') {
        symbols = this.form.symbols.split(',');
      } else {
        symbols = this.form.batch.split(',');
      }
      symbols.forEach((symbol, index) => {
        const currentLabel = this.envs.find(item => item.value === this.form.env).label;
        const tradeStr = this.getType(currentLabel, symbol) === "PerpetualV2" ? 'trade_p' : 'trade'
        const id = index + 2;
        const subscribe = `{"method": "${tradeStr}.subscribe", "params": ["${symbol}"], "id": ${id}}`;
        this.websocket.send(subscribe);
      });
      this.verifyRecentTrades(this.form.expectInterval);
    },
    onWebSocketError(event) {
      console.error('WebSocket connection error', event);
    },
    onWebSocketClose(event) {
      console.log('WebSocket connection is closed', event);
      this.isButtonDisabled = false;
    },
    async verifyRecentTrades(expectInterval) {
      expectInterval = expectInterval || 300;
      if (expectInterval <= 0) {
        throw new Error('expectInterval must be a positive number');
      }
      // 将symbols从字符串转换为数组
      let symbols
      if (this.form.symbols !== '') {
        symbols = this.form.symbols.split(',')
      } else {
        symbols = this.form.batch.split(',')
      }
      // 创建一个Set用于去重
      const resultSet = new Set();
      const timeoutList = [];
      const lackTradesList = [];
      const passedList = [];
      this.websocket.onmessage = event => {
        // 解析WebSocket接收到的消息
        const message = JSON.parse(event.data)
        // 解构message
        const {type, symbol, trades_p, trades} = message;
        // 初始化result和detail
        let result, detail;
        // 如果消息类型不是snapshot或者symbol不在symbols数组中，则直接返回
        if (type !== 'snapshot' || !symbols.includes(symbol)) {
          return;
        }
        // 获取trades_p或者trades数据
        const tradesData = trades_p?.length > 0 ? trades_p : trades;
        // 如果没有获取到tradesData，则返回错误信息
        if (!tradesData) {
          result = '数据结构不符合要求';
          this.$message({message: result, type: 'error'});
          return;
        }
        // 定义当前时间，最近一笔成交时间，最近第二笔成交时间，算出最近两笔的交易间隔，买卖方向和数量，交易的单位
        const timeNow = Date.now();
        const mostRecentFirst = (timeNow / 1000 - tradesData[0][0] / 1000000000).toFixed(2);
        const mostRecentSecond = (timeNow / 1000 - tradesData[1][0] / 1000000000).toFixed(2);
        const tradesInterval = (mostRecentSecond - mostRecentFirst).toFixed(2);
        const side = tradesData[0][1];
        const size = tradesData[0][3];
        const currency = symbol.replace('USDT', '');
        // 如果trades大于等于2，交易间隔小于等于expectInterval，则验证通过
        if (tradesData && tradesData.length >= 2) {
          result = `${symbol}, 最近一笔距离当前时间 ${mostRecentFirst}s, 最近第二笔距离当前时间 ${mostRecentSecond}s, 最近两笔时间差为${tradesInterval}s; ${side} 一笔单价为 ${size} ${currency}的订单`;
          if (tradesInterval > expectInterval) {
            timeoutList.push(symbol)
            this.$message({message: `${symbol},  交易时间间隔超时;`, type: 'error'});
          } else {
            passedList.push(symbol)
          }
        } else {
          result = `${symbol},  无交易 or 交易不满足要求;`;
          lackTradesList.push(symbol)
          this.$message({message: result, type: 'error'});
        }

        // 记录result和detail到resultSet中，将symbol从symbols数组中删除
        detail = JSON.stringify(message);
        resultSet.add(`${result} | ${detail}`);
        // 将resultSet中的元素拼接为一个字符串，并将JSON格式的message添加到每个元素中，用换行符分隔
        this.form.result = [...resultSet].map(r => `${r} | ${JSON.stringify(message)}`).join('\n');
        // 从symbols数组中移除当前symbol
        symbols = symbols.filter(s => s !== symbol);
      };
      await new Promise(resolve => setTimeout(resolve, 3000));
      let msgTimeout = '';
      let msgFailed = '';
      let msgSuccess = '';
      if (symbols.length > 0 || lackTradesList.length > 0) {
        msgFailed = `以下币对无交易 or 交易不满足要求??: ${lackTradesList}`
        this.$message({message: msgFailed, type: 'error'});
      } else if (timeoutList.length > 0) {
        msgTimeout = `以下币对成交间隔超时(>${expectInterval})秒?? : ${timeoutList}`
        this.$message({message: msgTimeout, type: 'error'});
      } else {
        msgSuccess = '全部币对均校验通过！'
        this.$message({message: msgSuccess, type: 'success'});
      }
      this.form.result = `汇总结果：${msgFailed}${msgTimeout}${msgSuccess}\n详细结果：${this.form.result}`;
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
