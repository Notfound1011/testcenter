// import PyRequestError from "@/common/js/request";


// 监听vue上的代码错误, 包括 async/await错误
export function generalError (err, vm, info) {
  // console.log('error-handler:', err)
  if (err.name === 'PyRequestError') {
    err._error_reminder()
  }
}

// 监听上面未捕获的 Promise 错误
export function promiseError (event) {
  // console.log(event)
  // console.log(event.reason)
  if (event.reason.name === 'PyRequestError'){
    // event.preventDefault();  // 阻止默认的错误行为, 不展示 Uncaught (in promise) 输出到控制台
    event.reason._error_reminder()
  }
}

