import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';

import {login} from '@/common/js/ajax';


class PyRequestError extends Error {
  constructor(error) {
    super(error);
    this.name = 'PyRequestError';
    this._error_reminder = function (){
      if (error.response.status === 401) {
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


const pyRequest = axios.create({
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
    // 对响应数据进行处理

    return response.data;
  },
  (error) => {
    throw new PyRequestError(error);
  }
);

export default pyRequest;
