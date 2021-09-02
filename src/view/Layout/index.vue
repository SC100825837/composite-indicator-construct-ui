<template>
  <div>
    <div class="header">
      <!--左侧菜单展开关闭控制图标-->
      <div class="headerFold"><i class="el-icon-s-fold"></i></div>
      <!--最右侧用户信息包退出操作-->
      <div class="headerRight">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{this.$route.query.username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span @click="back">退出</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="navbar">
      <!--左侧菜单知识图谱logo-->
      <div class="zstpRightMenu">
        <i class="el-icon-menu"></i>
        <span style="color: #009cff">知识图谱</span>
      </div>
    </div>
    <div class="main">
      <div class="mainLeft">
        <div>
          <el-card class="mainLeft">
            <div slot="header" class="clearfix">
              <span>选择配置项</span>
            </div>
            <div>
              <el-form>
                <el-form-item label="缺失值填补:">
                  <el-select
                    placeholder="请选择缺失值"
                    @change="getselectMissId($event)"
                    v-model="missDataImputationName"
                  >
                    <el-option
                      v-for="item in missDataImputationData"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="多变量分析:">
                  <el-select
                    placeholder="请选择多变量值"
                    @change="getselectMulId($event)"
                    v-model="multivariateAnalysisName"
                  >
                    <el-option
                      v-for="item in multivariateAnalysisData"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标准化:">
                  <el-select
                    placeholder="请选择标准化值"
                    @change="getselectNorId($event)"
                    v-model="normalisationDateName"
                  >
                    <el-option
                      v-for="item in normalisationDate"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="权重与聚合:">
                  <el-select
                    placeholder="请选择权重与聚合值"
                    @change="getselectWegId($event)"
                    v-model="wegAndADataName"
                  >
                    <el-option
                      v-for="item in wegAndAData"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地区:">
                  <el-select
                    placeholder="请选择地区"
                    @change="getselectId($event)"
                    v-model="countryName"
                  >
                    <el-option
                      v-for="item in countrys"
                      :key="item.id"
                      :label="item.countryName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="buttonBtm">
                  <el-button type="primary" @click="submitIndicatorCalc"
                    >立即创建</el-button
                  >
                  <el-button @click="resetForm()">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
      </div>
      <div class="mainRight">
        <div class="mainHeader" style="text-align: right">
          <a href="javascript:void(0)" @click="requestFullScreen" class="fullScreen">全屏</a>
        </div>
        <div id="graphcontainerdiv" style="height:94%">
          <zstp  :graphList="submitGraph"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import zstp from "../zstp/index";
import $axios from "../../utils/utils";
export default {
  name: "layout",
  components: {
    zstp,
  },
  data() {
    return {
      //城市下拉框
      countrys: [],
      pzxData: {
        //算法选择参数
        algorithms: {
          missDataImputation:"",
          multivariateAnalysis:"",
          normalisation:'',
          weightingAndAggregation:"",
        },
        //地区得选择id
        indicatorConstructTarget:{
          id:'',
        },
      },
      //标准化
      normalisationDate: [],
      //权重与聚合
      wegAndAData: [],
      //缺失值名称
      missDataImputationData: [],
      //多变量分析
      multivariateAnalysisData: [],
      //标准化名称
      normalisationDateName: "",
      //权重与聚合名称
      wegAndADataName: "",
      //缺失值名称
      missDataImputationName: "",
      //多变量分析
      multivariateAnalysisName: "",
      //知识图谱得初期
      zstp: [],
      //地区名称
      countryName: "",
      value: "",
      //获取点击提交后数据
      submitGraph:{
        //判断是否点击
        submitOnFlg:false,
        //图谱数据
        nodes:[],
        edges:[]
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
      // 点击提交
    submitIndicatorCalc(){
      $axios.getIndicatorCalc(this.pzxData).then((res) => {
      this.submitGraph.submitOnFlg=true;
      this.submitGraph.edges=res.data.data.compIndGraphEdge;
      this.submitGraph.nodes=res.data.data.compIndGraphNode;
        // // //返回值数据获取
        // // this.zstpDate = res.data.data;
        // //调取图渲数据处理方法
        // this.setZsptData();
      });
  },
    //全屏
    requestFullScreen() {
      var element = document.getElementById("graphcontainerdiv");
      // var width = window.screen.width;
      // var height = window.screen.height;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      // FireFox
      else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
      // Chrome等
      else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
      // IE11
      else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    },
    //返回登录页面
    back(){
     this.$router.push({ path:'/'}) 
    },
    //获取初期配置项下拉菜单相关得数据
    getData() {
      //获取地区数据
      $axios.getCountryDate().then((res) => {
        this.countrys = res.data.data;
      });
      //获取算法相关数据
      $axios.getAlgorithmsAllDate().then((res) => {
        //标准化
        this.normalisationDate = res.data.data.normalisation ? res.data.data.normalisation : '';
        //权重与聚合
        this.wegAndAData = res.data.data.weightingAndAggregation ?res.data.data.weightingAndAggregation:'';
        //缺失值
        this.missDataImputationData = res.data.data.missDataImputation
          ? res.data.data.missDataImputation
          : [];
        //多变量名称
        this.multivariateAnalysisData = res.data.data.multivariateAnalysis
          ? res.data.data.multivariateAnalysis
          : [];
      });
      //获取知识图谱数据
    },

    //缺失值
    getselectMissId(id) {
      // //定义对象
      // if (this.missDataImputationData.length > 0) {
      //   //寻找id相同得数据信息
      //   obj = this.missDataImputationData.find((item) => {
      //     return item.id === id;
      //   });
      // }
      //标准化得传入值
        this.pzxData.algorithms.missDataImputation=id+'' ?id+'' :'';
        // this.missDataImputationName=obj.displayName;
    },

    //多变量
    getselectMulId(id) {
      // let obj = {};
      // if (this.multivariateAnalysisData.length > 0) {
      //   //寻找id相同得数据信息
      //   obj = this.multivariateAnalysisData.find((item) => {
      //     return item.id === id;
      //   });
        //标准化得传入值
        this.pzxData.algorithms.multivariateAnalysis=id+'' ?id+'' :'';
        // this.multivariateAnalysisName=obj.displayName;
      
    },

    //获取权重与聚合值
    getselectWegId(id) {
      // let obj = {};
      // //寻找id相同得数据信息
      // obj = this.wegAndAData.find((item) => {
      //   return item.id === id;
      // });
      //标准化得传入值
      //dataMap.name = obj.stepName;
      this.pzxData.algorithms.normalisation=id+'' ?id+'' :'';
      // this.wegAndADataName=obj.displayName;
    },

    //获取标准化得输入数据
    getselectNorId(id) {
      //定义对象
      // let obj = {};
      // //寻找id相同得数据信息
      // obj = this.normalisationDate.find((item) => {
      //   return item.id === id;
      // });
      //标准化得传入值
      // dataMap.id = id;
      // dataMap.name = obj.stepName;
      this.pzxData.algorithms.weightingAndAggregation=id+'' ?id+'' :'';
      // this.normalisationDateName=obj.displayName;
    },

    //获取地区下拉框id
    getselectId(id) {
      //  let obj = {};
      // obj = this.countrys.find((item) => {
      //   return item.id === id
      // });
      this.pzxData.indicatorConstructTarget.id=id+''?id+'' :'';
      // this.countryName=obj.displayName;
    },

    //清空
    resetForm() {
      //标准化名称
      this.normalisationDateName = "";
      //权重与聚合名称
      this.wegAndADataName = "";
      //缺失值名称
      this.missDataImputationName = "";
      //多变量分析
      this.multivariateAnalysisName = "";
      //地区名称
      this.countryName = "";
    },
  },
};
</script>
<style lang="scss" scoped>
#graphcontainerdiv {
  background: #f9fbfd;
}
/**头部样式 */
.header {
  position: absolute;
  line-height: 50px;
  top: 0px;
  left: 0px;
  right: 0px;
  //   background-color: #2d3a4b;
  border-bottom: solid 1px #e6e6e6;
  margin-left: 180px;
  height: 50px;
  //   margin-block-start: 1em;
  // margin-block-end: 1em;
  // margin-inline-start: 0px;
  // margin-inline-end: 0px;
  // padding-inline-start: 40px;
  border-radius: 0px !important;
}
.headerFold {
  width: 50px;
  font-size: 25px;
  text-align: center;
  position: absolute;
}
.headerRight {
  width: 100px;
  position: absolute;
  right: 0px;
}

/**左侧菜单 */
.navbar {
  position: absolute;
  width: 180px;
  height: 100%;
  top: 0px;
  left: 0px;
  bottom: 0px;
  overflow: auto;
  background-color: rgb(48, 65, 86);
  z-index: 1001;
}
.zstpRightMenu {
  color: #009cff;
  position: absolute;
  font-size: 17px;
  text-align: center;
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.zstpRightMenu:hover {
  background-color: #2c3e509c;
}
/**主区域 */
.main {
  position: absolute;
  top: 50px;
  left: 180px;
  bottom: 0px;
  right: 0px;
  //   padding: 10px;
  overflow: auto;
  //   background-color: red;
}
.mainLeft {
  position: absolute;
  width: 300px;
  border: 1px solid #35475e45;
  border-top: transparent;
  top: 1px;
  height: 100%;
  box-shadow: transparent !important;
}
.mainRight {
  //   background-color: red;
  margin-left: 300px;
  height: 100%;
}
.mainHeader {
  height: 50px;
  line-height: 50px;
  border-bottom: solid 1px #e6e6e6;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.buttonBtm {
  position: absolute;
  left: 50px;
  bottom: 0px;
}
.fullScreen{
  margin-right: 25px;
  text-decoration: none;
  color: black;
}
</style>
