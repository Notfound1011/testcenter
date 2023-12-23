<template>
  <div>
    <ms-container>
      <ms-main-container>
        <h2 style="font-weight:bold">{{ $t('api_test.job_scheduler.run_jobs') }}</h2>
        <div style="margin: 20px">
          <!-- table主体内容 -->
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="name" label="job名称" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column prop="url" label="jenkins地址" width="100" align="center">
              <template slot-scope="scope">
                <el-link :href="scope.row.url" target="_blank">
                  <div v-if="scope.row.url !== '' && scope.row.url != null">
                    <i class="el-icon-link" style="font-size: 15px; color: blue"></i>
                  </div>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="allure_report" label="查看测试报告" width="120" align="center">
              <template slot-scope="scope">
                <el-link :href="scope.row.allure_report"
                         v-if="scope.row.name !== 'JacocoTest'"
                         target="_blank">
                  <div v-if="scope.row.allure_report !== '' && scope.row.allure_report != null">
                    <i class="el-icon-view" style="font-size: 15px; color: blue"></i>
                  </div>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="上次构建用时" width="110"></el-table-column>
            <el-table-column prop="timestamp" label="上次构建时间" width="160"></el-table-column>
            <el-table-column prop="result" label="上次构建结果" width="110">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.result==='SUCCESS'" type="success" effect="dark">SUCCESS</el-tag>
                <el-tag v-if="scope.row.result==='RUNNING'" type="success" effect="dark">RUNNING</el-tag>
                <el-tag v-if="scope.row.result==='FAILURE'" type="danger" effect="dark">FAILURE</el-tag>
                <el-tag v-if="scope.row.result==='UNSTABLE'" type="warning" effect="dark">UNSTABLE</el-tag>
                <el-tag v-if="scope.row.result==='ABORTED'" type="info" effect="dark">ABORTED</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-video-play" @click="openDialog(scope.row)" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </ms-main-container>
    </ms-container>
    <el-dialog title="调度参数（不修改则使用默认值）" :visible.sync="dialogVisible" width="1100px"
               :before-close="dialogClose">
      <el-form :inline="true" :model="parameters" :rules="rules" ref="paramForm" label-width="140px" width="1000px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label=label.web_site prop="web_site">
              <el-select v-model="parameters.web_site" placeholder="选择站点" style="width: 300px">
                <el-option label="主站" value="phemex"></el-option>
                <el-option label="土耳其站" value="turkey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label=label.env prop="env">
              <el-select v-model="parameters.env" placeholder="选择执行环境" style="width: 300px"
                         @change="changePhemexHost">
                <el-option
                  v-for="item in options.env"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label=label.symbol_list prop="symbol_list">
          <el-input placeholder='输入交易symbol, 多条用","隔开' v-model="parameters.symbol_list" style="width: 843px"/>
          <el-tooltip class="item-tips" effect="dark"
                      content='设置交易symbol, 多条用","隔开; 依赖plan_type, 如果plan_type中不包含spot, contract将不执行'
                      placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label=label.case_type prop="case_type">
              <el-select v-model="parameters.case_type" multiple placeholder="选择Case类型" style="width: 300px">
                <el-option label="rest_api" value="rest_api"></el-option>
                <el-option label="pub_api" value="pub_api"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label=label.plan_type prop="plan_type">
              <el-select placeholder='选择计划类型' multiple v-model="parameters.plan_type" style="width: 300px">
                <el-option label="spot" value="spot"></el-option>
                <el-option label="contract" value="contract"></el-option>
                <el-option label="normal" value="normal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label=label.case_id_list prop="case_id_list">
          <el-input placeholder='填写case_id，多条用","隔开' v-model="parameters.case_id_list" style="width: 843px">
          </el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label=label.total_spot_price_multiple prop="total_spot_price_multiple">
              <el-input placeholder="USDT" v-model="parameters.total_spot_price_multiple" style="width: 300px"/>
              <el-tooltip class="item-tips" effect="dark"
                          content="设置倍数；价值基数为对应币对的最小quote价格" placement="right">
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label=label.total_contract_number prop="total_contract_number">
              <el-input placeholder="" v-model="parameters.total_contract_number" style="width: 300px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label=label.execution_case_mark prop="execution_case_mark">
              <el-input placeholder='' v-model="parameters.execution_case_mark" style="width: 300px"/>
              <el-tooltip class="item-tips" effect="dark" content='设置要执行的用例筛选的条件; 多条用","隔开'
                          placement="right">
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label=label.not_execution_case_mark prop="not_execution_case_mark">
              <el-input placeholder='' v-model="parameters.not_execution_case_mark" style="width: 300px"/>
              <el-tooltip class="item-tips" effect="dark"
                          content='设置不要执行的用例的筛选条件,多条用","隔开；线上账号kyc全部被剥夺, 需要过滤kyc的case.'
                          placement="right">
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item :label=label.mark_price_by_contract prop="mark_price_by_contract">
              <el-switch v-model="parameters.mark_price_by_contract"></el-switch>
              <el-tooltip class="item-tips" effect="dark"
                          content="合约是否按mark price计算; 如果是新合约, 没有ws推送的话, 这里会报错, 默认按last price计算."
                          placement="right">
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label=label.robot_pending_order prop="robot_pending_order">
              <el-switch v-model="parameters.robot_pending_order"></el-switch>
              <el-tooltip class="item-tips" effect="dark"
                          content="是否需要机器人挂单; 如果是新合约, 没有机器人挂单的话, 需要取消勾选"
                          placement="right">
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label=label.assert_socket_switch prop="assert_socket_switch">
              <el-switch v-model="parameters.assert_socket_switch"></el-switch>
              <el-tooltip class="item-tips" effect="dark"
                          content="合约现货可用, 其余的几乎没有要验证socket的部分 - 目前python使用的socket库连接不稳定, 先关掉后续更新库后打开"
                          placement="right">
                <i class="el-icon-question"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="runConfirm">运 行</el-button>
      </span>
    </el-dialog>
    <el-dialog title="调度参数（不修改则使用默认值）" :visible.sync="turkeyDialogVisible" width="70%"
               :before-close="turkeyDialogClose">
      <el-form :inline="true" :model="turkeyParameters" :rules="rules" ref="turkeyParamForm" label-width="140px">
        <el-form-item label="站点" prop="web_site">
          <el-select v-model="turkeyParameters.web_site" disabled placeholder="选择站点"
                     :style="{ width: width * 0.16+'px'}">
            <el-option label="土耳其站" value="turkey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label=label.env prop="env">
          <el-select v-model="turkeyParameters.env" @change="changeTurkeyHost" placeholder="选择执行环境"
                     :style="{ width: width * 0.16+'px'}">
            <el-option
              v-for="item in options.turkeyEnv"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label=label.rest_api_host prop="rest_api_host">
          <el-input placeholder="填写rest_api_host" v-model="turkeyParameters.rest_api_host"
                    :style="{ width: width * 0.16+'px'}"></el-input>
        </el-form-item>
        <el-form-item :label=label.ws_host prop="ws_host">
          <el-input placeholder="填写ws_host" v-model="turkeyParameters.ws_host"
                    :style="{ width: width * 0.16+'px'}"></el-input>
        </el-form-item>
        <el-form-item :label=label.pub_api_host prop="pub_api_host">
          <el-input placeholder="暂不填写" v-model="turkeyParameters.pub_api_host" disabled
                    :style="{ width: width * 0.16+'px'}"></el-input>
        </el-form-item>
        <el-form-item :label=label.case_type prop="case_type" class="form-item">
          <el-select v-model="turkeyParameters.case_type" multiple placeholder="选择case类型" style="width: 120%;">
            <el-option label="rest_api" value="rest_api"></el-option>
            <el-option label="pub_api" value="pub_api"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label=label.case_id_list prop="case_id_list" class="form-item">
          <el-input placeholder='填写case_id，多条用","隔开' v-model="turkeyParameters.case_id_list"
                    style="width: 120%;">
          </el-input>
        </el-form-item>
        <el-form-item :label=label.execution_case_mark prop="execution_case_mark" style="margin-left: 80px;">
          <el-tooltip class="tooltip" effect="dark" content='设置要执行的用例筛选的条件; 多条用","隔开'
                      placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-input placeholder='' v-model="turkeyParameters.execution_case_mark"
                    class="el-input_inner2"></el-input>
        </el-form-item>
        <el-form-item :label=label.not_execution_case_mark prop="not_execution_case_mark">
          <el-tooltip class="tooltip" effect="dark" content='设置不要执行的用例的筛选条件,多条用","隔开'
                      placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-input placeholder='' v-model="turkeyParameters.not_execution_case_mark"
                    class="el-input_inner2"></el-input>
        </el-form-item>
        <el-form-item :label=label.assert_socket_switch prop="assert_socket_switch" style="margin-left: 160px;">
          <el-tooltip class="tooltip" effect="dark"
                      content="合约现货可用, 其余的几乎没有要验证socket的部分 - 目前python使用的socket库连接不稳定, 先关掉后续更新库后打开"
                      placement="right">
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-switch v-model="parameters.assert_socket_switch"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="turkeyDialogClose">取 消</el-button>
        <el-button type="primary" @click="turkeyRunConfirm">运 行</el-button>
      </span>
    </el-dialog>
    <el-dialog title="任务调度" :visible.sync="normalDialogVisible" width="20%">
            <span slot="footer">
              <el-button @click="normalDialogClose">取 消</el-button>
              <el-button type="primary" @click="normalRunConfirm">运 行</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import {formatTimeStamp, formatTime, isValueEqual, jenkinsAuth} from "@/common/js/utils";

