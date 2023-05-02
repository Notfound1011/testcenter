<template>
  <div class="basic-data-template-for-test-case" @keydown.esc.stop="handleCancelDrawer">
    <el-badge :is-dot="dataToBeProcessed.length > 0" class="button-badge">
      <el-button class="button-item" icon="el-icon-edit" type="primary" size="mini" @click="createDrawer">
        {{ dataToBeProcessed.length > 0 ? '修改' : '设置' }}
      </el-button>
    </el-badge>
    <el-tooltip class="tooltip" effect="dark" :content="tooltipString" placement="top">
      <i :class="dataToBeProcessed.length > 0 ? 'el-icon-success':'el-icon-question'" style="margin-left: 8px;"/>
    </el-tooltip>

    <el-drawer :title="drawerTitle" :before-close="handleCancelDrawer" :visible="drawerStatus" direction="rtl" destroy-on-close
               custom-class="basic-data-template-drawer" ref="drawer" :modal=false :withHeader=false size="666px">
      <div class="drawer__title"> {{ drawerTitle }}</div>




<!--      <div class="drawer__content">-->
<!--        <div class="basic-data-template-drawer-form"-->
<!--             v-for="(itemValue, itemIndex) in dataToBeProcessed"-->
<!--             :key="itemIndex">-->
<!--          <el-form ref="itemValue" :model="itemValue">-->
<!--            <el-form-item class="basic-data-template-drawer-form-item" label="选择设置类型"-->
<!--                          label-width="120px">-->
<!--&lt;!&ndash;              输入框&ndash;&gt;-->
<!--&lt;!&ndash;              滑块&ndash;&gt;-->
<!--&lt;!&ndash;              输入框, 选择&ndash;&gt;-->
<!--              <el-select v-model="dataToBeProcessed[itemIndex]">-->

<!--              </el-select>-->





              <!-- 设置类型, 保持唯一; v-model的绑定方式是避免: 引用 for 循环的临时对象不能再绑定 model 的问题; -->
<!--              <el-select v-model="dataToBeProcessed[itemIndex]"-->
<!--                         value-key="functionType"-->
<!--                         placeholder="请选择设置类型"-->
<!--                         filterable-->
<!--                         @change="updateItemFunctionType($event, itemIndex)">-->
<!--                <el-option-group v-for="groupValue in configContent"-->
<!--                                 :key="groupValue.groupName"-->
<!--                                 :label="groupValue.groupName">-->
<!--                  <el-option v-for="optionValue in groupValue.options"-->
<!--                             :disabled="!optionValue.status"-->
<!--                             :label="optionValue.typeName"-->
<!--                             :key="optionValue['functionType']"-->
<!--                             :value="optionValue">-->
<!--                    <span style="float: left">{{ optionValue.typeName }}</span>-->
<!--                    <span style="float: right; color: #8492a6; font-size: 13px">{{ optionValue['functionType'] }}</span>-->
<!--                  </el-option>-->
<!--                </el-option-group>-->
<!--              </el-select>-->


<!--              <el-tooltip effect="dark"-->
<!--                          :content="itemValue.functionType ? (dataToBeConfig[itemIndex] && dataToBeConfig[itemIndex].description ? dataToBeConfig[itemIndex].description: '该字段暂未设置提醒') : '请设置类型'"-->
<!--                          placement="top">-->
<!--                <i class="el-icon-question drawer-el-icon"/>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip effect="dark" content="复制" placement="top">-->
<!--                <i class="el-icon-document-copy drawer-el-icon" @click="copyItem(itemIndex)"/>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip effect="dark" content="删除" placement="top">-->
<!--                <i class="el-icon-delete drawer-el-icon" @click="deleteItem(itemIndex)"/>-->
<!--              </el-tooltip>-->
<!--            </el-form-item>-->

