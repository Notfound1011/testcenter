import crypto from 'crypto';
import {Message, Notification} from 'element-ui'

// 消息通知
export function notificationTips (type, title, message) {
  // type : success | warning | error | info
  switch (type) {
    case 'success':
    case 'warning':
      Notification({title: title, message: message, type: type, position: 'bottom-left', showClose: false})
      break
    case 'info':
      Notification.info({title: title, message: message, position: 'bottom-right'})
      break
    case 'error':
      Notification.error({title: title, message: message, position: 'top-right'})
      break
  }
}

// 消息提示
export function messageTips (type, message) {
  switch (type) {
    case 'success':
    case 'warning':
      Message({message: message, type: type,  center: true})
      break
    case 'info':
      Message.info(message)
      break
    case 'error':
      Message.error(message)
      break
  }
}

// 保存表单数据给后续页面初始化加载用
export function saveCrucialData (routePath, data = null, result = null) {
  if (data !== null) {
    const dataKeys = Object.keys(data)
    for (let j = 0; j < dataKeys.length; j++) {
      const mixKey = routePath + '#' + dataKeys[j]
      window.localStorage.setItem(mixKey, data[dataKeys[j]])
    }
  }
  if (result !== null) {
    const resMixKey = routePath + '#res_result'
    window.localStorage.setItem(resMixKey, JSON.stringify(result))
  }
}

// 数据初始化表单部分
export function initCrucialFromData(routePath, formData = []) {
  const keys = Object.keys(formData);

  for (let i = 0; i < keys.length; i++) {
    const mixKey = routePath + '#' + keys[i];

    if (window.localStorage.getItem(mixKey)) {
      formData[keys[i]] = decodeURIComponent(window.localStorage.getItem(mixKey));
    } else {
      formData[keys[i]] = formData[keys[i]];
    }
  }

  return formData;
}

// 数据初始化返回值部分
export function initCrucialResultData (routerPath) {
  let resResult
  const resMixKey = routerPath + '#res_result'
  if (window.localStorage.getItem(resMixKey)) {
    resResult = JSON.parse(window.localStorage.getItem(resMixKey))
  } else {
    resResult = []
  }
  return resResult
}

// 简单验签
export function parseNaguriHeader() {
  const naguriEmail = JSON.parse(window.localStorage.getItem('Admin-Token'))['email']
  const secretKey = "f6b68200fbf7b0e1d74635f8eb0fb2fd"
  const timestamp = new Date().getTime().toString();
  const signature = crypto.createHmac('md5', secretKey).update(timestamp).digest('hex');
  return {
    'naguri-timestamp': timestamp,
    'naguri-sign': signature,
    'naguri-email': naguriEmail
  };
}

// 延迟加载
export function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// tag
export function tagStyle(tagType) {
  switch (tagType) {
    case 'GET':
    case 'get':
      return '-'
    case 'POST':
    case 'post':
      return 'success'
    case 'PUT':
    case 'put':
      return 'warning'
    case 'DELETE':
    case 'delete':
      return 'danger'
    default:
      return 'info'
  }
}
