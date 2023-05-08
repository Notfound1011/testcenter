<template>
  <!-- 新增和修改用例编辑框, 宽度 1150px 刚好适配所有样式, 不想调了, 不许改! -->
  <el-dialog :title="addNewCaseFlag ? '新增API用例': '修改API用例'" width="1150px" :destroy-on-close="true"
             :close-on-click-modal=false :visible.sync="openDialog"
             :before-close="handleCancelDialog">

    <div ref="dialogContainer" style="position: relative;" />

    <el-form :model="apiCaseData" ref="apiCaseDataRef" label-width="120px" style="width: 95%" size="small">
      <el-form-item label="用例名称" :rules="apiCaseRules.inputValueCheck" prop="caseName">
        <el-input placeholder="必填项, 不允许重复, 提交时会自动去掉头尾的空格."
                  v-model.trim="apiCaseData.caseName"/>
      </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="接口path" :rules="apiCaseRules.requiredCheck" prop="path">
          <el-input placeholder="必填项, 仅输入接口路径即可, 例: /public/products-plus"
                    v-model.trim="apiCaseData.path"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用例标签" :rules="apiCaseRules.requiredCheck" prop="mark">
          <el-select v-model="apiCaseData.mark" multiple filterable allow-create clearable
                     placeholder="用例的[标签/标记], 支持多选，模糊筛选，自定义标签" style="width: 100%;">
            <el-option-group
              v-for="group in configData['markConfig']"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="适用环境" prop="applicableEnv">
            <el-select v-model="apiCaseData.applicableEnv" filterable multiple placeholder="指定运行的特殊环境, 为空默认全部." style="width: 90%;">
              <el-option
                v-for="item in configData['applicableEnvConfig']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-tooltip class="tooltip" effect="dark" placement="top"
                        content="有些依赖第三方回调, fat只能指定一个环境, 需要指定, 为空默认全部可以执行.">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适用账号" prop="applicableAccount">
            <el-select v-model="apiCaseData.applicableAccount" filterable multiple placeholder="指定账号类型, 为空默认全部." style="width: 90%;">
              <el-option
                v-for="item in configData['applicableAccountConfig']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-tooltip class="tooltip" effect="dark" placement="top"
                        content="适用账号类型, 匹配测试账号中的`适用场景`, 为空默认全部可以执行.">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="请求方式" :rules="apiCaseRules.requiredCheck" prop="method">
            <el-select v-model="apiCaseData.method" placeholder="必选项">
              <el-option label="get" value="get"></el-option>
              <el-option label="post" value="post"></el-option>
              <el-option label="put" value="put"></el-option>
              <el-option label="delete" value="delete"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="接口类型" :rules="apiCaseRules.requiredCheck" prop="caseType">
            <el-select v-model="apiCaseData.caseType" placeholder="必选项">
              <el-option label="rest_api" value="rest_api"></el-option>
              <el-option label="pub_api" value="pub_api"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用例类型" :rules="apiCaseRules.requiredCheck" prop="templateType">
            <el-select v-model="apiCaseData.templateType" placeholder="必选项" @change="updateTemplateType">
              <el-option label="非模板" value="normal"></el-option>
              <el-option label="现货模板" value="spot"></el-option>
              <el-option label="合约模板" value="contract"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="站点" :rules="apiCaseRules.requiredCheck" prop="webSite">
            <el-select v-model="apiCaseData.webSite" placeholder="必选项">
              <el-option label="国际站" value="phemex"></el-option>
              <el-option label="土耳其站" value="turkey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="用例状态" prop="status" required>
            <el-switch v-model="apiCaseData.status"/>
            <el-tooltip class="tooltip" effect="dark" placement="top"
                        content="默认是false, 关闭将不会执行该条case.">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="触发条件单" prop="triggerOrder">
            <el-switch v-model="apiCaseData.triggerOrder"
                       :disabled="!needOrderAndTriggerOrderStatus"/>
            <el-tooltip class="tooltip" effect="dark" placement="top"
                        content="是否需要达成触发价格, 如果不是'交易'的模板类型, 会在提交时[强制]修改为false.">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="挂对手单" prop="needOrder">
            <el-switch v-model="apiCaseData.needOrder"
                       :disabled="!needOrderAndTriggerOrderStatus"/>
            <el-tooltip class="tooltip" effect="dark" placement="top"
                        content="是否需要协助挂对手单, 如果不是'交易'的模板类型, 会在提交时[强制]修改为false.">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
