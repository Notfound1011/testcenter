<template>
  <div class="basic-data-template-for-test-case" @keydown.esc.stop="handleCancelDrawer">
    <!-- :gutter 属性是组件间的间隔好像是, 加了会很奇怪 移除了 -->
    <el-row type="flex" justify="space-between">
      <el-col :span="20">
        <el-form status-icon :rules="inputRules">
          <el-form-item prop="oneInputRules">
            <!-- 把输入框放这个组件里的目的是区分: 输入框展示的字符串和json格式的数据 -->
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10 }"
                      placeholder="json格式, 如果该值为空 & 设置`共享参数`或`依赖项`, 此时强行保存会移除该项的内容!"
                      v-model="inputValue"/>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <div class="button-content">
          <el-badge :is-dot="badgeDotStatus(basicData[drawerAllConfig[item]['keyName']])" class="button-badge"
                    v-for="item in buttonList" :key="item['keyName']">
            <el-button size="mini" class="button-item" type="primary" @click="createDrawer(item)">
              {{ drawerAllConfig[item]['title'] }}
            </el-button>
          </el-badge>
        </div>
      </el-col>
    </el-row>

    <el-drawer :title="drawerConfig.title" :before-close="handleCancelDrawer" :visible="drawer" direction="rtl" destroy-on-close
               custom-class="basic-data-template-drawer" ref="drawer" :modal=false :withHeader=false size="666px">
      <div class="drawer__title"> {{ drawerConfig.title }}</div>
      <div class="drawer__content" v-if="!drawerInputStatus">
        <div class="basic-data-template-drawer-form"
             v-for="(itemValue, itemIndex) in dataToBeProcessed"
             :key="itemIndex">
          <el-form ref="itemValue" :model="itemValue">
            <el-form-item class="basic-data-template-drawer-form-item" label="选择设置类型"
                          label-width="120px">
              <!-- 设置类型, 保持唯一; v-model的绑定方式是避免: 引用 for 循环的临时对象不能再绑定 model 的问题; -->
              <el-select v-model="dataToBeConfig[itemIndex]"
                         value-key="functionType"
                         placeholder="请选择设置类型"
                         filterable
                         @change="updateItemFunctionType($event, itemIndex)">
                <el-option-group v-for="groupValue in configContent"
                                 :key="groupValue.groupName"
                                 :label="groupValue.groupName">
                  <el-option v-for="optionValue in groupValue.options"
                             :disabled="!optionValue.status"
                             :label="optionValue.typeName"
                             :key="optionValue['functionType']"
                             :value="optionValue">
                    <span style="float: left">{{ optionValue.typeName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ optionValue['functionType'] }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
              <el-tooltip effect="dark"
                          :content="itemValue.functionType ? (dataToBeConfig[itemIndex] && dataToBeConfig[itemIndex].description ? dataToBeConfig[itemIndex].description: '该字段暂未设置提醒') : '请设置类型'"
                          placement="top">
                <i class="el-icon-question drawer-el-icon"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="复制" placement="top">
                <i class="el-icon-document-copy drawer-el-icon" @click="copyItem(itemIndex)"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <i class="el-icon-delete drawer-el-icon" @click="deleteItem(itemIndex)"/>
              </el-tooltip>
            </el-form-item>

            <!-- 剩下的 -->
            <el-form-item class="basic-data-template-drawer-form-item"
                          :label="displayTips[itemKeyObj.key] && displayTips[itemKeyObj.key]['displayString'] ? displayTips[itemKeyObj.key]['displayString'] : itemKeyObj.key"
                          label-width="120px"
                          v-for="itemKeyObj in dataToBeConfig[itemIndex]['dataList']"
                          :key="itemKeyObj.key">
              <el-input v-model="itemValue[itemKeyObj.key]" :clearable=true style="width:450px;"
                        :placeholder="displayTips[itemKeyObj.key] && displayTips[itemKeyObj.key]['placeholder'] ? displayTips[itemKeyObj.key]['placeholder'] : '暂未设置提醒'"/>
              <el-tooltip effect="dark"
                          :content="displayTips[itemKeyObj.key] && displayTips[itemKeyObj.key]['description'] ? displayTips[itemKeyObj.key]['description'] : '暂未设置提醒'"
                          placement="top">
                <i class="el-icon-question drawer-el-icon"/>
              </el-tooltip>
            </el-form-item>
          </el-form>
          <!-- 分割线 -->
          <el-divider content-position="center">{{ `Step - ${itemIndex + 1}` }}</el-divider>
        </div>
        <!-- 为空的默认展示 -->
        <el-empty v-show="dataToBeProcessed.length <= 0" class="drawer-empty" description="暂无数据"></el-empty>
      </div>
      <div class="drawer__content drawer-input" v-else>
        <div class="basic-data-template-drawer-form drawer-input">
          <el-form status-icon :rules="inputRules">
            <el-form-item prop="drawerInputRules">
              <!-- 把输入框放这个组件里的目的是区分: 输入框展示的字符串和json格式的数据 -->
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 50 }"
                        :placeholder="drawerConfig.placeholder"
                        v-model="drawerInputValue"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="drawer__footer">
        <el-button @click="drawerResetForm">重 置</el-button>
        <el-button @click="handleCancelDrawer">取 消</el-button>
        <el-button v-show="!drawerInputStatus" @click="addItem">新 增</el-button>
        <!--        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">-->
        <el-button type="primary" :disabled="!onSubmitStatus" @click="onSubmit">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {getApiTestConfig, isValueEqual, popUpReminder, isKeyValueObject, isEmptyValue} from '@/common/js/utils';