<!--            &lt;!&ndash; 剩下的 &ndash;&gt;-->
<!--            <el-form-item class="basic-data-template-drawer-form-item"-->
<!--                          :label="displayTips[itemKeyObj.key] && displayTips[itemKeyObj.key]['displayString'] ? displayTips[itemKeyObj.key]['displayString'] : itemKeyObj.key"-->
<!--                          label-width="120px"-->
<!--                          v-for="itemKeyObj in dataToBeConfig[itemIndex]['dataList']"-->
<!--                          :key="itemKeyObj.key">-->
<!--              <el-input v-model="itemValue[itemKeyObj.key]" :clearable=true style="width:450px;"-->
<!--                        :placeholder="displayTips[itemKeyObj.key] && displayTips[itemKeyObj.key]['placeholder'] ? displayTips[itemKeyObj.key]['placeholder'] : '暂未设置提醒'"/>-->
<!--              <el-tooltip effect="dark"-->
<!--                          :content="displayTips[itemKeyObj.key] && displayTips[itemKeyObj.key]['description'] ? displayTips[itemKeyObj.key]['description'] : '暂未设置提醒'"-->
<!--                          placement="top">-->
<!--                <i class="el-icon-question drawer-el-icon"/>-->
<!--              </el-tooltip>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--          &lt;!&ndash; 分割线 &ndash;&gt;-->
<!--          <el-divider content-position="center">{{ `Step - ${itemIndex + 1}` }}</el-divider>-->
<!--        </div>-->
<!--        &lt;!&ndash; 为空的默认展示 &ndash;&gt;-->
<!--        <el-empty v-show="dataToBeProcessed.length <= 0" class="drawer-empty" description="暂无数据"></el-empty>-->
<!--      </div>-->
<!--      <div class="drawer__content drawer-input" v-else>-->
<!--        <div class="basic-data-template-drawer-form drawer-input">-->
<!--          <el-form status-icon :rules="inputRules">-->
<!--            <el-form-item prop="drawerInputRules">-->
<!--              &lt;!&ndash; 把输入框放这个组件里的目的是区分: 输入框展示的字符串和json格式的数据 &ndash;&gt;-->
<!--              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 50 }"-->
<!--                        :placeholder="drawerConfig.keyName === '_ASSERT_DATA_HIERARCHY' ? socketDisplayInputString : displayInputString"-->
<!--                        v-model="drawerInputValue"/>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--        </div>-->
<!--      </div>-->


<!--      <div class="drawer__footer">-->
<!--        <el-button @click="drawerResetForm">重 置</el-button>-->
<!--        <el-button @click="handleCancelDrawer">取 消</el-button>-->
<!--        <el-button v-show="!drawerInputStatus" @click="addItem">新 增</el-button>-->
<!--        &lt;!&ndash;        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">&ndash;&gt;-->
<!--        <el-button type="primary" :disabled="!onSubmitStatus" @click="onSubmit">确 定</el-button>-->
<!--      </div>-->
    </el-drawer>
  </div>
</template>

<script>
import {getApiTestConfig, isValueEqual, popUpReminder, isKeyValueObject, isEmptyValue} from '@/common/js/utils';

