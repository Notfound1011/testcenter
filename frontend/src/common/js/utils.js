import {
  COUNT_NUMBER,
  COUNT_NUMBER_SHALLOW,
  LicenseKey,
  ORIGIN_COLOR,
  ORIGIN_COLOR_SHALLOW,
  PRIMARY_COLOR,
  PROJECT_ID,
  PROJECT_NAME,
  THIRD_PARTY_INFO,
  TokenKey,
  WORKSPACE_ID,
  API_TEST_CONFIG_DATA
} from "./constants";
import {jsPDF} from "jspdf";
import JSEncrypt from 'jsencrypt';
import i18n from "@/i18n/i18n";
import _ from 'lodash'

export function hasRole(role) {
  let user = getCurrentUser();
  let roles = user.roles.map(r => r.id);
  return roles.indexOf(role) > -1;
}

export function hasPermission(permission) {
  let user = getCurrentUser();

  user.userGroups.forEach(ug => {
    user.groupPermissions.forEach(gp => {
      if (gp.group.id === ug.groupId) {
        ug.userGroupPermissions = gp.userGroupPermissions;
        ug.group = gp.group;
      }
    });
  });

  // todo 权限验证
  let currentProjectPermissions = user.userGroups.filter(ug => ug.group && ug.group.type === 'PROJECT')
    .filter(ug => ug.sourceId === getCurrentProjectID())
    .map(ug => ug.userGroupPermissions)
    .reduce((total, current) => {
      return total.concat(current);
    }, [])
    .map(g => g.permissionId)
    .reduce((total, current) => {
      total.add(current);
      return total;
    }, new Set);

  for (const p of currentProjectPermissions) {
    if (p === permission) {
      return true;
    }
  }

  let currentWorkspacePermissions = user.userGroups.filter(ug => ug.group && ug.group.type === 'WORKSPACE')
    .filter(ug => ug.sourceId === getCurrentWorkspaceId())
    .map(ug => ug.userGroupPermissions)
    .reduce((total, current) => {
      return total.concat(current);
    }, [])
    .map(g => g.permissionId)
    .reduce((total, current) => {
      total.add(current);
      return total;
    }, new Set);

  for (const p of currentWorkspacePermissions) {
    if (p === permission) {
      return true;
    }
  }

  let systemPermissions = user.userGroups.filter(gp => gp.group && gp.group.type === 'SYSTEM')
    .filter(ug => ug.sourceId === 'system' || ug.sourceId === 'adminSourceId')
    .map(ug => ug.userGroupPermissions)
    .reduce((total, current) => {
      return total.concat(current);
    }, [])
    .map(g => g.permissionId)
    .reduce((total, current) => {
      total.add(current);
      return total;
    }, new Set);

  for (const p of systemPermissions) {
    if (p === permission) {
      return true;
    }
  }

  return false;
}

export function hasLicense() {
  let v = localStorage.getItem(LicenseKey);
  return v && v === 'valid';
}

export function jenkinsAuth() {
  try {
    return JSON.parse(localStorage.getItem(THIRD_PARTY_INFO)).jenkins_auth
  } catch (e) {
    console.log(e)
  }
}

export function jiraAuth() {
  try {
    return JSON.parse(localStorage.getItem(THIRD_PARTY_INFO)).jira_auth
  } catch (e) {
    console.log(e)
  }
}

export function jiraAddress() {
  try {
    return JSON.parse(localStorage.getItem(THIRD_PARTY_INFO)).jira_address
  } catch (e) {
    console.log(e)
  }
}

export function hasPermissions(...permissions) {
  for (let p of permissions) {
    if (hasPermission(p)) {
      return true;
    }
  }
  return false;
}

export function getCurrentWorkspaceId() {
  return sessionStorage.getItem(WORKSPACE_ID);
}

export function getCurrentProjectID() {
  return sessionStorage.getItem(PROJECT_ID);
}

