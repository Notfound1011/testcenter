<template>
  <div>
    <!-- 新增和修改用例编辑框 -->
    <el-dialog :title="addNewCaseFlag ? '新增API用例': '修改API用例'" width="70%"
               :visible.sync="editCaseDialogVisible"
               :before-close="handleCancelDialog"
               @keydown.esc.stop="handleCancelDialog">
      <!-- 加了表单重置功能, 为了清理form的默认规则, 需要每次关闭, 打开销毁form 用 v-if -->
      <el-form v-if="editCaseDialogVisible" :model="apiCaseData" ref="apiCaseData" label-width="120px"
               style="width: 95%">
        <el-form-item label="用例名称" :rules="apiCaseRules.inputValueCheck" prop="case_name">
          <el-input placeholder="必填项, 不允许重复, 提交时会自动去掉头尾的空格." v-model.trim="apiCaseData.case_name"/>
        </el-form-item>
        <el-form-item label="接口path" :rules="apiCaseRules.requiredCheck" prop="path">
          <el-input placeholder="必填项, 仅输入接口路径即可, 例: /api/public/products-plus"
                    v-model.trim="apiCaseData.path"/>
        </el-form-item>
        <!--        这个要看下-->
        <el-form-item label="用例标签" :rules="apiCaseRules.requiredCheck" prop="mark">
          <el-select v-model="apiCaseData.mark" multiple filterable allow-create clearable
                     placeholder="用例的标签/标记, 支持多选，模糊筛选，自定义标签" style="width: 100%;">
            <el-option-group
              v-for="group in mark_options"
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
            <el-form-item label="接口类型" :rules="apiCaseRules.requiredCheck" prop="case_type">
              <el-select v-model="apiCaseData.case_type" placeholder="必选项">
                <el-option label="rest_api" value="rest_api"></el-option>
                <el-option label="pub_api" value="pub_api"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用例类型" :rules="apiCaseRules.requiredCheck" prop="template_type">
              <el-select v-model="apiCaseData.template_type" placeholder="必选项" @change="updateTemplateType">
                <el-option label="非模板" value="not_template"></el-option>
                <el-option label="现货模板" value="spot"></el-option>
                <el-option label="合约模板" value="contract"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="站点" :rules="apiCaseRules.requiredCheck" prop="web_site">
              <el-select v-model="apiCaseData.web_site" placeholder="必选项">
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
            <el-form-item label="触发条件单" prop="trigger_conditional_order">
              <el-switch v-model="apiCaseData.trigger_conditional_order"
                         :disabled="!needHelpAndTriggerConditionalOrderStatus"/>
              <el-tooltip class="tooltip" effect="dark" placement="top"
                          content="是否需要达成触发价格, 如果不是'交易'的模板类型, 会在提交时[强制]修改为false.">
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="挂对手单" prop="need_help">
              <el-switch v-model="apiCaseData.need_help"
                         :disabled="!needHelpAndTriggerConditionalOrderStatus"/>
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
        <!--              <basic-data-template-for-test-case-->
        <!--                :depend-button="true"-->
        <!--                edit-key="depend"-->
        <!--                @update_basic_data="updateApiCaseData"-->
        <!--                :array-data="apiCaseData.depend instanceof Array ? apiCaseData.depend : []" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :span="6">-->
        <!--            <el-form-item label="用例后续清理" prop="clear_up">-->
        <!--              <basic-data-template-for-test-case-->
        <!--                :clearButton="true"-->
        <!--                edit-key="clear_up"-->
        <!--                @update_basic_data="updateApiCaseData"-->
        <!--                :array-data="apiCaseData.clear_up instanceof Array ? apiCaseData.depend : []" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-form-item label="请求-params" prop="params">
          <basic-data-template-for-test-case
            edit-key="params"
            @update_basic_data="updateApiCaseData"
            :basic-data="apiCaseData.params"
            ref="basicDataTemplateByParams"/>
        </el-form-item>

        <el-form-item label="请求-json" prop="body_by_json">
          <basic-data-template-for-test-case
            edit-key="body_by_json"
            @update_basic_data="updateApiCaseData"
            :basic-data="apiCaseData.body_by_json"
            ref="basicDataTemplateByJson"/>
        </el-form-item>
        <el-form-item label="预期结果" prop="expect">
          <el-tabs>
            <el-tab-pane label="Response">
              <basic-data-template-for-test-case
                edit-key="response"
                @update_basic_data="updateApiCaseData"
                :basic-data="apiCaseData.expect"
                ref="basicDataTemplateByExpectResponse"
                style="width: 100%"/>
            </el-tab-pane>
            <el-tab-pane label="Socket">
              <basic-data-template-for-test-case
                edit-key="socket"
                @update_basic_data="updateApiCaseData"
                :basic-data="apiCaseData.expect"
                ref="basicDataTemplateByExpectSocket"
                style="width: 100%"/>
            </el-tab-pane>
            <!-- assert_level 改名为 _ASSERT_DATA_HIERARCHY -->
            <el-tab-pane v-if="apiCaseData.expect.socket" label="setSocketLevel">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" style="margin-top: 10px;"
                        placeholder='设置要验证的socket层级, 毕竟是流式推送, 而且返回的是列表, 存在处理速度不同, 列表顺序每次不一致, 需要特殊处理;
