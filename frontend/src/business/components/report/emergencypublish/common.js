import { Message } from 'element-ui'

export function formRules () {
  return {
    publish_type: [{
      required: true,
      type: 'array',
      message: '请至少选择一个紧急发布类型',
      trigger: 'change'
    }],
    publish_service: [{
      required: true,
      type: 'array',
      message: '请至少选择一个相关变更服务',
      trigger: 'change'
    }],
    jira_link: [{
      required: false,
      message: '请输入JIRA链接相关JIRA链接',
      trigger: 'blur'
    }],
    config_pr: [{
      required: false,
      message: '请输入JIRA链接newconfig PR 链接',
      trigger: 'blur'
    }],
    change_audit_link: [{
      required: false,
      message: '请输入JIRA链接change_audit 链接',
      trigger: 'blur'
    }],
    confluence_link: [{
      required: false,
      message: '请输入confluence链接',
      trigger: 'blur'
    }],
    publish_reason: [{
      required: true,
      message: '请输入紧急变更概述',
      trigger: 'blur'
    }],
    developer: {users: [{
        required: true,
        type: 'array',
        message: '请至少选择一个相关开发人员',
        trigger: 'change'
      }]},
    reviewer: {users: [{
        required: true,
        type: 'array',
        message: '请至少选择一个开发review人员',
        trigger: 'change'
      }]},
    rollback_action: [{
      required: true,
      type: 'array',
      message: '请至少选择一个回滚策略',
      trigger: 'change'
    }],
    publish_time: [{
      required: true,
      message: '请选择预计变更时间',
      trigger: 'change'
    }],
    executor: {users: [{
        required: true,
        type: 'array',
        message: '请至少选择一个测试执行人',
        trigger: 'change'
      }]},
  }
}

// 消息提示
export function messageTips (type, message) {
  switch (type) {
    case 'success':
    case 'warning':
      Message({
        message: message,
        type: type
      })
      break
    case 'info':
      Message.info(message)
      break
    case 'error':
      Message.error(message)
      break
  }
}
