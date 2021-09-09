import Axios from "axios";
import Qs from 'qs';
//获取地区数据
function getCountryDate(){
    return Axios({
        method:'get',
        url:'http://127.0.0.1:6060/country/getAllCountrys'
    })
}

//获取算法数据
function getAlgorithmsAllDate(){
    return Axios({
        method:'get',
        url:'http://127.0.0.1:6060/algorithm/getAllAlgorithms'
    })
}
// // 获取图谱初期值
// function getZsptDate(){
//     return Axios({
//         method:'get',
//         url:'http://127.0.0.1:6060/indicator/getCompIndNodeWithAllChild'
//     })
// }
// 获取图谱初期值
function getZsptDate(){
    return Axios({
        method:'get',
        url:'http://127.0.0.1:6060/indicator/getBaseGraph'
    })
}
// 提交配置项输入值返回结果更新图谱
function getIndicatorCalc(value){
    //debugger
    return Axios({
        method:'post',
        url:'http://127.0.0.1:6060/indicator/indicatorCalc',
        data:value,
    })
}
// 修改指标值提交
function updataIndexValue(value){
    debugger
    return Axios({
        method:'post',
        url:'http://127.0.0.1:6060/indicator/calcMdComposite',
        data:value,
    })
}
// 获取计算过程数据
function getProcessResult(){
  return Axios({
    method:'get',
    url:'http://127.0.0.1:6060/indicator/getProcessResult'
  })
}
// 获取原始数据集
function getOriginDataList(){
  //debugger
  return Axios({
    method:'get',
    url:'http://127.0.0.1:6060/indicator/getOriginDataList'
  })
}
// 数据重置
function resetData(){
  //debugger
  return Axios({
    method:'get',
    url:'http://127.0.0.1:6060/indicator/resetData'
  })
}
export default{
    getCountryDate,
    getAlgorithmsAllDate,
    getZsptDate,
    getIndicatorCalc,
    updataIndexValue,
    getProcessResult,
    getOriginDataList,
    resetData
}
