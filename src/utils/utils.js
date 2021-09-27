import Axios from "axios";
import Qs from 'qs';

const ipAndPort = 'http://127.0.0.1:6060/';
// const ipAndPort = 'http://192.168.2.158:6060/';

//获取构建对象数据
function getAllCiConstructTargets(recentlyId) {
  return Axios({
    method: 'get',
    url: ipAndPort + 'constructTarget/getAllCiConstructTargets/' + recentlyId
  })
}

//获取算法数据
function getAlgorithmsAllDate() {
  return Axios({
    method: 'get',
    url: ipAndPort + 'algorithm/getAllAlgorithms'
  })
}

// // 获取图谱初期值
// function getZsptDate(){
//     return Axios({
//         method:'get',
//         url:ipAndPort + 'indicator/getCompIndNodeWithAllChild'
//     })
// }
// 获取图谱初期值
function getZsptDate(recentlyId) {
  return Axios({
    method: 'get',
    url: ipAndPort + 'indicator/getBaseGraph/' + recentlyId
  })
}

// 提交配置项输入值返回结果更新图谱
function getIndicatorCalc(value) {
  //debugger
  return Axios({
    method: 'post',
    url: ipAndPort + 'indicator/indicatorCalc',
    data: value,
  })
}

// 修改指标值提交
function updataIndexValue(value) {
  debugger
  return Axios({
    method: 'post',
    url: ipAndPort + 'indicator/calcMdComposite',
    data: value,
  })
}

// 获取计算过程数据
function getProcessResult(recentlyId) {
  return Axios({
    method: 'get',
    url: ipAndPort + 'indicator/getProcessResult/' + recentlyId
  })
}

// 获取原始数据集
function getOriginDataList() {
  //debugger
  return Axios({
    method: 'get',
    url: ipAndPort + 'indicator/getOriginDataList'
  })
}

// 数据重置
function resetData() {
  //debugger
  return Axios({
    method: 'get',
    url: ipAndPort + 'indicator/resetData'
  })
}

// 预览excel
function previewExcelContent(ciObjId, maxDepth) {
  //debugger
  return Axios({
    method: 'get',
    url: ipAndPort + 'ciFrameworkObject/previewExcelContent/' + ciObjId + "/" + maxDepth
  })
}

// 预览excel
function getRecentlyCiFrameworkObjectId() {
  //debugger
  return Axios({
    method: 'get',
    url: ipAndPort + 'ciFrameworkObject/getRecentlyId/'
  })
}

//excel之前表格
function ciFrameworkList() {
  //debugger
  return Axios({
    method: 'get',
    url: ipAndPort + 'ciFrameworkObject/list'
  })
}

// 删除架构对象
function deleteCiFrameworkObject(ciFrameworkObjectId) {
  return Axios({
    method: 'get',
    url: ipAndPort + 'ciFrameworkObject/delete/' + ciFrameworkObjectId
  })
}

//获取首页柱线对象的数据
function getCiFrameworkObjectInfo(ciFrameworkObjectId) {
  //debugger
  return Axios({
    method: 'get',
    url: ipAndPort + 'ciFrameworkObject/getCiFrameworkObjectInfo/' + ciFrameworkObjectId
  })
}

// 切换架构对象
function switchFrameObj(ciFrameworkObjectId) {
  return Axios({
    method: 'get',
    url: ipAndPort + 'ciFrameworkObject/switchFrameObj/' + ciFrameworkObjectId
  })
}

export default {
  getAllCiConstructTargets,
  getAlgorithmsAllDate,
  getZsptDate,
  getIndicatorCalc,
  updataIndexValue,
  getProcessResult,
  getOriginDataList,
  resetData,
  previewExcelContent,
  getRecentlyCiFrameworkObjectId,
  ciFrameworkList,
  deleteCiFrameworkObject,
  getCiFrameworkObjectInfo,
  switchFrameObj
}