<!--        <el-row>-->
<!--          <el-col :span="6">-->
<!--            <el-form-item label="用例执行依赖" prop="depend">-->
<!--              <depend-and-clean-up-for-modify-->
<!--                edit-key="depend"-->
<!--                @synchronize_basic_data="updateApiCaseData"-->
<!--                :processed-data="apiCaseData.depend"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-form-item label="用例后续清理" prop="clearUp">-->
<!--              <depend-and-clean-up-for-modify-->
<!--                edit-key="clearUp"-->
<!--                @synchronize_basic_data="updateApiCaseData"-->
<!--                :processed-data="apiCaseData.clearUp"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->

      <el-form-item label="请求-params" prop="params">
        <basic-data-template-for-modify
          edit-key="params"
          @synchronize_basic_data="updateApiCaseData"
          :processed-data="apiCaseData.params"
          ref="basicDataTemplateByParams"/>
      </el-form-item>

      <el-form-item label="请求-json" prop="bodyByJson">
        <basic-data-template-for-modify
          edit-key="bodyByJson"
          @synchronize_basic_data="updateApiCaseData"
          :processed-data="apiCaseData.bodyByJson"
          ref="basicDataTemplateByJson"/>
      </el-form-item>
      <el-form-item label="预期结果" prop="expect">
        <el-tabs>
          <el-tab-pane label="Response">
            <basic-data-template-for-modify
              edit-key="response"
              response-type
              @synchronize_basic_data="updateApiCaseData"
              :processed-data="apiCaseData.expect"
              ref="basicDataTemplateByExpectResponse" />
          </el-tab-pane>
          <el-tab-pane label="Socket">
            <basic-data-template-for-modify
              edit-key="socket"
              socket-type
              @synchronize_basic_data="updateApiCaseData"
              :processed-data="apiCaseData.expect"
              ref="basicDataTemplateByExpectSocket" />
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="API文档" :rules="apiCaseRules.requiredCheck" prop="docsUrl">
        <el-input placeholder='这里设置为YApi的链接即可' v-model.trim="apiCaseData.docsUrl"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input placeholder="非必填项, 可以输入一些该case相关介绍、适用范围等, 方便出问题时排查." type="textarea"
                  :autosize="{ minRows: 1, maxRows: 10 }" v-model="apiCaseData.remark"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm">重 置</el-button>
      <el-button @click="handleCancelDialog">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="submitLoading">
        {{ submitLoading ? '提交中...' : '确 定' }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  isValueEqual,
  popUpReminder,
  isEmptyValue,
  isKeyValueObject,
  getApiTestConfig,
  fullScreenLoading,
  jsonCloneDeep
} from "@/common/js/utils";
import BasicDataTemplateForModify from './BasicDataTemplateForModify.vue';