export default {
  name: "runJobs",
  components: {MsMainContainer, MsContainer},
  data() {
    let validateStrInput = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      let pattern = /^([a-zA-Z0-9]+[,])*([a-zA-Z0-9]+)$/;
      if (!pattern.test(value)) {
        callback(new Error(this.$t("输入的内容格式不正确").toString()));
      }
      callback();
    };
    return {
      result: {},
      width: document.body.clientWidth,
      JenkinsJobList: [],
      json: {},
      JobInfoList: {},
      Jenkins_Crumb: '',
      value: 'Testnet_Smoking_Test',
      dialogVisible: false,
      turkeyDialogVisible: false,
      normalDialogVisible: false,
      parameters: {
        env: 'fat2',
        web_site: 'phemex',
        symbol_list: 'sBTCUSDT,sETHUSDT,BTCUSD,uBTCUSD,cETHUSD',
        case_type: ['rest_api', 'pub_api'],
        total_spot_price_multiple: '1.5',
        total_contract_number: '5',
        case_id_list: '',
        robot_pending_order: true,
        plan_type: ['spot', 'contract', 'normal'],
        mark_price_by_contract: false,
        execution_case_mark: 'p0',
        not_execution_case_mark: 'error',
        assert_socket_switch: true,
        send_report: false  // 所有通过此页面调用的, 都不允许发送报告(会影响其他人)
      },
      turkeyParameters: {
        rest_api_host: 'https://api.fat.phemex.com.tr',
        // pub_api_host: 'https://testnet-api.phemex.com',
        ws_host: 'wss://ws.fat.phemex.com.tr',
        env: 'fat',
        web_site: 'turkey',
        case_type: ['rest_api', 'pub_api'],
        case_id_list: '',
        // plan_type: 'normal',
        execution_case_mark: 'p0',
        not_execution_case_mark: 'error',
        assert_socket_switch: false
      },
      runName: '',
      tableData: [
        {
          name: '',
          url: '',
          allure_report: '',
          result: ''
        }
      ],
      rules: {
        rest_api_host: [
          {required: true, message: '必填项', trigger: 'blur'},
        ],
        ws_host: [
          {required: true, message: '必填项', trigger: 'blur'},
        ],
        spot_symbol_list: [
          {validator: validateStrInput, message: '请检查数据格式', trigger: ['change', 'blur']},
        ],
        contract_symbol_list: [
          {validator: validateStrInput, message: '请检查数据格式', trigger: ['change', 'blur']},
        ],
      },
      jenkins_auth: jenkinsAuth(),
      label: {
        web_site: "站点",
        env: "运行环境",
        rest_api_host: "rest_host",
        pub_api_host: "pub_host",
        ws_host: "ws_host",
        symbol_list: "交易币对列表",
        case_type: "case类型",
        plan_type: "测试计划类型",
        case_id_list: "指定case id",
        total_spot_price_multiple: "spot价值(倍数)",
        total_contract_number: "合约成交数量",
        mark_price_by_contract: "是否取markPrice",
        robot_pending_order: "是否需要机器人挂单",
        assert_socket_switch: "是否验证socket消息",
        execution_case_mark: "筛选执行的用例",
        not_execution_case_mark: "不执行的用例"
      },
      options: {
        env: [
          {value: 'fat', label: 'fat'},
          {value: 'fat2', label: 'fat2'},
          {value: 'fat3', label: 'fat3'},
          {value: 'ea', label: 'ea'},
          {value: 'prod', label: 'prod'}
        ],
        turkeyEnv: [
          {value: 'fat', label: 'fat'},
          {value: 'prod', label: 'prod'}
        ]
      }
    }
  },
  activated() {
    const JenkinsInfo = JSON.parse(localStorage.getItem("JenkinsInfo"));
    this.Jenkins_Crumb = JenkinsInfo.Jenkins_Crumb;
    this.getJobList();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  beforeRouteLeave(to, from, next) {
    next();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    changePhemexHost() {
      switch (this.parameters.env) {
        case 'ea':
          this.parameters.case_type = ['rest_api']
          break;
        default:
          this.parameters.case_type = ['rest_api', 'pub_api']
      }
    },
    changeTurkeyHost() {
      if (this.turkeyParameters.env === "prod") {
        this.turkeyParameters.rest_api_host = 'https://api.phemex.com.tr'
        // this.parameters.pub_api_host = 'https://api.phemex.com'
        this.turkeyParameters.ws_host = 'wss://ws.phemex.com.tr'
      } else {
        this.turkeyParameters.rest_api_host = 'https://api.fat.phemex.com.tr'
        // this.parameters.pub_api_host = 'https://testnet-api.phemex.com'
        this.turkeyParameters.ws_host = 'wss://ws.fat.phemex.com.tr'
      }
    },
    async getJobList() {
      try {
        const res = await this.$axios.post("/jenkins/api/json?tree=jobs[name,url,description,builds[number,result,duration,timestamp,url]{0,1}]", null, {
          headers: {
            'Authorization': this.jenkins_auth,
            'Jenkins-Crumb': this.Jenkins_Crumb
          }
        });
        if (res.status === 200) {
          this.processJobListData(res.data.jobs);
          this.setupRefreshTimer();
        }
      } catch (e) {
        console.error(e);
      }
    },
    processJobListData(jobs) {
      // 先按照构建的时间戳进行排序
      this.tableData = jobs.sort((a, b) => {
        const aTimestamp = (a.builds && a.builds.length > 0) ? a.builds[0].timestamp : 0;
        const bTimestamp = (b.builds && b.builds.length > 0) ? b.builds[0].timestamp : 0;
        return bTimestamp - aTimestamp; // 降序排序
      });

      this.tableData.forEach(e => {
        this.JenkinsJobList.push(e.name)
        if (e.builds.length !== 0) {
          if (e.builds[0].result === null) {
            e.result = "RUNNING"
          } else {
            e.result = e.builds[0].result
            e.allure_report = e.builds[0].url + "allure/"
          }
          e.duration = formatTime(e.builds[0].duration)
          e.timestamp = formatTimeStamp(e.builds[0].timestamp)
        }
      })
    },
    setupRefreshTimer: function () {
      if (JSON.stringify(this.tableData).indexOf("RUNNING") !== -1 || JSON.stringify(this.tableData).indexOf("duration: \"0秒\"") !== -1) {
        clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval(() => {
          setTimeout(this.getJobList, 0)
        }, 1000 * 5)
      }
    },

    runJobs(name, body) {
      // 带参数的build
      if (body !== undefined) {
        console.log(body)
        let url = "/jenkins/job/" + name + "/buildWithParameters"
        this.$axios({
          url: url,
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.jenkins_auth,
            'Jenkins-Crumb': this.Jenkins_Crumb
          },
          transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          data: body,
          withCredentials: true
        }).then((res) => {
          this.$notify.success({
            title: "job执行成功",
            message: res.statusText
          });
          if (name === 'Testnet_Smoking_Test' || name === 'ApiAutoTestBaseAndDebug') {
            this.dialogVisible = false;
          } else if (name === 'ApiAutoTestToTurkey') {
            this.turkeyDialogVisible = false;
          }
          this.getJobList()
          this.timer = setInterval(() => {
            setTimeout(this.getJobList, 0)
          }, 1000 * 5)
        }).catch((error) => {
          this.$notify.error({
            title: "job执行失败",
            message: error,
          });
        })
      } else {
        // 不带参数的build
        let url = "/jenkins/job/" + name + "/build"
        this.$axios.post(url, null,
          {headers: {'Authorization': this.jenkins_auth, 'Jenkins-Crumb': this.Jenkins_Crumb}}).then((res) => {
          if (res.status === 201) {
            this.tableData = res.data.jobs
            this.$notify.success({
              title: "job执行成功",
              message: res.statusText
            });
            this.normalDialogVisible = false;
            this.getJobList()
            this.timer = setInterval(() => {
              setTimeout(this.getJobList, 0)
            }, 1000 * 5)
          } else {
            this.$notify.warning({
              title: "job执行失败",
              message: res.statusText
            });
          }
        }).catch((error) => {
          this.$notify.error({
            title: "job执行失败",
            message: error,
          });
        })
      }
    }
    ,

// 打开对话框，按job名称弹出不一样的对话框
    openDialog(item) {
      if (item.name === 'ApiAutoTestToTurkey') {
        this.resetForm();
        this.turkeyDialogVisible = true;
        this.runName = item.name;
        this.turkeyParametersOrigin = JSON.parse(JSON.stringify(this.turkeyParameters));
      } else if (item.name === 'Testnet_Smoking_Test' || item.name === 'ApiAutoTestBaseAndDebug') {
        this.resetForm();
        this.dialogVisible = true;
        this.runName = item.name;
        this.parametersOrigin = JSON.parse(JSON.stringify(this.parameters));
      } else {
        this.normalDialogVisible = true;
        this.runName = item.name;
      }
    }
    ,
    resetForm() {
      // 重置表单
      if (this.$refs['paramForm']) {
        this.$refs['paramForm'].validate(() => {
          this.$refs['paramForm'].resetFields();
          return true;
        });
      }
      // 重置表单
      if (this.$refs['turkeyParamForm']) {
        this.$refs['turkeyParamForm'].validate(() => {
          this.$refs['turkeyParamForm'].resetFields();
          return true;
        });
      }
    }
    ,

// 主站任务调度的弹框关闭
    dialogClose() {
      if (isValueEqual(JSON.parse(JSON.stringify(this.parameters)), this.parametersOrigin)) {
        this.dialogVisible = false;   //如果前后数据没有变化，则直接关闭弹窗
      } else {
        this.$confirm('job未执行，确认关闭？')
          .then(_ => {
            this.dialogVisible = false;
          })
          .catch(_ => {
          });
      }
    }
    ,
// 土站任务调度的弹框关闭
    turkeyDialogClose() {
      if (isValueEqual(JSON.parse(JSON.stringify(this.turkeyParameters)), this.turkeyParametersOrigin)) {
        this.turkeyDialogVisible = false;   //如果前后数据没有变化，则直接关闭弹窗
      } else {
        this.$confirm('job未执行，确认关闭？')
          .then(_ => {
            this.turkeyDialogVisible = false;
          })
          .catch(_ => {
          });
      }
    }
    ,
// 无运行参数的普通任务调度的弹框关闭
    normalDialogClose() {
      this.normalDialogVisible = false;
    }
    ,

// 主站任务调度的弹框确认
    runConfirm() {
      this.runJobs(this.runName, this.parameters)
    }
    ,
// 土站任务调度的弹框确认
    turkeyRunConfirm() {
      this.runJobs(this.runName, this.turkeyParameters)
    }
    ,
// 无运行参数的普通任务调度的弹框确认
    normalRunConfirm() {
      this.runJobs(this.runName)
    }

  }
}
</script>

<style scoped>
.el-input_inner {
  margin-left: 10px;
  width: 120px;
}

.el-input_inner2 {
  margin-left: 10px;
  width: 100px;
}

.tooltip {
  margin-right: 10px;
}

.item-tips {
  margin-left: 6px;
}

.form-item {
  margin-left: 20px;
}
</style>
