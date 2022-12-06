import { Message, Notification } from 'element-ui'

// 消息通知
export function notificationTips (type, title, message) {
  // type : success | warning | error | info
  switch (type) {
    case 'success':
    case 'warning':
      Notification({
        title: title,
        message: message,
        type: type,
        position: 'top-left',
        showClose: false
      })
      break
    case 'info':
      Notification.info({
        title: title,
        message: message,
        position: 'top-left'
      })
      break
    case 'error':
      Notification.error({
        title: title,
        message: message,
        position: 'top-left'
      })
      break
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