export default {
  name: "TestCaseModify",
  components: {BasicDataTemplateForModify},
  data() {
    /**
     * @description 仅验证必填输入框的内容是否为空
     * @param {*} rule
     * @param {*} value 输入内容, 根据表单字段
     * @param {*} callback
     */
    let validateInput = (rule, value, callback) => {
      if (!value || ['', undefined, null].includes(value)) {
        callback(new Error('缺少必填参数'));
      } else {
        callback();
      }
    };
    return {
      addNewCaseFlag: true,
      inputValue: '',
      openDialog: false,

      // ↓ 新增的变更
      submitLoading: false,
      // 每次执行操作前会保留的原始值
      rawApiCaseData: {},
      // 正在执行和操作的值
      apiCaseData: {
        // 必填的 + bool默认值的
        caseName: '',
        mark: [],
        path: '',
        method: '',
        caseType: '',
        templateType: '',
        webSite: '',
        triggerOrder: false,
        needOrder: false,
        status: false,
        docsUrl: '',
        // 非必填的, 默认值为null
        params: null,  // {}
        bodyByForm: null,  // {}
        bodyByJson: null,  // {}
        depend: null,  // []
        expect: null, // {'response': {}, 'socket': {}}
        remark: null,  // ''
        clearUp: null,  // []
        applicableEnv: null,  // []  select 组件默认会改成 []
        applicableAccount: null // [] 同上
      },
      // 表单验证内容
      apiCaseRules: {
        inputValueCheck: [
          {validator: validateInput, required: true, message: '请填写用例名称', trigger: ['change', 'blur']},
          {min: 1, max: 200, message: this.$t('commons.input_limit', [1, 200]), trigger: ['change', 'blur']}
        ],
        requiredCheck: {required: true, message: "缺少必填参数", trigger: ['change', 'blur']}
      },
      updateCaseId: null,  // 如果是update要更新这个值;
      // 提醒配置, 暂时还没生效
      tipsConfig: {
        caseName: {'fieldName': '用例名称', 'placeholder': '必填项', 'coupledKey': 'caseName'},
      },
      // needOrder 和 triggerOrder 操作控制器, 除了交易类的 其余都默认为0, 并且不可操作,
      needOrderAndTriggerOrderStatus: false,
      // 配置
      configData: {}
    }
  },
  methods: {
    /**
     * @description from的渲染
     */
    getTestCase() {
      const _that = this;
      console.log(`点击打开咯 ${_that.caseId}`)
      // 判断为真就是修改, 反之就是添加, 如果获取失败, 出现异常, 修改状态为 `添加case`
      if (_that.caseId) {
        // _that.addNewCaseFlag = copy;
        let loading = fullScreenLoading(_that, '资源加载中...', _that.$refs.dialogContainer);
        // 如果请求失败, 把apiCaseData置为空, 并把addNewCaseFlag改为添加(作为兜底).
        _that.$axios.get(`/pyServer/public/test-data/test-case/${_that.caseId}`, {timeout: 2000})
          .then(result => {
            if (result.status === 200 && result.data.code === 0) {
              // 判断接口返回是否为空
              if (isKeyValueObject(result.data.data)) {
                // _that.resetForm()
                _that.rawApiCaseData = result.data.data;
                // 如果是copy, 在name中增加--copy
                _that.rawApiCaseData['caseName'] = `${_that.rawApiCaseData['caseName']}${_that.copyCase ? '--copy': ''}`
                // 删除无用字段(不需要主动传向后端的, 用于做匹配用的)
                delete _that.rawApiCaseData['id'];
                delete _that.rawApiCaseData['docsId'];
                delete _that.rawApiCaseData['updatedAt'];
                delete _that.rawApiCaseData['createdAt'];
                delete _that.rawApiCaseData['updatedPerson'];
                delete _that.rawApiCaseData['createdPerson'];
                // 通过转json对象转字符串, 在转json达到深拷贝的目的,  不管添加还是新建都要
                _that.apiCaseData = jsonCloneDeep(_that.rawApiCaseData)
                // 这还有个打印
                console.log(_that.apiCaseData);
                _that.openDialog = true;
              } else {
                // 如果接口返回为空
                _that.openDialog = true;
                _that.addNewCaseFlag = true
                popUpReminder(_that, '获取数据结构异常, 请联系开发者!', `id: ${_that.caseId} `)
              }
            } else {
              // 如果接口请求失败
              _that.openDialog = true;
              _that.addNewCaseFlag = true
              popUpReminder(_that, '获取数据失败, 请检查网络状态!', `id: ${_that.caseId} `)
            }
          })
          .catch((err) => {
            // 如果请求异常
            console.log(err);
            _that.openDialog = true;
            _that.addNewCaseFlag = true
            popUpReminder(_that, '请求失败, 请检查网络状态 or 联系开发者!', `id: ${_that.caseId} `)
          })
        // 不管获取的结果如何, 都要去掉 loading
        loading.close();
      }else{
        // 新增的直接打开就行
        _that.openDialog = true;
      }
    },
    /**
     * @description 重置form表单数据, 最基本结果都在这, 表单的基础数据来源于你在打开dialog的form前model的传参,
     */
    resetForm() {
      const _that = this;
      _that.$confirm('确认重置表单数据? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '不重置',
        type: 'warning'
      }).then(_ => {
        _that.submitLoading = false;
        // 针对深层次的数据的话, 比如 expect 还是没办法用 resetFields 完全重置, copy 一下, 兜底
        _that.$refs.apiCaseDataRef.resetFields();  // 重置到初始状态
        this.$set(this, 'apiCaseData', jsonCloneDeep(_that.rawApiCaseData));
        // 触发子组件的更新数据方法, 表单的 resetFields 是个异步函数,  重置的时候等200毫秒即可
        setTimeout(() => {
          this.$refs['basicDataTemplateByJson'].processInputValue()
          this.$refs['basicDataTemplateByParams'].processInputValue()
          this.$refs['basicDataTemplateByExpectSocket'].processInputValue()
          this.$refs['basicDataTemplateByExpectResponse'].processInputValue()
        }, 100)
      }).catch(_ => {
      })
    },
    /**
     * @description 关闭Dialog要处理的部分, 和提交差不多的处理方式, 先修正
     */
    handleCancelDialog() {
      this.openDialog = false;
      this.$emit('update:initialVisible', false);
    },
    /**
     * @description 提交表单
     */
    onSubmit() {
      const _that = this;
      // 有些字段是el-select插件, 该组件会默认一个空的list, 这个后端不允许空list, 需要排除
      let tmpApiCaseData = _that.cleanEmptyValues(jsonCloneDeep(_that.apiCaseData))
      if (_that.submitLoading) {
        return;
      }
      if (isValueEqual(tmpApiCaseData, _that.rawApiCaseData)) {
        _that.handleCancelDialog();  // 如果前后数据没有变化，则直接关闭弹窗
      } else {
        // 校验字段是否合法, 合法后才能弹出二次确认
        _that.$refs.apiCaseDataRef.validate((valid) => {
          if (!valid) {
            let errField = [];
            if (['', undefined, null].includes(tmpApiCaseData.caseName)) {
              errField.push('用例名称')
            }
            if (['', undefined, null].includes(tmpApiCaseData.path)) {
              errField.push('接口path')
            }
            if (['', undefined, null].includes(tmpApiCaseData.method)) {
              errField.push('请求方式')
            }
            if (['', undefined, null].includes(tmpApiCaseData.caseType)) {
              errField.push('接口类型')
            }
            if (['', undefined, null].includes(tmpApiCaseData.templateType)) {
              errField.push('用例类型')
            }
            if (['', undefined, null].includes(tmpApiCaseData.webSite)) {
              errField.push('执行站点')
            }
            if (!(tmpApiCaseData.mark instanceof Array) || (tmpApiCaseData.mark instanceof Array && tmpApiCaseData.mark.length === 0)) {
              errField.push('mark标签')
            }
            _that.$warning(`${errField.join(', ')} 尚未补充, 请补充后提交, 如果有特殊需求, 请联系开发者.`);
            return false;
          } else {
            let _caseName = tmpApiCaseData.caseName // 弹出提示用的, caseName有可能会被移除, 提前摘出来
            // 上面校验完成后, 删除无效 or 无变更的字段(修改场景), 此时会返回一个新的数据
            tmpApiCaseData = _that.removeInvalidFields(tmpApiCaseData);
            const adminToken = JSON.parse(localStorage.getItem("Admin-Token"));
            // update personData
            tmpApiCaseData['operator'] = {'id': adminToken.id, 'name': adminToken.name, 'email': adminToken.email}
            // 弹出二次确认
            _that.$confirm('确定已完成编辑？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '继续编辑',
              type: 'warning'
            }).then(_ => {
              _that.submitLoading = true;  // 变更按钮状态为loading
              let caseRequest ;
              if (_that.addNewCaseFlag) {
                caseRequest = _that.$axios.post("/pyServer/test-data/test-case/create", tmpApiCaseData, {timeout: 2000})
              } else {
                tmpApiCaseData.caseId = _that.caseId
                caseRequest = _that.$axios.post("/pyServer/test-data/test-case/update", tmpApiCaseData, {timeout: 2000})
              }
              caseRequest.then(res => {
                _that.submitLoading = false;
                if (res.data.code === 0) {
                  _that.$notify.success({
                    title: "用例名称: " + _caseName,
                    message: _that.$t(`用例${_that.addNewCaseFlag ? '新增' : '修改'}成功`).toString()
                  });
                  _that.handleCancelDialog(); // 关闭 dialog
                  _that.$emit("refresh");
                } else {
                  _that.$notify.warning({
                    title: "用例名称: " + _caseName,
                    message: res.data
                  });
                }
              }).catch((error) => {
                _that.submitLoading = false;  // 变更按钮状态为loading
                _that.$notify.warning({
                  title: "用例名称: " + _caseName,
                  message: error
                });
              })
            }).catch(_ => {
              // 取消弹窗, 打印下目前数据
              console.log(tmpApiCaseData)
            })
          }
        })
      }
    },
    /**
     * @description 处理自定义上报事件
     * @param {String} editKey 修改的key, response socket params 之类的
     * @param {String||null} itemKey  如果有值代表是 basic 的, 如果为null 表示是 depend* 的
     * @param {Object} itemValue
     */
    updateApiCaseData(editKey, itemKey, itemValue) {
      const _that = this;
      // js的对象赋值都是引用, 修改引用
      let tmpData = (editKey === 'response' || editKey === 'socket') ? _that.apiCaseData['expect'] : _that.apiCaseData;
      tmpData = (tmpData === null? {}: tmpData);
      // 如果是空值, 直接执行删除了
      if (isEmptyValue(itemValue)){
        if (itemKey && tmpData.hasOwnProperty(editKey) && isKeyValueObject(tmpData[editKey]) && tmpData[editKey].hasOwnProperty(itemKey)){
          _that.$delete(tmpData[editKey], itemKey);
        } else if (!itemKey){
          tmpData[editKey] = null;
        }
      } else {
        // 如果有 itemKey 它一定是个keyValue
        if (itemKey && tmpData.hasOwnProperty(editKey) && isKeyValueObject(tmpData[editKey])){
          tmpData[editKey][itemKey] = itemValue
        }else if (itemKey){
          tmpData[editKey] = {[itemKey]: itemValue}
        }else{
          tmpData[editKey] = itemValue
        }
      }
    },
    /**
     * @description 变更 模板类型 后, 修改 needOrder 和 triggerOrder 和页面 switch 的操作状态
     */
    updateTemplateType() {
      const _that = this;
      if (['spot', 'contract'].includes(_that.apiCaseData.templateType) && !_that.needOrderAndTriggerOrderStatus) {
        _that.needOrderAndTriggerOrderStatus = true;
      } else if (!['spot', 'contract'].includes(_that.apiCaseData.templateType) && _that.needOrderAndTriggerOrderStatus) {
        _that.needOrderAndTriggerOrderStatus = false;
        _that.apiCaseData.needOrder = false;
        _that.apiCaseData.triggerOrder = false;
      }
    },
    /**
     * 仅验证一维数据;
     * @description 提交时, 移除无效字段, 和 _that.rawApiCaseData 对比较, 如果不同, 将保留, 相同则移除;
     * @param {Object} newApiCaseData
     * @returns {object} 清理后的新对象。
     */
    removeInvalidFields(newApiCaseData) {
      const _that = this;
      let tmpApiCaseData = JSON.parse(JSON.stringify(newApiCaseData))  // 怕有循环问题, 实际删除这个的key
      // 判断是新增还是修改, 新增时, 只要是异常值就移除; 调用的上层加了判断, 如果无变化, 也不会调用这个方法;
      if (_that.addNewCaseFlag) {
        for (let key in newApiCaseData) {
          // 先判断一个对象自身是否具有指定名称的属性, 防止误删其他元属性
          if (tmpApiCaseData.hasOwnProperty(key)) {
            if (isEmptyValue(tmpApiCaseData[key])) {
              delete tmpApiCaseData[key]
            }
          }
        }
      } else {
        for (let key in newApiCaseData) {
          if (tmpApiCaseData.hasOwnProperty(key)) {
            if ((tmpApiCaseData[key] instanceof Object) && isValueEqual(tmpApiCaseData[key], _that.rawApiCaseData[key])) {
              delete tmpApiCaseData[key]
            } else if (!(tmpApiCaseData[key] instanceof Object) && tmpApiCaseData[key] === _that.rawApiCaseData[key]) {
              delete tmpApiCaseData[key]
            } else if (isEmptyValue(tmpApiCaseData[key])) {
              delete tmpApiCaseData[key]
            }
          }
        }
      }
      return tmpApiCaseData
    },
    /**
     * 把无效值改为 null
     * @param apiCaseData
     * @returns {object} 清理后的新对象。
     */
    cleanEmptyValues(apiCaseData) {
      for (const key in apiCaseData) {
        if (apiCaseData.hasOwnProperty(key)) {
          const value = apiCaseData[key];
          if (value === '') {  // 如果值是空字符串，将其置为 null。
            apiCaseData[key] = null;
          } else if (Array.isArray(value) && value.length === 0) {  // 如果值是空数组，将其置为 null。
            apiCaseData[key] = null;
          } else if (typeof value === 'object' && value !== null) {  // 如果值是非空对象，递归清理其内部的空值。
            this.cleanEmptyValues(value);
            if (Object.keys(value).length === 0) {  // 如果内部对象全部为空值，将其置为 null。
              apiCaseData[key] = null;
            }
          }
        }
      }
      return apiCaseData;  // 返回清理后的对象。
    },
  },
  props: {
    // initialVisible: {
    //   type: Boolean,
    //   required: true
    // },
    caseId: {
      type: [Number, null, undefined],
      default: undefined
    },
    copyCase: {
      type: Boolean,
      required: true
    }
  },
  /**
   * 获取dialog的所有配置
   */
  created() {
    let markConfigId = getApiTestConfig('getMarkConfigByApiCase');
    let applicableEnvConfigId = getApiTestConfig('getEnvConfigByApiCase');
    let applicableAccountConfigId = getApiTestConfig('getApplicableAccountConfigByApiCase');
    this.$axios.get("/pyServer/public/test-data/test-config/search", {params: {'configId': `${markConfigId},${applicableEnvConfigId},${applicableAccountConfigId}`}})
      .then(res => {
        this.configData['markConfig'] = res.data.data[markConfigId]['configData']
        this.configData['applicableEnvConfig'] = res.data.data[applicableEnvConfigId]['configData']
        this.configData['applicableAccountConfig'] = res.data.data[applicableAccountConfigId]['configData']
      }).catch(() => {
    })
    // 判断 add还是copy
    this.addNewCaseFlag = !(this.caseId && !this.copyCase)
    // form 处理
    this.getTestCase();
  }
}
</script>

<style scoped>

.dialog-footer {
  text-align: center;
}

.el-icon-question {
  margin-left: 8px;
}

</style>
