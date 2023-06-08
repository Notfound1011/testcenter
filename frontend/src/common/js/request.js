import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';

import {login} from '@/common/js/ajax';


class PyRequestError extends Error {
  constructor(error) {
    super(error);
    this.name = 'PyRequestError';
    this._errorReminder = function (){
      if (error.response.status === 200 && error.response.data.code !== 0){
        Vue.prototype.$notify({
          title: '执行失败!',
          message: error.response.data.msg ? error.response.data.msg : 'Execution failed, please contact the developer!',
          duration: 5000,
          type: 'warning'
        });
      }
      else if (error.response.status === 401) {
        Vue.prototype.$confirm('登录过期, 请重新登录!', '身份验证失败', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
            // login() // 原生自带的清理函数
          }
        ).catch()
      } else {
        Vue.prototype.$notify({
          title: '请求失败!',
          message: error.response.data.msg ? error.response.data.msg : 'Network Error!!!',
          duration: 5000,
          type: 'error'
        });
      }
    }
  }
}


export const pyRequest = axios.create({
  baseURL: "/api/tc/pyServer",
  timeout: 5000,
  // 把 params 的的list参数, 转成 a,b 这种
  paramsSerializer: function (params) {
    return qs.stringify(params, {arrayFormat: 'comma'});
  }
});


// 添加请求拦截器
pyRequest.interceptors.request.use(
  (config) => {
    // 在发送请求之前可以进行一些操作，例如添加认证信息、设置请求头等
    config.headers = {'X-Debug-Demo': 'heiHei'};
    return config;
  },
  (error) => {
    // 请求错误时的处理
    // ...

    return Promise.reject(error);
  }
);

// 添加响应拦截器
pyRequest.interceptors.response.use(
  (response) => {
    // 返回 response 对象, 不做任何处理;
    return response;
  },
  (error) => {
    throw new PyRequestError(error);
  }
);

export default pyRequest;