export function getCurrentProjectName() {
  return sessionStorage.getItem(PROJECT_NAME);
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(TokenKey));
}

export function getCurrentUserId() {
  let user = JSON.parse(localStorage.getItem(TokenKey));
  return user.id;
}

export function enableModules(...modules) {
  for (let module of modules) {
    let moduleStatus = localStorage.getItem('module_' + module);
    if (moduleStatus === 'DISABLE') {
      return false;
    }
  }
  return true;
}

export function saveLocalStorage(response) {
  // 登录信息保存 cookie
  localStorage.setItem(TokenKey, JSON.stringify(response.data));
  if (!sessionStorage.getItem(PROJECT_ID)) {
    sessionStorage.setItem(PROJECT_ID, response.data.lastProjectId);
  }
  if (!sessionStorage.getItem(WORKSPACE_ID)) {
    sessionStorage.setItem(WORKSPACE_ID, response.data.lastWorkspaceId);
  }
}

export function saveLicense(data) {
  // 保存License
  localStorage.setItem(LicenseKey, data);
}

export function removeLicense() {
  localStorage.removeItem(LicenseKey);
}

export function jsonToMap(jsonStr) {
  let obj = JSON.parse(jsonStr);
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

export function mapToJson(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return JSON.stringify(obj);
}

// 驼峰转换下划线
export function humpToLine(name) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

// 下划线转换驼峰
export function lineToHump(name) {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

// 查找字符出现的次数
export function getCharCountInStr(str, char) {
  if (!str) return 0;
  let regex = new RegExp(char, 'g'); // 使用g表示整个字符串都要匹配
  let result = str.match(regex);
  let count = !result ? 0 : result.length;
  return count;
}

export function downloadFile(name, content) {
  const blob = new Blob([content]);
  if ("download" in document.createElement("a")) {
    // 非IE下载
    //  chrome/firefox
    let aTag = document.createElement('a');
    aTag.download = name;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(aTag.href);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, name);
  }
}

export function listenGoBack(callback) {
  //监听浏览器返回操作，关闭该对话框
  if (window.history && window.history.pushState) {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', callback);
  }
}

export function removeGoBackListener(callback) {
  window.removeEventListener('popstate', callback);
}

export const uuid = function () {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

export function getUUID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


export function exportPdf(name, canvasList) {

  let pdf = new jsPDF('', 'pt', 'a4');

  // 当前页面的当前高度
  let currentHeight = 0;
  for (let canvas of canvasList) {
    if (canvas) {

      let contentWidth = canvas.width;
      let contentHeight = canvas.height;

      //a4纸的尺寸[595.28,841.89]
      let a4Width = 592.28;
      let a4Height = 841.89;

      // html页面生成的canvas在pdf中图片的宽高
      let imgWidth = a4Width;
      let imgHeight = a4Width / contentWidth * contentHeight;

      let pageData = canvas.toDataURL('image/jpeg', 1.0);

      // 当前图片的剩余高度
      let leftHeight = imgHeight;

      // 当前页面的剩余高度
      let blankHeight = a4Height - currentHeight;

      if (leftHeight > blankHeight) {
        if (blankHeight < 200) {
          pdf.addPage();
          currentHeight = 0;
        }
        //页面偏移
        let position = 0;
        while (leftHeight > 0) {
          // 本次添加占用的高度
          let occupation = a4Height - currentHeight;
          pdf.addImage(pageData, 'JPEG', 0, position + currentHeight, imgWidth, imgHeight);
          currentHeight = leftHeight;
          leftHeight -= occupation;
          position -= occupation;
          //避免添加空白页
          // if (leftHeight > 0) {
          // pdf.addPage();
          // currentHeight = 0;
          // }
        }
      } else {
        pdf.addImage(pageData, 'JPEG', 0, currentHeight, imgWidth, imgHeight);
        currentHeight += imgHeight;
      }
    }
  }

  pdf.save(name.replace(" ", "_") + '.pdf');

}

export function windowPrint(id, zoom) {
  //根据div标签ID拿到div中的局部内容
  let bdhtml = window.document.body.innerHTML;
  let el = document.getElementById(id);
  var jubuData = el.innerHTML;
  document.getElementsByTagName('body')[0].style.zoom = zoom;
  //把获取的 局部div内容赋给body标签, 相当于重置了 body里的内容
  window.document.body.innerHTML = jubuData;
  //调用打印功能
  window.print();
  document.getElementsByTagName('body')[0].style.zoom = 1;
  window.document.body.innerHTML = bdhtml;//重新给页面内容赋值；
  return false;
}

export function getBodyUploadFiles(obj, runData) {
  let bodyUploadFiles = [];
  obj.bodyUploadIds = [];
  if (runData) {
    if (runData instanceof Array) {
      runData.forEach(request => {
        obj.requestId = request.id;
        _getBodyUploadFiles(request, bodyUploadFiles, obj);
      });
    } else {
      obj.requestId = runData.id;
      _getBodyUploadFiles(runData, bodyUploadFiles, obj);
    }
  }
  return bodyUploadFiles;
}

export function _getBodyUploadFiles(request, bodyUploadFiles, obj) {
  let body = null;
  if (request.hashTree && request.hashTree.length > 0 && request.hashTree[0] && request.hashTree[0].body) {
    obj.requestId = request.hashTree[0].id;
    body = request.hashTree[0].body;
  } else if (request.body) {
    obj.requestId = request.id;
    body = request.body;
  }
  if (body) {
    if (body.kvs) {
      body.kvs.forEach(param => {
        if (param.files) {
          param.files.forEach(item => {
            if (item.file) {
              item.name = item.file.name ? item.file.name : item.name;
              bodyUploadFiles.push(item.file);
            }
          });
        }
      });
    }
    if (body.binary) {
      body.binary.forEach(param => {
        if (param.files) {
          param.files.forEach(item => {
            if (item.file) {
              item.name = item.file.name ? item.file.name : item.name;
              bodyUploadFiles.push(item.file);
            }
          });
        }
      });
    }
  }
}

export function handleCtrlSEvent(event, func) {
  if (event.keyCode === 83 && event.ctrlKey) {
    func();
    event.preventDefault();
    event.returnValue = false;
    return false;
  }
}

export function handleCtrlREvent(event, func) {
  if (event.keyCode === 82 && event.ctrlKey) {
    func();
    event.preventDefault();
    event.returnValue = false;
    return false;
  }
}

export function strMapToObj(strMap) {
  if (strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }
  return null;
}

export function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

export function setColor(a, b, c, d, e) {
  // 顶部菜单背景色
  document.body.style.setProperty('--color', a);
  document.body.style.setProperty('--color_shallow', b);
  // 首页颜色
  document.body.style.setProperty('--count_number', c);
  document.body.style.setProperty('--count_number_shallow', d);
  // 主颜色
  document.body.style.setProperty('--primary_color', e);
}

export function setDefaultTheme() {
  setColor(ORIGIN_COLOR, ORIGIN_COLOR_SHALLOW, COUNT_NUMBER, COUNT_NUMBER_SHALLOW, PRIMARY_COLOR);
}

export function publicKeyEncrypt(input, publicKey) {

  let jsencrypt = new JSEncrypt({default_key_size: 1024});
  jsencrypt.setPublicKey(publicKey);

  return jsencrypt.encrypt(input);
}

export function getNodePath(id, moduleOptions) {
  for (let i = 0; i < moduleOptions.length; i++) {
    let item = moduleOptions[i];
    if (id === item.id) {
      return item.path;
    }
  }
  return '';
}

export function getDefaultTableHeight() {
  return document.documentElement.clientHeight - 200;
}

/**
 * 全局的loading效果
 * @param component this,
 * @param text 自定义文本
 * @returns {*}
 */
export function fullScreenLoading(component, text) {
  return component.$loading({
    lock: true,
    text: text ? text: '资源切换中...',
    spinner: 'el-icon-loading',
    background: 'rgba(218,218,218,0.6)',
    customClass: 'ms-full-loading'
  });
}

export function stopFullScreenLoading(loading, timeout) {
  timeout = timeout ? timeout : 2000;
  setTimeout(() => {
    loading.close();
  }, timeout);
}

export function getShareId() {
  //let herfUrl = 'http://localhost:8080/sharePlanReport?shareId=bf9496ac-8577-46b4-adf9-9c7e93dd06a8';
  let herfUrl = window.location.href;
  if (herfUrl.indexOf('shareId=') > -1) {
    let shareId = '';
    new URL(herfUrl).searchParams.forEach((value, key) => {
      if (key === 'shareId') {
        shareId = value;
      }
    });
    return shareId;
  } else {
    if (herfUrl.indexOf("?") > 0) {
      let paramArr = herfUrl.split("?");
      if (paramArr.length > 1) {
        let shareId = paramArr[1];
        if (shareId.indexOf("#") > 0) {
          shareId = shareId.split("#")[0];
        }
        return shareId;
      }
    }
  }
  return "";
}

export function setCurTabId(vueObj, tab, ref) {
  vueObj.$nextTick(() => {
    if (vueObj.$refs && vueObj.$refs[ref]) {
      let index = tab.index ? Number.parseInt(tab.index) : vueObj.tabs.length;
      let cutEditTab = vueObj.$refs[ref][index - 1];
      let curTabId = cutEditTab ? cutEditTab.tabId : null;
      vueObj.$store.commit('setCurTabId', curTabId);
    }
  });
}

export function getTranslateOptions(data) {
  let options = [];
  data.forEach(i => {
    let option = {};
    Object.assign(option, i)
    option.text = i18n.t(option.text);
    options.push(option);
  });
  return options;
}

export function parseTag(data) {
  data.forEach(item => {
    try {
      let tags = JSON.parse(item.tags);
      if (tags instanceof Array) {
        item.tags = tags ? tags : [];
      } else {
        item.tags = tags ? [tags + ''] : [];
      }
    } catch (e) {
      item.tags = [];
    }
  });
}

// 自定义函数
export function removeEmptyFieldDeep(data, defaultStr = null) {
  // 普通数据类型
  if (typeof data != 'object' || data == null) {
    if ((data === '')) {
      return defaultStr;
    } else {
      return data;
    }
  }
  // 引用数据类型
  for (const v in data) {
    if (data[v] === '') {
      data[v] = null;
    }
    if (typeof data[v] == 'object') {
      removeEmptyField(data[v])
    }
  }
}

export function removeEmptyField(data, defaultStr = null) {
  // 普通数据类型
  if (typeof data != 'object' || data == null) {
    if ((data === '')) {
      return defaultStr;
    } else {
      return data;
    }
  }
  // 引用数据类型
  for (const v in data) {
    if (data[v] === '') {
      data[v] = null;
    }
  }
}

export function isObjectValueEqual(a, b) {
  // 不判断是否是同一内存地址, 兼容 undefined or null的场景
  if (a === undefined || a === null || b === undefined || b === null) {
    return a == b
  }
  // 获取两个对象键值数组
  let aProps = Object.getOwnPropertyNames(a)
  let bProps = Object.getOwnPropertyNames(b)
  // 判断两个对象键值数组长度是否一致，不一致返回false
  if (aProps.length !== bProps.length) return false
  // 遍历对象的键值
  for (let prop in a) {
    // 判断a的键值，在b中是否存在，不存在，返回false
    if (b.hasOwnProperty(prop)) {
      // 判断a的键值是否为对象，是则递归，不是对象直接判断键值是否相等，不相等返回false
      if (typeof a[prop] === 'object') {
        if (!isObjectValueEqual(a[prop], b[prop])) return false
      } else if (a[prop] !== b[prop]) {
        return false
      }
    } else {
      return false
    }
  }
  return true
}

export function formatTimeStamp(timeStamp) {
  let date = new Date(timeStamp);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

export function formatTimeStampToDay(timeStamp) {
  let date = new Date(timeStamp);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  return year + '-' + month + '-' + day + ' ';
}

export function formatTime(msTime) {
  let time = msTime / 1000;
  let hour = Math.floor(time / 60 / 60) % 24;
  let minute = Math.floor(time / 60) % 60;
  let second = Math.floor(time) % 60;
  if (hour === 0 && minute === 0) {
    return `${second}秒`
  } else if (hour === 0 && minute !== 0) {
    return `${minute}分${second}秒`
  } else {
    return `${hour}时${minute}分${second}秒`
  }
}

export function noRepeat(arr) {
  let ret = [];
  let hash = {};
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    let key = typeof (item) + item;
    if (hash[key] !== 1) {
      ret.push(item);
      hash[key] = 1;
    }
  }
  return ret;
}

// 按周分组
export function groupByWeek(date, value) {
  let newDate = [];
  let newValue = [];
  let newDate1 = [];
  let newValue1 = [];
  const weekArr = [];
  const indexArr = [];
  const moment = require('moment');

  /*遍历，把所有日期的年-周取出*/
  date.forEach((item) => {
    const yearWeek = `${moment(item).year()}-${moment(item).week()}周`;
    weekArr.push(yearWeek);
  });
  group(weekArr, 0, 0);

  /*根据分好组的下标信息开始截取原始数组*/
  indexArr.forEach((item) => {
    newDate1.push(weekArr.slice(item[0], item[item.length - 1] + 1));
    newValue1.push(value.slice(item[0], item[item.length - 1] + 1));
  });
  /*把每个分组的第一项拿出用于图表横坐标的值*/
  newDate1.forEach((item) => {
    newDate.push(item[0]);
  });
  /*计算纵坐标的和值*/
  newValue1.forEach((item) => {
    newValue.push(eval(item.join("+")));
  });
  return {
    newDate: newDate,
    newValue: newValue
  };

  //数组相同项合一组记录下标
  function group(arr, index, index1) {
    if (index < arr.length) {
      indexArr[index1] = [index];
      for (let i = index + 1; i < arr.length; i++) {
        if (arr[i] == arr[index]) {
          indexArr[index1].push(i);
        } else {
          group(arr, i, index1 + 1);
          break;
        }
      }
    }
  }
}

// 按月分组
export function groupByMonth(date, value) {
  const newDate = [];
  const newValue = [];
  const newDate1 = [];
  const newValue1 = [];
  const monthArr = [];
  const indexArr = [];
  /*遍历，把所有日期的月份取出*/
  date.forEach((item) => {
    item.split('-');
    monthArr.push(item.split('-')[1]);
  });
  group(monthArr, 0, 0);
  /*根据分好组的下标信息开始截取原始数组*/
  indexArr.forEach((item) => {
    newDate1.push(date.slice(item[0], item[item.length - 1] + 1));
    newValue1.push(value.slice(item[0], item[item.length - 1] + 1));
  });
  /*把每个分组的第一项拿出用于图表横坐标的值*/
  newDate1.forEach((item) => {
    newDate.push(item[0].split('-')[0] + "年" + item[0].split('-')[1] + "月");
  });
  /*计算纵坐标的和值*/
  newValue1.forEach((item) => {
    newValue.push(eval(item.join("+")));
  });
  return {
    newDate: newDate,
    newValue: newValue
  };

  //数组相同项合一组记录下标
  function group(arr, index, index1) {
    if (index < arr.length) {
      indexArr[index1] = [index];
      for (let i = index + 1; i < arr.length; i++) {
        if (arr[i] == arr[index]) {
          indexArr[index1].push(i);
        } else {
          group(arr, i, index1 + 1);
          break;
        }
      }
    }
  }
}

// 按年分组
export function groupByYear(date, value) {
  const newDate = [];
  const newValue = [];
  const newDate1 = [];
  const newValue1 = [];
  const yearArr = [];
  const indexArr = [];
  /*遍历，把所有日期的年份取出*/
  date.forEach((item) => {
    item.split('-');
    yearArr.push(item.split('-')[0]);
  });
  group(yearArr, 0, 0);
  /*根据分好组的下标信息开始截取原始数组*/
  indexArr.forEach((item) => {
    newDate1.push(date.slice(item[0], item[item.length - 1] + 1));
    newValue1.push(value.slice(item[0], item[item.length - 1] + 1));
  });
  /*把每个分组的第一项拿出用于图表横坐标的值*/
  newDate1.forEach((item) => {
    newDate.push(item[0].split('-')[0] + "年");
  });
  /*计算纵坐标的和值*/
  newValue1.forEach((item) => {
    newValue.push(eval(item.join("+")));
  });
  return {
    newDate: newDate,
    newValue: newValue
  };

  //数组相同项合一组记录下标
  function group(arr, index, index1) {
    if (index < arr.length) {
      indexArr[index1] = [index];
      for (let i = index + 1; i < arr.length; i++) {
        if (arr[i] == arr[index]) {
          indexArr[index1].push(i);
        } else {
          group(arr, i, index1 + 1);
          break;
        }
      }
    }
  }
}

export function removeEscape(str) {  //去除转义
  var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
}

/**
 * Converts a decimal number to a percentage string representation.
 * @param {number} data - The decimal number to convert.
 * @returns {string} - The percentage string representation.
 */
export function ChangeDecimalToPercentage(data) {
  // Multiply the decimal number by 100 and round to 2 decimal places
  const percentage = (data * 100).toFixed(2);
  // Return the percentage as a string with a "%" sign appended
  return `${percentage}%`;
}

export function groupArray(arr, name) {
  // 创建一个Map对象用于存储数据
  const map = new Map();

  // 遍历数组中的每一项
  arr.forEach(item => {
    let tmp, location;
    try {
      // 如果传入的名称是“created”，则读取对象的字段属性，否则读取对象字段属性的名称
      tmp = name === "created" ? item.fields[name] : item.fields[name].name;
      location = JSON.stringify(tmp);
      // 如果map中不存在location，则将该位置添加到map中，并将count设为1
      if (!map.has(location)) {
        map.set(location, {location: tmp, count: 1});
      } else {
        // 否则将该位置的count增加1
        map.get(location).count++;
      }
    } catch (e) {
      // 如果捕获到异常，则输出异常
      console.error(e);
    }
  });
  // 将map中的数据转化为数组，并按count值从大到小排序
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

// 导出 list2Map 函数，将数组转换为对象映射
export function list2Map(list, key) {
  // 初始化映射对象
  let map = {};
  // 判断传入的 list 是否为数组且数组长度大于0
  if (list && Array.isArray(list) && list.length > 0) {
    // 遍历 list 数组，将每个元素映射到 map 对象上
    list.forEach((item) => {
      // 判断该元素是否存在 key 属性
      item[key] ? (map[item[key]] = item) : "";
    });
  }
  // 返回映射对象
  return map;
}

//map 转 arr 方法
export function map2List(map) {
  let list = [];
  if (map && typeof map === "object") {
    for (let key in map) {
      list.push(map[key]);
    }
  }
  return list;
}

/**
 * @description: 获取关于api自动化的配置uuid
 * @param {String} typeName 获取的配置类型;
 * @return {String || null}
 */
export function getApiTestConfig(typeName) {
  let _ = null;
  for (_ in API_TEST_CONFIG_DATA) {
    if (API_TEST_CONFIG_DATA[_].type === typeName) {
      return API_TEST_CONFIG_DATA[_].uuid
    }
  }
  console.log('未获取到配置项!! 返回null!!')
  return null;
}

/**
 * @description 封装一个基本的提醒
 * @param {object} that this
 * @param {String} normalString 普通颜色的字符串
 * @param {String} specialString 带颜色的字符串
 * @param {String} msgType 消息等级 success/warning/info/error
 * @param {String} specialColor 具体颜色
 * @return {void}
 */
export function popUpReminder(that, normalString, specialString = '', msgType = 'error', specialColor = 'teal') {
  const h = that.$createElement;
  that.$message({
    duration: 5000,
    center: true,
    showClose: true,
    type: msgType,
    message: h('p', null, [
      h('i', {style: `color: ${specialColor}`}, specialString ? specialString : ''),
      h('span', null, ` ${normalString}  `)
    ])
  });
}

/**
 * @description 判断是否是json列表, 不会判断是否为空(list是python的字段类型)
 * @param {Array} jsonData
 * @return {Boolean}
 */
export function isJsonList(jsonData) {
  return Array.isArray(jsonData);
}

/**
 * @description 同上, 不过是判断是否是json键值对, 不会判断是否为空(dict是python的字段类型)
 * @param {Object} jsonData
 * @return {Boolean}
 */
export function isKeyValueObject(jsonData) {
  return Object.prototype.toString.call(jsonData) === '[object Object]'
}

/**
 * @description 时间戳转字符串, 如果 timestamp 非法, 设置为1
 * @param {String, Number} timestamp
 * @param {Boolean} utcTime 获取utc时间
 * @param {Boolean} dateOnly 仅日期
 * @return {String}
 */
export function timestampToTimeFormat(timestamp, utcTime = true, dateOnly = false) {
  if (!timestamp) {
    timestamp = 1
  }
  if (timestamp instanceof String) {
    timestamp = parseInt(timestamp)
  }
  if (timestamp < 1000000000000) {
    timestamp = timestamp * 1000
  }
  let date = new Date(timestamp)
  if (utcTime && dateOnly) {
    return `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)}`
  } else if (utcTime && !dateOnly) {
    return `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)} ${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}`;
  } else if (dateOnly) {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
  } else {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
  }
}

/**
 * 判断数值类型是否是空值, 排除bool, 数字型; 仅验证Json, 空格字符串, null 和 undefined;
 * @param value {String, Object}
 * @returns {boolean} Json, 空格字符串, null 和 undefined 为空返回true; 如果不为空, 或者非这几个类型的, false
 */
export function isEmptyValue(value) {
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  } else if (value === null || value === undefined) {
    return true;
  } else if (Array.isArray(value) && value.length === 0) {
    return true;
  } else {
    return isKeyValueObject(value) && Object.keys(value).length === 0  // 兜底, 如果为命中不到都为false
  }
}
/**
 * 判断两个数值是否相等,
 * @param a
 * @param b
 * @returns {boolean}
 */
export function isValueEqual(a, b) {
  // 先判断类型是否一致
  if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
    return false;
  }
  // 如果是数组类型
  if (Object.prototype.toString.call(a) === "[object Array]") {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!isValueEqual(a[i], b[i])) {
        return false;
      }
    }
  } else if (Object.prototype.toString.call(a) === "[object Object]") {
    if (Object.keys(a).length !== Object.keys(a).length) {
      return false;
    }
    for (let key in a) {
      if (!b.hasOwnProperty(key) || !isValueEqual(a[key], b[key])) {
        return false;
      }
    }
  } else {
    return a === b;
  }
  return true;
}

/**
 * 利用lodash库的cloneDeep进行深克隆
 * @param {Array | Object} data
 * @returns {Array | Object}
 */
export function jsonCloneDeep(data){
  return _.cloneDeep(data)
}
