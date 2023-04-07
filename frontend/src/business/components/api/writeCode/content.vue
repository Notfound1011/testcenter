<template>
  <div class="code-editor">
    <codemirror ref="jsonEditor" v-model="codeString" :options="cmOption" />
  </div>
</template>


<script>
import { codemirror } from 'vue-codemirror'
// import "codemirror/theme/blackboard.css"; // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入, 如果是默认就不用了！！
import "codemirror/mode/python/python"; // 这里引入的模式, 根据设置的mode引入，一定要引入！！
import 'codemirror/lib/codemirror.css';

export default {
  name: "writeCodeContent",
  components: {
    codemirror
  },
  data(){
    return{
      cmOption: {
        line: true, // 检查格式
        mode: 'text/x-python', // json数据高亮
        theme: 'default', // 设置主题 记得引入对应主题才有显示   import 'codemirror/theme/blackboard.css'
        tabSize: 4,  // tab的空格个数
        autocorrect: true,  // 自动更正
        spellcheck: true,  // 拼写检查
        lineNumbers: true, // 显示行号
        cursorHeight: 0.8, //光标高度，默认是1
        autoCloseBrackets: true,  // 输入和退格时成对
        matchBrackets: true, // 括号匹配
        lineWrapping: 'wrap', // 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
        showCursorWhenSelecting: true, // 文本选中时显示光标
        smartIndent: true, // 智能缩进
        readOnly: false, // 只读
        completeSingle: false // 当匹配只有一项的时候是否自动补全
      },
      codeString: 'print("累了")',
      // 所有数据, 渲染标签
      dataList: [
        {
          'codeType': '', 'codeText': '', '代码备注': '', '代码状态': '停用或者启用',
          '审批人列表': '', '审批处理人': '', '审批处理时间': '通过或者拒绝的时间', '审批状态': '', '审批备注': '',
          '创建人': '', '创建时间': '',
          '最近修改人': '', '修改时间': ''
        }
      ],
      // 新数据模板
      newItemData: {
        'codeType': '', 'codeText': '', '代码备注': '',
        '审批人列表': '',
        '创建人': ''
      }
    }
  },
  methods: {
    // 初始化
    downloadData(codeType){
      if (codeType){
        console.log('我就是一团火!')
      } else{
        console.log('去请求啦, 笨蛋!')
      }
    }
  }
}
</script>

<style scoped>
.code-editor{
}

</style>