例: orders.[-1]'
                        v-model.trim="apiCaseData.expect.socket['_ASSERT_DATA_HIERARCHY']">
              </el-input>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item label="API文档链接" :rules="apiCaseRules.requiredCheck" prop="docs_url">
          <el-input placeholder='这里设置为yapi的链接即可' v-model.trim="apiCaseData.docs_url"/>
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

  </div>
</template>

<script>
import {isObjectValueEqual, popUpReminder, isNoneJson} from "@/common/js/utils";
import BasicDataTemplateForTestCase from './BasicDataTemplateForTestCase';
import log from "@/business/components/project/menu/Log";

export default {
  name: "TestCaseModify",
  props: ['mark_options'],
  components: {BasicDataTemplateForTestCase},
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
      editCaseDialogVisible: false,
      inputVisible: false,
      inputValue: '',
      update_data_origin: '',
      editCaseObjNew: [],

      // ↓ 新增的变更
      submitLoading: false,
      personData: {},
      // 数据基础结构,  每次关闭容器时, 重置到这个状态
      apiCaseDataModel: {
        case_name: '',
        mark: [],
        path: '',
        method: '',
        params: {},
        body_by_form: {},
        body_by_json: {},
        depend: [],
        expect: {'response': {}, 'socket': {}},
        case_type: '',
        remark: '',
        template_type: '',
        web_site: '',
        clear_up: [],
        trigger_conditional_order: false,
        need_help: false,
        status: true,
        docs_url: ''
      },
      // 表单验证内容
      apiCaseRules: {
        inputValueCheck: [
          {validator: validateInput, required: true, message: '请填写用例名称', trigger: ['change', 'blur']},
          {min: 1, max: 200, message: this.$t('commons.input_limit', [1, 200]), trigger: ['change', 'blur']}
        ],
        requiredCheck: {required: true, message: "缺少必填参数", trigger: ['change', 'blur']}
      },
      apiCaseData: {},
      rawApiCaseData: {},  // 如果是update case时, 用这个存储起来, 用于新老数据对比
      updateCaseId: null,  // 如果是update要更新这个值;
      // 提醒配置
      tipsConfig: {
        case_name: {'fieldName': '用例名称', 'placeholder': '必填项', 'coupledKey': 'case_name'},
      },
      // need_help 和 trigger_conditional_order 操作控制器, 除了交易类的 其余都默认为0, 并且不可操作,
      needHelpAndTriggerConditionalOrderStatus: true
    }
  },
  methods: {
    /**
     * @description 打开dialog的回调函数,
     * @param {Integer|undefined} caseId, apiCaseId, 变更传整数, 新增传undefined
     */
    openTestCaseEditDialog(caseId) {
      console.log(`点击打开咯 ${caseId}`)
      const _that = this;
      // 获取缓存在本地的信息
      const adminToken = JSON.parse(localStorage.getItem("Admin-Token"));
      // update personData
      _that.personData = {'id': adminToken.id, 'name': adminToken.name, 'email': adminToken.email}
      // 判断为真就是修改, 反之就是添加, 如果获取失败, 出现异常, 修改状态为 `添加case`
      if (caseId) {
        _that.addNewCaseFlag = false;
        // 如果请求失败, 把apiCaseData置为空, 并把addNewCaseFlag改为添加(作为兜底).
        _that.$axios.post("/pyServer/TestCase/Search", {'id': caseId}, {timeout: 2000})
          .then(result => {
            if (result.status === 200 && result.data.code === 0) {
              // 判断接口返回是否为空
              if (result.data.data instanceof Array && result.data.data[0] instanceof Object) {
                // _that.resetForm()
                _that.apiCaseData = result.data.data[0];
                _that.updateCaseId = _that.apiCaseData['id']
                // 删除无用字段
                delete _that.apiCaseData['id'];
                delete _that.apiCaseData['updated_at'];
                delete _that.apiCaseData['updated_person'];
                delete _that.apiCaseData['created_at'];
                delete _that.apiCaseData['created_person'];
                // 通过转json对象转字符串, 在转json达到深拷贝的目的,  不管添加还是新建都要
                _that.rawApiCaseData = JSON.parse(JSON.stringify(_that.apiCaseData));
                // 处理完数据, 打开 dialog
                _that.editCaseDialogVisible = true;
                // 这还有个打印
                console.log(_that.rawApiCaseData);
              } else {
                _that.addNewCaseFlag = true;
                _that.editCaseDialogVisible = true;
                popUpReminder(_that, '获取数据结构异常, 请联系开发者!', `id: ${caseId} `)
              }
            } else {
              _that.addNewCaseFlag = true;
              _that.editCaseDialogVisible = true;
              popUpReminder(_that, '获取数据失败, 请检查网络状态!', `id: ${caseId} `)
            }
          })
          .catch((err) => {
            console.log(err);
            _that.addNewCaseFlag = true;
            _that.editCaseDialogVisible = true;
            popUpReminder(_that, '请求失败, 请检查网络状态 or 联系开发者!', `id: ${caseId} `)
          })
      } else {
        _that.apiCaseData = JSON.parse(JSON.stringify(_that.apiCaseDataModel))
        _that.rawApiCaseData = JSON.parse(JSON.stringify(_that.apiCaseData))
        _that.addNewCaseFlag = true;
        _that.editCaseDialogVisible = true;
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
        _that.apiCaseData = JSON.parse(JSON.stringify(_that.rawApiCaseData));
        _that.$refs['apiCaseData'].resetFields();
        // 触发子组件的更新数据方法, 表单的 resetFields 是个异步函数,  重置的时候等200毫秒即可
        setTimeout(() => {
          _that.$refs['basicDataTemplateByJson'].handleBasicData()
          _that.$refs['basicDataTemplateByParams'].handleBasicData()
          _that.$refs['basicDataTemplateByExpectSocket'].handleBasicData()
          _that.$refs['basicDataTemplateByExpectResponse'].handleBasicData()
        }, 100)
      }).catch(_ => {
      })
    },
    /**
     * @description 关闭Dialog要处理的部分, 和提交差不多的处理方式, 先修正
     */
    handleCancelDialog() {
      const _that = this;
      if (isObjectValueEqual(_that.apiCaseData, _that.rawApiCaseData)) {
        _that.editCaseDialogVisible = false;
        _that.addNewCaseFlag = false;
        _that.apiCaseData = JSON.parse(JSON.stringify(_that.apiCaseDataModel));  // 每次重置为干净的数据
        // _that.$refs['apiCaseData'].clearValidate();  // 移除表单所有校验信息
      } else {
        _that.$confirm('确认取消, 不保存? ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '继续编辑',
          type: 'warning'
        }).then(() => {
          _that.editCaseDialogVisible = false;
          _that.addNewCaseFlag = false;
          _that.apiCaseData = JSON.parse(JSON.stringify(_that.apiCaseDataModel));
          // _that.$refs['apiCaseData'].clearValidate();
        }).catch(() => {
        })
      }
    },
    /**
     * @description 提交表单
     */
    onSubmit() {
      const _that = this;
      if (_that.submitLoading) {
        return;
      }
      if (isObjectValueEqual(_that.apiCaseData, _that.rawApiCaseData)) {
        _that.editCaseDialogVisible = false;   //如果前后数据没有变化，则直接关闭弹窗
      } else {
        // 每次点击 '确认' 按钮的话, 删除无效字段
        _that.removeInvalidFields();
        // 校验字段是否合法, 合法后才能弹出二次确认
        _that.$refs['apiCaseData'].validate((valid) => {
          if (!valid) {
            let errField = [];
            if (['', undefined, null].includes(_that.apiCaseData.case_name)) {
              errField.push('用例名称')
            }
            if (['', undefined, null].includes(_that.apiCaseData.path)) {
              errField.push('接口path')
            }
            if (['', undefined, null].includes(_that.apiCaseData.method)) {
              errField.push('请求方式')
            }
            if (['', undefined, null].includes(_that.apiCaseData.case_type)) {
              errField.push('接口类型')
            }
            if (['', undefined, null].includes(_that.apiCaseData.template_type)) {
              errField.push('用例类型')
            }
            if (['', undefined, null].includes(_that.apiCaseData.web_site)) {
              errField.push('执行站点')
            }
            if (!(_that.apiCaseData.mark instanceof Array) || (_that.apiCaseData.mark instanceof Array && _that.apiCaseData.mark.length === 0)) {
              errField.push('mark标签')
            }
            _that.$warning(`${errField.join(', ')} 尚未补充, 请补充后提交, 如果有特殊需求, 请联系开发者.`);
            return false;
          } else {
            let _caseName = _that.apiCaseData.case_name ? _that.apiCaseData.case_name : _that.rawApiCaseData.case_name
            // 弹出二次确认
            _that.$confirm('确定已完成编辑？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '继续编辑',
              type: 'warning'
            }).then(_ => {
              // removeEmptyField(_that.apiCaseData);
                _that.submitLoading = true;  // 变更按钮状态为loading
                let caseRequest = null;
                if (_that.addNewCaseFlag) {
                  _that.apiCaseData['created_person'] = _that.personData
                  caseRequest = _that.$axios.post("/pyServer/TestCase/Create", _that.apiCaseData, {timeout: 2000})
                } else {
                  // _that.apiCaseData['case_id'] = _that.updateCaseId
                  _that.apiCaseData['updated_person'] = _that.personData
                  // caseRequest = _that.$axios.post("/pyServer/TestCase/Update", _that.apiCaseData, {timeout: 2000})
                  caseRequest = _that.$axios.post("/pyServer/TestCase/Update", {'case_id': _that.updateCaseId, 'update_data': _that.apiCaseData}, {timeout: 2000})
                }
                caseRequest.then(res => {
                  _that.submitLoading = false;
                  if (res.data.code === 0) {
                    _that.$notify.success({
                      title: "用例名称: " + _caseName,
                      message: _that.$t(`用例${_that.addNewCaseFlag ? '新增' : '修改'}成功`).toString()
                    });
                    _that.editCaseDialogVisible = false;
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
              console.log(_that.apiCaseData)
            })
          }
        })
      }
    },
    /**
     * @description 处理自定义上报事件
     * @param {String} editKey 修改的key
     * @param {String||null} itemKey  如果为null 或者 '' 直接赋值, 如果有string值, 是变更
     * @param {Object} itemValue
     */
    updateApiCaseData(editKey, itemKey, itemValue) {
      const _that = this;
      if (editKey === 'response' || editKey === 'socket') {
        if (_that.apiCaseData['expect'] && _that.apiCaseData['expect'] instanceof Object) {
          _that.apiCaseData['expect'] = {[editKey]: {[itemKey]: itemValue}}
        } else {
          _that.apiCaseData['expect'][editKey] = {[itemKey]: itemValue}
        }
      } else if (['', null, undefined].includes(itemKey)) {
        _that.apiCaseData[editKey] = itemValue;
      } else if (_that.apiCaseData[editKey]) {
        _that.apiCaseData[editKey][itemKey] = itemValue
      } else {
        _that.apiCaseData[editKey] = {[itemKey]: itemValue}
      }
    },
    /**
     * @description 变更 模板类型 后, 修改 need_help 和 trigger_conditional_order 和页面 switch 的操作状态
     */
    updateTemplateType() {
      const _that = this;
      if (['spot', 'contract'].includes(_that.apiCaseData.template_type) && !_that.needHelpAndTriggerConditionalOrderStatus) {
        _that.needHelpAndTriggerConditionalOrderStatus = true;
      } else if (!['spot', 'contract'].includes(_that.apiCaseData.template_type) && _that.needHelpAndTriggerConditionalOrderStatus) {
        _that.needHelpAndTriggerConditionalOrderStatus = false;
        _that.apiCaseData.need_help = false;
        _that.apiCaseData.trigger_conditional_order = false;
      }
    },
    /**
     * @description 提交时, 移除无效字段, 和 _that.rawApiCaseData 对比较, 如果不同, 将保留, 相同则移除;
     * 不兼容 expect, 因为新版的它必定会传一个 socket 和 response 这个层级判断太麻烦了
     */
    removeInvalidFields() {
      const _that = this;
      // 判断是新增还是修改, 新增时, 只要是异常值就移除; 调用的上层加了判断, 如果无变化, 也不会调用这个方法;
      if (_that.addNewCaseFlag) {
        for (let key in _that.apiCaseData) {
          if (!_that.apiCaseData[key] || (_that.apiCaseData[key] instanceof Object && !isNoneJson(_that.apiCaseData[key]))) {
            delete _that.apiCaseData[key]
          }
        }
      } else {
        for (let key in _that.apiCaseData) {
          if (_that.apiCaseData[key] instanceof Object && isObjectValueEqual(_that.apiCaseData[key], _that.rawApiCaseData[key])) {
            delete _that.apiCaseData[key]
          } else if (!(_that.apiCaseData[key] instanceof Object) && _that.apiCaseData[key] === _that.rawApiCaseData[key]) {
            delete _that.apiCaseData[key]
          }
        }
      }
    }
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
