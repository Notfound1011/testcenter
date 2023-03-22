<template>
  <ms-container>
    <ms-main-container>

      <div>
        <h3>{{ $t('api_test.case_record.title') }}</h3>
        <el-button type="primary" @click="openTestCaseEditDialog(undefined)" class="add-btn" plain
                   v-permission="['PROJECT_API_CASE_RECORD:READ+CREATE']">{{ $t('api_test.case_record.add_case') }}
        </el-button>

        <floating-box box-height="50px" box-width="50px" @click.native="introductionStatus=true"
                      v-permission="['PROJECT_API_CASE_RECORD:READ+CREATE']" style="float:right">
          <p>介绍</p>
        </floating-box>

        <div>
          <el-divider></el-divider>
          <el-form :inline="true" class="demo-form-inline">
            <template>
              <el-select v-model="value" placeholder="请选择" style="margin-right: 10px" @change="clearKeywords">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <el-form-item @keyup.enter.native="search(keywords)">
              <el-input v-model="keywords" placeholder="请输入查询内容" clearable
                        v-if="value ==='caseName'"></el-input>
              <el-input v-model="keywords" placeholder='多条用逗号隔开' clearable
                        v-else-if="value ==='mark' || value ==='caseIdList'"></el-input>
              <el-input v-model="keywords" placeholder='输入查询路径' clearable v-else-if="value==='path'"></el-input>
              <el-select v-model="keywords" clearable placeholder="请选择" v-else-if="value==='method'">
                <el-option label="get" value="get"></el-option>
                <el-option label="post" value="post"></el-option>
                <el-option label="put" value="put"></el-option>
                <el-option label="delete" value="delete"></el-option>
              </el-select>
              <el-select v-model="keywords" clearable placeholder="请选择" v-else-if="value==='templateType'">
                <el-option label="非模板" value="not_template"></el-option>
                <el-option label="合约" value="contract"></el-option>
                <el-option label="现货" value="spot"></el-option>
              </el-select>
              <el-select v-model="keywords" clearable placeholder="请选择" v-else-if="value==='caseType'">
                <el-option label="rest_api" value="rest_api"></el-option>
                <el-option label="pub_api" value="pub_api"></el-option>
              </el-select>
              <el-select v-model="keywords" clearable placeholder="请选择" v-else-if="value==='webSite'">
                <el-option label=国际站 value="phemex"></el-option>
                <el-option label="土耳其站" value="turkey"></el-option>
              </el-select>
              <el-select v-model="keywords" clearable placeholder="请选择" v-else>
                <el-option label="启用" value="true"></el-option>
                <el-option label="停用" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(keywords)">{{ $t('commons.adv_search.search') }}</el-button>
            </el-form-item>
            <!--            <el-form-item>-->
            <!--              <el-button type="primary" @click="resetFilter">重置筛选项</el-button>-->
            <!--            </el-form-item>-->
            <!--高级搜索-->
            <el-form-item>
              <ms-table-adv-search-bar :condition.sync="condition" class="adv-search-bar" @search="combineSearch"
                                       v-if="condition.components !== undefined && condition.components.length > 0"/>
            </el-form-item>
          </el-form>
        </div>

        <!-- table主体内容 -->
        <!-- highlight-current-row高亮显示当前行(没加其他触发事件); height不需要设置, 自适应高度即可-->
        <el-table
          v-loading="getCaseListStatus"
          :data="tableData"
          :border="true"
          :highlight-current-row="true"
          :row-class-name="tableRowClassName"
          @filter-change="filter"
          @cell-dblclick="cell_dblclick"
          style="width: 100%">
          <el-table-column prop="id" label="ID" min-width="60" sortable fixed="left"></el-table-column>
          <el-table-column prop="caseName" label="用例名称" min-width="230" fixed="left"></el-table-column>
          <el-table-column prop="method" label="请求方法" min-width="100"
                           column-key="method">
          </el-table-column>
          <el-table-column prop="path" label="接口path" min-width="180"></el-table-column>
          <!--          <el-table-column prop="bodyByJson" label="json" :formatter="formatObject"-->
          <!--                           align="left" min-width="140" show-overflow-tooltip>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column prop="expect" label="预期结果" :formatter="formatObject"-->
          <!--                           align="left" min-width="140" show-overflow-tooltip>-->
          <!--          </el-table-column>-->
          <el-table-column prop="mark" label="用例标签" header-align="center" min-width="240">
            <template v-slot="scope">
              <el-tag v-for="item in scope.row.mark" :key="item" type="" effect="plain" class="tag-group">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <!--          <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>-->
          <!--          <el-table-column prop="updated_at" label="更新时间" sortable></el-table-column>-->
          <el-table-column prop="webSite" label="站点" min-width="80" column-key="webSite">
          </el-table-column>
          <el-table-column prop="templateType" min-width="80" label="模板类型" column-key="templateType">
            <template v-slot="scope">
              <div>{{scope.row.templateType === 'spot' ? '现货模板': scope.row.templateType === 'contract' ? '合约模板': '非模板'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="caseType" label="用例类型" min-width="100" column-key="caseType">
          </el-table-column>
          <el-table-column prop="docsUrl" label="API文档" min-width="80" align="center">
            <template slot-scope="scope">
              <el-link :href="scope.row.docsUrl" target="_blank">
                <div v-if="scope.row.docsUrl !== '' && scope.row.docsUrl != null">
                  <i class="el-icon-link" style="font-size: 15px; color: blue"></i>
                </div>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="applicableEnv" label="适用环境" min-width="180">
            <template v-slot="scope">
              <el-tag :key="tag" v-for="tag in scope.row.applicableEnv" type="" effect="plain" class="tag-group">
                {{tag}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applicableAccount" label="适用账号" min-width="240">
            <template v-slot="scope">
              <el-tag :key="tag" v-for="tag in scope.row.applicableAccount" type="" effect="plain" class="tag-group">
                {{tag}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdPerson" label="创建人" :formatter="formatCreatedData" min-width="100"/>
          <el-table-column prop="updatedPerson" label="更新人" :formatter="formatUpdatedData" min-width="100"/>
          <el-table-column prop="remark" label="备注" align="left" min-width="200"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template v-slot="scope">
              <el-tag :type="scope.row.status ? 'success' : 'danger'" effect="dark">
                {{ scope.row.status ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="120">
            <template v-slot="scope">
              <!--              <el-row>-->
              <!--                <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>-->
              <!--                <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>-->
              <!--              </el-row>-->
              <el-button type="primary" icon="el-icon-edit" @click="openTestCaseEditDialog(scope.row.id)"
                         circle v-permission="['PROJECT_API_CASE_RECORD:READ+EDIT']"></el-button>
              <el-button type="primary" icon="el-icon-document-copy" @click="openTestCaseEditDialog(scope.row.id, true)"
                         circle v-permission="['PROJECT_API_CASE_RECORD:READ+EDIT']"></el-button>
              <!--              <el-button type="danger" icon="el-icon-delete" @click="delCase(scope.$index)" circle disabled></el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="filterData.page" :page-sizes="[30, 50, 100, 200]" :page-size="filterData.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <test-case-modify ref="testCaseEditDialog"
                          @openTestCaseEditDialog="openTestCaseEditDialog" @refresh="getCaseList(filterData)"/>

        <!--table单元格弹窗-->
        <el-dialog title="详细信息" :visible.sync="tableDialogVisible" width="800px" append-to-body>
          <el-input
            type="textarea"
            v-model="json_body_detail"
            :autosize="{ minRows: 2, maxRows: 20}"
            :disabled="true">
          </el-input>
        </el-dialog>

        <!-- 字段介绍 -->
        <el-dialog title="字段介绍" :visible.sync="introductionStatus" width="800px" append-to-body>
          <h1>用例标签</h1>
          <ul>
            <li>
              spot, contract单指<span class="bold-and-underline">现货</span>和<span
              class="bold-and-underline">合约</span>交易相关的case;
            </li>
            <li>
              public, no_token_required, no_login_required, 如果用例标签包含这三个的其中一个, 将不使用token or
              加密(pub-web-gateway);
            </li>
            <li>每个case必须包含:
              <ul>
                <li>用例级别: 筛选case要用到的;</li>
                <li>用例类型: <span class="bold-and-underline">rest_api</span>是向<span class="bold-and-underline">web-gateway</span>请求,
                  <span class="bold-and-underline">pub_api</span>是向<span
                    class="bold-and-underline">pub-web-gateway</span>请求, host和token验证方式也不同;
                </li>
                <li>涉及服务名: 包含<span class="bold-and-underline">-</span>字符的尽量转为<span
                  class="bold-and-underline">-</span>, 可以使用api文档中的服务名或者实际服务名;
                </li>
              </ul>
            </li>
          </ul>
          <el-divider></el-divider>
        </el-dialog>
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>

import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
import TestCaseModify from "./components/TestCaseModify";
import TestCaseEdit from "../../track/case/components/TestCaseEdit";
import {humpToLine} from "@/common/js/utils";
import MsTableAdvSearchBar from "@/business/components/common/components/search/MsTableAdvSearchBar";
import {AUTO_TEST_SEARCH_CASE} from "../../common/components/search/search-components";
import floatingBox from "@/common/components/FloatingBox.vue";

export default {
  components: {TestCaseEdit, TestCaseModify, MsMainContainer, MsContainer, MsTableAdvSearchBar, floatingBox},
  data() {
    return {
      condition: {
        components: AUTO_TEST_SEARCH_CASE
      },
      options: [
        {value: 'caseIdList', label: '用例ID'},
        {value: 'caseName', label: '用例名称'},
        {value: 'path', label: '接口路径'},
        {value: 'mark', label: '用例标签(mark)'},
        {value: 'method', label: '请求类型'},
        {value: 'caseType', label: '用例类型'},
        {value: 'templateType', label: '模板类型'},
        {value: 'webSite', label: '站点'},
        {value: 'status', label: '用例状态'}
      ],
      value: 'caseName',
      keywords: '',
      deleteInfo: {
        case_id: 0
      },
      total: 0,
      tableData: [],
      tableDataList: [],
      json_body_detail: [],
      expect: [],
      bodyByJson: '',
      tableDialogVisible: false,

      filterData: {
        page: 1,
        limit: 30
      },
      getCaseListStatus: false,
      introductionStatus: false
    }
  },
  activated() {
    this.getCaseList(this.filterData);
  },
  methods: {
    /**
     * 判断每行状态,
     * @param row
     * @param rowIndex
     */
    tableRowClassName({row, rowIndex}) {
      if (!row.status) {
        return 'disabled-row'
      } else if (rowIndex % 2 === 0) {
        return 'stripe-row'
      } else {
        return ''
      }
    },
    /**
     * 重置筛选项,
     */
    resetFilter() {
      this.filterData = {page: 1, limit: 30};
      this.keywords = ''
      this.getCaseList(this.filterData)
    },
    clearKeywords() {
      this.keywords = ''
    },
    combineSearch() {
      let filterData = {'page': 1, 'limit': this.filterData.limit};
      if (!this.condition.combine) {
        this.resetFilter()
      }
      for (const i in this.condition.combine) {
        if (i === 'mark') {
          filterData[i] = this.condition.combine[i].value.trim().split(/,|，|\s+/)
        } else {
          filterData[i] = this.condition.combine[i].value
        }
      }
      this.keywords = '';
      this.filterData = filterData;
      this.getCaseList(filterData)
    },
    /**
     * 调整筛选项内容后, 执行筛选, 同一时间不能重复执行请求
     * @param requestBody json请求体,
     */
    getCaseList(requestBody) {
      if (this.getCaseListStatus) {
        return;
      } else {
        this.getCaseListStatus = true;
      }
      this.$axios.post("/pyServer/TestCase/Search", requestBody).then(res => {
        if (res.data.code === 0) {
          this.tableData = this.tableDataList = res.data.data
          this.total = res.data.total
        } else {
          this.$notify.warning({
            title: "用例查询失败",
            message: res.data
          });
        }
        this.getCaseListStatus = false;
      }).catch((error) => {
        this.$notify.error({
          title: "用例查询失败",
          message: error
        });
        this.getCaseListStatus = false;
      })
    },
    /**
     * 外部的搜索, 与高级搜索隔离
     * @param {String} keywords 搜索字段, 如果为空, 点击后是会重置搜索条件的
     */
    search(keywords) {
      // 每次点击按钮搜索, 默认page = 1, limit用当前的限制;
      let filterData = {'page': 1, 'limit': this.filterData.limit};
      if (keywords.split(' ').join('').length === 0) {
        this.filterData = filterData;
        this.getCaseList(filterData)
      } else {
        switch (this.value) {
          case "caseIdList" || "mark":
            filterData[this.value] = keywords.trim().split(/,|，|\s+/);
            break;
          default:
            filterData[this.value] = keywords.trim()
            break;
        }
        this.filterData = filterData;
        this.getCaseList(filterData);
      }
    },
    filter(filters) {
      for (let filter in filters) {
        if (filters.hasOwnProperty(filter)) {
          if (filters[filter] && filters[filter].length > 0) {
            this.filterData[humpToLine(filter)] = filters[filter].toString();
          } else {
            this.filterData[humpToLine(filter)] = null;
          }
        }
      }
    },
    humpToLine(name) {
      return name.replace(/([A-Z])/g, "_$1").toLowerCase();
    },
    cell_dblclick(row, column, cell, event) {
      //双击单元格打开展示详细信息
      if (column.property === "bodyByJson") {
        //根据bodyByJson获取详细信息
        this.json_body_detail = JSON.stringify(row.bodyByJson, null, 4);
        if (this.json_body_detail != null) {
          this.tableDialogVisible = true;
        }
      }
      if (column.property === "expect") {
        //根据expect循环获取预期结果详细信息
        this.json_body_detail = JSON.stringify(row.expect, null, 4);
        if (this.json_body_detail != null) {
          this.tableDialogVisible = true;
        }
      }
    },
    formatObject(row, column) {
      let expect = row[column.property];
      if (expect == null) {
        return expect
      }
      return JSON.stringify(expect, null, 4);
    },

    formatCreatedData(row, column) {
      let createdPerson = row[column.property];
      if (createdPerson !== null) {
        return createdPerson.name
      } else {
        return '-'
      }
    },
    formatUpdatedData(row, column) {
      let updatedPerson = row[column.property];
      if (updatedPerson !== null) {
        return updatedPerson.name
      } else {
        return '-'
      }
    },
    // <!--监听pageSize变化-->
    handleSizeChange(newSize) {
      this.filterData.limit = newSize
      this.getCaseList(this.filterData)
    },
    // <!--监听页码值变化-->
    handleCurrentChange(newPage) {
      this.filterData.page = newPage
      this.getCaseList(this.filterData)
    },

    //删除测试用例,暂时没用到
    delCase(idx) {
      this.$confirm('确认删除此用例信息？')
        .then(_ => {
          this.deleteInfo.case_id = this.tableData.splice(idx, 1)[0].id;
          this.$axios.delete("/pyServer/TestCase/Delete", {params: this.deleteInfo, headers: {'x_power': true}})
          this.$notify.warning({
            title: this.deleteInfo.case_id,
            message: this.$t('用例已删除').toString()
          });
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    /**
     * @description 传id的话, 防止页面长时间没刷新, 导致异常输入传入
     * @param {Integer|undefined} caseId, apiCaseId, 变更传整数, 新增传undefined
     * @param {Boolean} copy, 是否是复制case
     */
    openTestCaseEditDialog(caseId, copy = false) {
      this.$refs.testCaseEditDialog.openTestCaseEditDialog(caseId, copy);
    }
  },
  created(){
    // 如果路径上有查询参数,
    if (this.$route.query.caseId){
      this.value = 'caseIdList';
      this.keywords = this.$route.query.caseId;
      this.filterData['caseIdList'] = [this.$route.query.caseId];
    }
  }
}

</script>

<style>
.el-table .warning-row {
  background: radial-gradient(oldlace, white);
}

.el-table .disabled-row {
  background: radial-gradient(rgb(244, 121, 131), white);
}

.el-table .stripe-row {
  background: #F7F7F7;
}

.add-btn {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 10%;
}

.tag-group {
  margin: 2px;
}

.bold-and-underline {
  font-weight: bold;
  text-decoration: underline;
}
</style>