// 字段名统一使用
const _DATA_KEY_NAME = '_EXECUTE_DATA';  // 共有的 - 执行数据
const _DEPENDENT_KEY_NAME = '_EXECUTE_DEPENDENT';  // 共有的 - 单向依赖
const _GLOBAL_SHARED_KEY_NAME = '_SET_GLOBAL_SHARED_DATA';  // 请求相关 - 设置全局共享参数
const _ASSERT_DATA_HIERARCHY_KEY_NAME = '_ASSERT_DATA_HIERARCHY';  // socket 相关 - 验证数据层级
// sugar 要求的需求, 支持参数化
const _PARAMETRIZE_KEY_NAME = '_EXECUTE_PARAMETRIZE';  // 请求相关 - 设置参数化值
const _DATA_SCHEMA_KEY_NAME = '_EXECUTE_DATA_SCHEMA';  // response & socket 相关 - 设置数据的验证模型
const _ALTERNATIVE_RESPONSE_DATA_KEY_NAME = '_ALTERNATIVE_RESPONSE_DATA'  // response 相关 - 备选的验证对象

export default {
  // 组件别名
  name: 'BasicDataTemplateForModify',
  // 引用组件存放位置
  components: {},
  // 模板存放数据, vc必须使用函数式
  data() {
    /**
     * @description 验证输入框内容, 这个是官方给的用法, 输入框内容直接上报到父组件, 不用修改
     * @param {*} rule
     * @param {*} value 这个传进来是空.. 应该没做数据绑定, 索性用 this.inputValue
     * @param {*} callback
     * @returns {*}
     */
    const checkInput = (rule, value, callback) => {
      const _that = this;
      try {
        if (_that.inputValue.trim() === '' && _that.basicData.hasOwnProperty(_GLOBAL_SHARED_KEY_NAME) && !_that.basicData.hasOwnProperty(_DEPENDENT_KEY_NAME)) {
          _that.$emit('synchronize_basic_data', _that.editKey, _DATA_KEY_NAME, null)
            return callback(new Error('仅设置`依赖内容`or`共享内容`的情况下, 理论上不允许为空!'));
          }
        else if (_that.inputValue.trim() === '') {
          _that.$emit('synchronize_basic_data', _that.editKey, _DATA_KEY_NAME, null)
        }else{
          let tmpInputJson = JSON.parse(_that.inputValue);
          if (isKeyValueObject(tmpInputJson)){
            _that.inputValue = JSON.stringify(tmpInputJson, null, 4)
            _that.$emit('synchronize_basic_data', _that.editKey, _DATA_KEY_NAME, tmpInputJson)
          }else{
            _that.$emit('synchronize_basic_data', _that.editKey, _DATA_KEY_NAME, null)
            return callback(new Error('应当输入为 key value 的 json, Array的数据不会生效!!'));
          }
        }
      } catch (e) {
        _that.$emit('synchronize_basic_data', _that.editKey, _DATA_KEY_NAME, null)
        return callback(new Error('转json格式错误, 在最终提交时, 错误的数据不会生效!!'));
      }
    };
    /**
     * 和上面的相比的话, 这个是 drawer 里的输入框, 变更内容理论上不会实时变更的
     * @param rule
     * @param value
     * @param callback
     * @returns {*}
     */
    const checkDrawerInput = (rule, value, callback) => {
      const _that = this;
      let tmpKeyName = _that.drawerConfig.keyName;
      try {
        // 除了`参数化`的是列表, 设置socket验证层级是str, 其余应该都是键值对
        if (_that.drawerInputValue.trim() === '') {
          _that.onSubmitStatus = true;
          _that.dataToBeProcessed = null;
        }else if (tmpKeyName === _ASSERT_DATA_HIERARCHY_KEY_NAME){
          _that.onSubmitStatus = true;
          _that.dataToBeProcessed = _that.drawerInputValue
        }else{
          let tmpInputJson = JSON.parse(_that.drawerInputValue);
          if (tmpKeyName === _PARAMETRIZE_KEY_NAME){
            if (Array.isArray(tmpInputJson)){
              _that.onSubmitStatus = true;
              _that.dataToBeProcessed = tmpInputJson;
              _that.drawerInputValue = JSON.stringify(tmpInputJson, null, 4);
            }else{
              _that.onSubmitStatus = false;
              _that.$emit('synchronize_basic_data', _that.editKey, tmpKeyName, null)
              return callback(new Error('应当输入为 Array json, 键值对的数据不会生效!!'));
            }
          }else{
            if (isKeyValueObject(tmpInputJson)){
              _that.onSubmitStatus = true;
              _that.dataToBeProcessed = tmpInputJson;
              _that.drawerInputValue = JSON.stringify(tmpInputJson, null, 4);
            }else{
              _that.onSubmitStatus = false;
              _that.$emit('synchronize_basic_data', _that.editKey, tmpKeyName, null)
              return callback(new Error('应当输入为 key value 的 json, Array的数据不会生效!!'));
            }
          }
        }
      } catch (e) {
        _that.onSubmitStatus = false;
        _that.$emit('synchronize_basic_data', _that.editKey, _that.drawerConfig.keyName, null)
        return callback(new Error('转json格式错误, 在最终提交时, 错误的数据不会生效!!'));
      }
    };
    return {
      // 存放数据的容器, 用于对比用的, 不会多操作什么
      basicData: {},
      buttonList: [],
      // drawer的全部配置, 这里的
      drawerAllConfig: {
        'executionDependentFunction': {'title': '设置单项依赖内容','getConfigType': 'getDependentFunctionConfig', 'keyName': _DEPENDENT_KEY_NAME, 'placeholder': ''},
        'setUpSharedData': {'title': '设置全局共享内容', 'getConfigType': 'getSetUpSharedConfig', 'keyName': _GLOBAL_SHARED_KEY_NAME, 'placeholder': ''},
        'requestParametrize': {'title': '设置单项参数化值', 'getConfigType': '', 'keyName': _PARAMETRIZE_KEY_NAME, 'placeholder': '设置改项目的参数化配置, 数据结构: [{key: value}];\n其中{key: value}是每一次要更新的内容, 可以是多个key,value;'},
        'dataSchema': {'title': '设置数据验证模型', 'getConfigType': '', 'keyName': _DATA_SCHEMA_KEY_NAME, 'placeholder': '验证jsonSchema.'},
        'dataHierarchy': {'title': '设置数据验证层级', 'getConfigType': '', 'keyName': _ASSERT_DATA_HIERARCHY_KEY_NAME, 'placeholder': '设置要验证数据的层级, 考虑到一些验证消息的不确定性, 例如 order 消息, 由于订单大小导致成交份额都不太相同, 一般验证终态即列表最后一个元素, 需要特殊处理; \n例: orders.[-1], 表示字段`orders`的最后一个索引.'},
        'alternativeData': {'title': '设置备选验证数据', 'getConfigType': '', 'keyName': _ALTERNATIVE_RESPONSE_DATA_KEY_NAME, 'placeholder': '设置备选验证json, 其中设置`设置数据验证层级`是有效的; 备选不可动态变更!'}
      },
      // 当前某个组件打开时用的配置,
      drawerConfig: {},
      displayTips: {},  // `el-drawer`内的一些解释文案, 接口请求的配置
      configContent: [],  // `el-drawer`配置内容
      drawer: false,
      onSubmitStatus: true,
      drawerInputStatus: true,  // 有些是手动选择的, 有些是直接输入json的, 一般没 getConfigType 都是 input 输入框的
      // 输入框内容, 实际是 _EXECUTE_DATA 数据, 仅同步到父组件, 独立处理好处理
      inputValue: '', // 外部输入框内的数据
      drawerInputValue: '', // drawer内的input
      inputRules: {
        'oneInputRules': {validator: checkInput, trigger: 'blur'},
        'drawerInputRules': {validator: checkDrawerInput, trigger: 'blur'}
      },
      // 设置 [依赖, 共享, 前置条件, 后续清理] 的临时操作容器
      rawDataToBeProcessed: [], // 待处理数据的原数据; 要兼容input模型, 可能会是key value键值对或者字符串, 不过在点击`取消`和`确认`的时候重置成list;
      dataToBeProcessed: [], // 待处理的实际数据 drawer内操作的数据; 同上, 也不一定是list的了;
      dataToBeConfig: []  // 待处理数据的对应config配置, 一些提示文案,等
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
      if ((_that.drawerConfig.keyName === _ASSERT_DATA_HIERARCHY_KEY_NAME && _that.rawDataToBeProcessed === _that.dataToBeProcessed) || (_that.drawerConfig.keyName !== _ASSERT_DATA_HIERARCHY_KEY_NAME && isValueEqual(_that.rawDataToBeProcessed, _that.dataToBeProcessed))) {
        _that.drawer = false;
        _that.drawerInputValue = '';
        _that.dataToBeProcessed = [];
        _that.rawDataToBeProcessed = []
        _that.drawerInputStatus = false;
      } else {
        _that.$confirm(`[${_that.drawerConfig.title}] 确定已编辑完成？`)
          .then(_ => {
            _that.loading = true;
            setTimeout(() => {
              // 上报事件
              _that.$emit('synchronize_basic_data', _that.editKey, _that.drawerConfig.keyName, _that.dataToBeProcessed)
              _that.drawer = false;
              _that.drawerInputValue = '';
              _that.dataToBeProcessed = [];
              _that.rawDataToBeProcessed = []
              _that.drawerInputStatus = false;
              // _that.$refs.drawer.closeDrawer();  // 触发关闭回调
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
      if ((_that.drawerConfig.keyName === _ASSERT_DATA_HIERARCHY_KEY_NAME && _that.rawDataToBeProcessed === _that.dataToBeProcessed) || (_that.drawerConfig.keyName !== _ASSERT_DATA_HIERARCHY_KEY_NAME && isValueEqual(_that.rawDataToBeProcessed, _that.dataToBeProcessed))) {
        _that.drawer = false;
        _that.drawerInputValue = '';
        _that.dataToBeProcessed = [];
        _that.rawDataToBeProcessed = []
        _that.drawerInputStatus = false;
      } else {
        _that.$confirm('是否取消, 不保存? ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '继续编辑',
          type: 'warning'
        }).then(() => {
          _that.drawer = false;
          _that.drawerInputValue = '';
          _that.dataToBeProcessed = [];
          _that.rawDataToBeProcessed = []
          _that.drawerInputStatus = false;
        })
          .catch(() => {
            // 按继续编辑按钮, 无需有其他要求
          })
      }
    },
    /**
     * @description Drawer 的一些显示配置, 和上报事件的变更key; 以及初始化 列表的 处理函数
     * @param type
     */
    updateDrawerConfig(type) {
      this.drawerConfig = this.drawerAllConfig[type]
      if (this.basicData[this.drawerConfig['keyName']]) {
        this.dataToBeProcessed = this.basicData[this.drawerConfig['keyName']]
      } else {
        this.dataToBeProcessed = []
      }
    },
    /**
     * 配置项触发, 改动
     */
    configContentSync(){
      const _that = this;
      // config 需要判断一下, 要不有逻辑问题
      if (Array.isArray(_that.configContent) && _that.configContent.length > 0) {
        // 判断 _that.dataToBeProcessed 是否真的有值, 如果有, 要生成对应 _that.dataToBeConfig
        if (Array.isArray(_that.dataToBeProcessed) && _that.dataToBeProcessed.length > 0) {
          for (let tmpIndex in _that.dataToBeProcessed) {
            for (let groupIndex in _that.configContent) {
              for (let optionIndex in _that.configContent[groupIndex]['options']) {
                if (_that.dataToBeProcessed[tmpIndex]['functionType'] === _that.configContent[groupIndex]['options'][optionIndex]['functionType']) {
                  _that.dataToBeConfig.push(_that.configContent[groupIndex]['options'][optionIndex])
                }
              }
            }
          }
        }
      } else {
        popUpReminder(_that, '配置项获取失败, 请联系开发者!!', _that.drawerConfig.title)
      }
    },
    /**
     * @description: 打开`drawer`时获取的主备注信息
     * @param {String} typeName 依赖项的类型名称;
     * @return {void}
     */
    createDrawer(typeName) {
      const _that = this;
      // 变更配置项
      _that.updateDrawerConfig(typeName);
      // 如果没配置项的话, 应该是用input输入框类型的, 直接打开就行
      if (!_that.drawerConfig.getConfigType){
        _that.drawer = true;
        _that.drawerInputStatus = true;
        _that.processDrawerInputValue(_that.drawerConfig.keyName);
        return
      }
      let configId = getApiTestConfig(_that.drawerConfig.getConfigType);
      let tipsId = getApiTestConfig('getApiCaseTipsConfig');
      // 根据是否有生成配置去执行请求
      if (!configId || !tipsId) {
        popUpReminder(_that, '获取信息失败!!', '配置项/tips')
      } else {
        _that.drawerInputStatus = false;
        // 同步到原始数据容器, 用于提交时做对比, 使用 concat() 复制一个 新的 数据对象 而不在原有的基础上引用
        // _that.rawDataToBeProcessed = _that.dataToBeProcessed.concat()
        _that.rawDataToBeProcessed = JSON.parse(JSON.stringify(_that.dataToBeProcessed))  // 这里不一定是数组了,
        // 使用他们封装好的方法, 这里请求具体配置
        _that.$axios.get("/pyServer/public/test-data/test-config/search", {params: {'configId': `${configId},${tipsId}`}, timeout: 2000})
          .then(result => {
            if (result.status === 200 && result.data.code === 0) {
              // tips好像没啥特别的校验, 直接赋值即可
              _that.displayTips = result.data.data[tipsId]['configData']
              _that.configContent = result.data.data[configId]['configData'];
              _that.configContentSync()
              _that.drawer = true;
            } else {
              popUpReminder(_that, '请求失败, 请检查网络状态!', _that.drawerConfig.title)
            }
          })
          .catch((err) => {
            console.log(err);
            popUpReminder(_that, '请求失败, 请检查网络状态!!!', _that.drawerConfig.title)
          })
      }
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
    },
    /**
     * @description: 处理 basicData 中的字符串数据, 这个是直接展示的, 需要提前处理
     * @return {*}
     */
    processInputValue() {
      if (this.basicData[_DATA_KEY_NAME]){
        this.inputValue = JSON.stringify(this.basicData[_DATA_KEY_NAME], null, 4)
      }else{
        this.inputValue = ''
      }
    },
    /**
     * 处理 drawer 内的input数据, 根据打开的组件不同, 渲染不同的内容, 这个是 drawer 控件打开时展示的, 可以后处理,
     * 增加了重置,
     * @param keyName
     */
    processDrawerInputValue(keyName) {
      // 如果是设置级别应该仅仅是字符串, 这里就直接赋值了
      if (this.basicData[keyName] && keyName === _ASSERT_DATA_HIERARCHY_KEY_NAME) {
        this.drawerInputValue = this.basicData[keyName]
        this.dataToBeProcessed = this.basicData[keyName]
        this.rawDataToBeProcessed = this.basicData[keyName]
      }else if (this.basicData[keyName]){
        this.drawerInputValue = JSON.stringify(this.basicData[keyName], null, 4)
        this.dataToBeProcessed = JSON.parse(this.drawerInputValue)
        this.rawDataToBeProcessed = JSON.parse(this.drawerInputValue)
      }else{
        this.rawDataToBeProcessed = null;  // null也是object 可以进行对比
        this.dataToBeProcessed = null;
        this.drawerInputValue = ''
      }
    },
    /**
     * @description 重置form表单数据, 最基本结果都在这, 表单的基础数据来源于你在打开dialog的form前model的传参,
     */
    drawerResetForm() {
      const _that = this;
      _that.$confirm('确认重置当前数据? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '不重置',
        type: 'warning'
      }).then(_ => {
        if (!_that.rawDataToBeProcessed){
          _that.dataToBeProcessed = null;
        }else if (_that.drawerConfig.keyName === _ASSERT_DATA_HIERARCHY_KEY_NAME) {
          _that.dataToBeProcessed = _that.rawDataToBeProcessed;
        }else{
          _that.dataToBeProcessed = JSON.parse(JSON.stringify(_that.rawDataToBeProcessed));
        }
        // 如果不是 input 类型的, 触发组件配置同步
        if(!_that.drawerInputStatus){
          _that.configContentSync()
        }else{
          if (_that.drawerConfig.keyName === _ASSERT_DATA_HIERARCHY_KEY_NAME){
            _that.drawerInputValue = _that.dataToBeProcessed;
          }else if (!_that.dataToBeProcessed){
            _that.drawerInputValue = '';
          }else{
            _that.drawerInputValue = JSON.stringify(_that.dataToBeProcessed, null, 4);
          }
        }
      }).catch(_ => {
      })
    },
    /**
     * badge is-dot 的判断,
     * @param value
     * @returns {boolean}
     */
    badgeDotStatus(value){
      return !isEmptyValue(value)
    }
  },
  // 单向数据流, 不建议直接操作props, 容易把数据弄成非响应式的, 出异常就难受了
  props: {
    // 可能会传 null array, keyValue的Json(这三个都算object...)
    processedData: {
      type: Object,  // 有可能是null undefined 之类的
      required: false
    },
    // 变更的key, 上报时用的
    editKey: {
      type: String,
      required: true
    },
    // expect 的模式
    responseType: {
      type: Boolean,
      default: false
    },
    socketType: {
      type: Boolean,
      default: false
    }
  },
  // 组件的钩子函数
  created() {
    const _that = this;
    // 处理buttonList
    if (_that.responseType){
      _that.buttonList = ['executionDependentFunction', 'dataSchema', 'alternativeData'];
    } else if (_that.socketType){
      _that.buttonList = ['executionDependentFunction', 'dataSchema', 'dataHierarchy'];
    }else {
      _that.buttonList = ['executionDependentFunction', 'setUpSharedData', 'requestParametrize'];
    }
    // 处理processedData, 如果传的数据是符合规则 && 是否是有值的, 如果是就赋值, 如果不符合, 就跳过
    if (_that.responseType && _that.processedData && _that.processedData.response && Object.keys(_that.processedData.response).length > 0){
      _that.basicData = JSON.parse(JSON.stringify(_that.processedData.response))
    }else if (_that.socketType && _that.processedData && _that.processedData.socket && Object.keys(_that.processedData.socket).length > 0){
      _that.basicData = JSON.parse(JSON.stringify(_that.processedData.socket))
    }else if (isKeyValueObject(_that.processedData) && Object.keys(_that.processedData).length > 0){
      _that.basicData = _that.processedData
    }
    _that.processInputValue();
  }
}
</script>

<style scoped>
.basic-data-template-for-test-case {
  width: 100%;
}

.button-content {
  height: 100%;
  width: 100%;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-item{
  width: 126px;
  height: 25px;
  margin: 0 0 1px 0;
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