export default {
  // 组件别名
  name: "DependAndCleanUpForModify",
  // 引用组件存放位置
  components: {},
  // 模板存放数据, vc必须使用函数式
  data() {
    return {
      tooltipString: '',
      drawerTitle: '',
      drawerStatus: false,





      // // 存放数据的容器, 用于对比用的, 不会多操作什么
      // basicData: {},
      // arrayData: [],
      // // 基础配置,
      // drawerConfig: {},
      // displayInputString: 'json格式, 如果该值为空 & 设置`共享参数`或`依赖项`, 此时强行保存会移除该项的内容! 样例: \n{"key":"value"}',
      // displayTips: {},  // `el-drawer`内的一些解释文案, 接口请求的配置
      // configContent: [],  // `el-drawer`配置内容
      // drawer: false,
      // // 输入框内容, 实际是 _EXECUTE_DATA 数据, 仅同步到父组件, 独立处理好处理
      // inputValue: '', // 输入框内的数据
      // inputRules: {
      //   'oneInputRules': {validator: checkInput, trigger: 'blur'}
      // },
      // 设置 [前置条件, 后续清理] 的临时操作容器
      rawDataToBeProcessed: [], // 待处理数据的原数据,
      dataToBeProcessed: [], // 待处理的实际数据 drawer内操作的数据, 均是list
      // dataToBeConfig: []  // 待处理数据的对应config配置, 一些提示文案,等
    }
  },
  // 方法集合
  methods: {
    /**
     * @description: 点击确认后 上报事件.
     * @return {void}
     */
    onSubmit() {
      const _that = this;
      if (isValueEqual(_that.rawDataToBeProcessed, _that.dataToBeProcessed)) {
        _that.dataToBeProcessed = [];
        _that.rawDataToBeProcessed = [];
        _that.drawer = false;
      } else {
        _that.$confirm(`[${_that.drawerConfig.title}] 确定已编辑完成？`)
          .then(_ => {
            _that.loading = true;
            setTimeout(() => {
              // 上报事件
              _that.$emit('synchronize_basic_data', _that.editKey, _that.drawerConfig.keyName, _that.dataToBeProcessed)
              _that.dataToBeProcessed = [];
              _that.rawDataToBeProcessed = [];
              // _that.$refs.drawer.closeDrawer();  // 触发关闭回调
              _that.drawer = false;
            }, 200);
          })
          .catch(_ => {
          });
      }
    },
    /**
     * @description: 取消效果, 清理一些数据, 以及触发关闭时的回调, 取消将不上报同步消息事件;
     * @return {*}
     */
    handleCancelDrawer() {
      const _that = this;
      if (isValueEqual(_that.rawDataToBeProcessed, _that.dataToBeProcessed)) {
        _that.drawer = false;
        _that.dataToBeProcessed = [];
      } else {
        _that.$confirm('是否取消, 不保存? ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '继续编辑',
          type: 'warning'
        }).then(() => {
          _that.drawer = false;
          _that.dataToBeProcessed = [];
        })
          .catch(() => {
            // 按继续编辑按钮, 无需有其他要求
          })
      }
    },
    /**
     * @description: 打开`drawer`时获取的主备注信息
     * @return {void}
     */
    createDrawer() {
      const _that = this;
      _that.dataToBeProcessed = Array.isArray(_that.processedData) ? _that.processedData : []
      let keyWords = (_that.editKey === 'depend' ? '依赖': '清理')
      _that.drawerTitle = (_that.dataToBeProcessed.length > 0 ? `修改${keyWords}项` : `设置${keyWords}项`)
      _that.tooltipString = `用例执行后的${keyWords}项, 该case${_that.dataToBeProcessed.length > 0 ? '已':'目前没有'}设置${keyWords}项!`
      _that.drawerStatus = true;





      // let configId = getApiTestConfig(_that.drawerConfig.getConfigType);
      // let tipsId = getApiTestConfig('getApiCaseTipsConfig');
      // // 根据是否有生成配置去执行请求
      // if (!configId || !tipsId) {
      //   popUpReminder(_that, '获取信息失败!!', '配置项/tips')
      // } else {
      //   // 同步到原始数据容器, 用于提交时做对比, 使用 concat() 复制一个 新的 对象 而不在原有的基础上引用
      //   _that.rawDataToBeProcessed = _that.dataToBeProcessed.concat()
      //   // 使用他们封装好的方法, 这里请求具体配置
      //   _that.$axios.get("/pyServer/public/test-data/test-config/search", {params: {'configId': `${configId},${tipsId}`}, timeout: 2000})
      //     .then(result => {
      //       if (result.status === 200 && result.data.code === 0) {
      //         // tips好像没啥特别的校验, 直接赋值即可
      //         _that.displayTips = result.data.data[tipsId]['configData']
      //         // config 需要判断一下, 要不有逻辑问题
      //         if (Array.isArray(result.data.data[configId]['configData']) && result.data.data[configId]['configData'].length > 0) {
      //           _that.configContent = result.data.data[configId]['configData'];
      //           // 判断 _that.dataToBeProcessed 是否真的有值, 如果有, 要生成对应 _that.dataToBeConfig
      //           if (Array.isArray(_that.dataToBeProcessed) && _that.dataToBeProcessed.length > 0) {
      //             for (let tmpIndex in _that.dataToBeProcessed) {
      //               for (let groupIndex in _that.configContent) {
      //                 for (let optionIndex in _that.configContent[groupIndex]['options']) {
      //                   if (_that.dataToBeProcessed[tmpIndex]['functionType'] === _that.configContent[groupIndex]['options'][optionIndex]['functionType']) {
      //                     _that.dataToBeConfig.push(_that.configContent[groupIndex]['options'][optionIndex])
      //                   }
      //                 }
      //               }
      //             }
      //           }
      //           _that.drawer = true;
      //         } else {
      //           popUpReminder(_that, '接口返回值异常, 请联系开发者!!', _that.drawerConfig.title)
      //         }
      //       } else {
      //         popUpReminder(_that, '请求失败, 请检查网络状态!', _that.drawerConfig.title)
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       popUpReminder(_that, '请求失败, 请检查网络状态!!!', _that.drawerConfig.title)
      //     })
      // }
    },
    /**
     * @description: 添加一个基础元素, 仅在队列里添加一个 `functionType` 基础key
     * @return {*}
     */
    addItem() {
      this.dataToBeProcessed.push({'functionType': null});
      this.dataToBeConfig.push({});
    },
    /**
     * @description: 根据索引添加一个元素到末尾
     * @param {Number} itemIndex 传索引
     */
    copyItem(itemIndex) {
      this.dataToBeProcessed.push(JSON.parse(JSON.stringify(this.dataToBeProcessed[itemIndex])));
      this.dataToBeConfig.push(JSON.parse(JSON.stringify(this.dataToBeConfig[itemIndex])));
    },
    /**
     * @description: 根据索引删除一个元素, js中的array操作没有传统的, 针对下标的移除方法, 这里使用splice讨巧实现,
     * @param {Number} itemIndex 传索引
     */
    deleteItem(itemIndex) {
      // itemIndex 开始索引; 删除个数;
      this.dataToBeProcessed.splice(itemIndex, 1);
      this.dataToBeConfig.splice(itemIndex, 1);
    },
    /**
     * @description: 首先functionType不允许重复的, 根据不同的实际id, 去填充一个数据
     * @param {Object} event
     * @param {Number} itemIndex 当前遍历的下标
     * @return {*}
     */
    updateItemFunctionType(event, itemIndex) {
      const _that = this;
      _that.dataToBeProcessed[itemIndex]['functionType'] = _that.dataToBeConfig[itemIndex]['functionType']
    }
  },
  // 单向数据流, 不建议直接操作props, 容易把数据弄成非响应式的, 出异常就难受了
  props: {
    // 可能会传 null array, keyValue的Json(这三个都算object...)
    processedData: {
      type: Array,  // 有可能是null undefined 之类的
      required: false
    },
    // 变更的key, 上报时用的
    editKey: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.basic-data-template-for-test-case {
  width: 100%;
}

.button-item{
  height: 25px;
}

/* 覆盖原有样式 */
.button-badge{
  line-height: 25px;
}

.basic-data-template-drawer {
  width: 100%;
  height: 100%;
}

.drawer__title {
  font-size: 2em;
  /* text-align: center; */
  margin: auto 20px;
}

.drawer__content {
  height: calc(100vh - 110px);
  overflow-y: auto;
}

.drawer__footer {
  position: absolute;
  left: 15px;
  bottom: 15px;
}

.drawer-empty {
  position: relative;
  width: 200px;
  left: 50%;
  top: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}

.el-icon-question {
  margin-left: 10px;
}

.basic-data-template-drawer-form-item {
  margin: 10px 0;
}

.basic-data-template-drawer-form {
  top: 0;
  left: 0;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

i.drawer-el-icon {
  font-size: 20px;
}

i.el-icon-document-copy,
i.el-icon-delete {
  margin-left: 20px;
}

</style>

<style>
/*覆盖当前组件的badge样式, 为了防止其他样式的影响, 这个独立在外 */
.button-badge .el-badge__content.is-fixed.is-dot{
  top: 6px;
  right: 11px;
  border: 0 solid #FFF;
}
</style>
