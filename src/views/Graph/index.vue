<template>
  <div style="height: 97.5%" id="graph">
    <div class="mainLeft">
      <div class="change">
        <i class="el-icon-share">选择算法</i>
      </div>
      <el-card>
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
          <el-form-item label="构建对象:">
            <el-select
              placeholder="请选择构建对象"
              @change="getselectId($event)"
              v-model="countryName"
            >
              <el-option
                v-for="item in constructTargets"
                :key="item.id"
                :label="item.targetName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitIndicatorCalc"
            >指数计算
            </el-button>
            <el-button @click="resetForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="mainRight">
      <div id="mainHeader2">
        <div class="tupuShow"><i class="el-icon-s-marketing">图谱展示</i></div>
        <div class="btnShow">
          <el-button type="warning" @click="resetData()">数据重置</el-button>
          <!--        <el-button type="primary" @click="dialogVisibleOriginData = true"
                    >原始数据集</el-button
                  >-->
          <!-- :disabled="showVisiblePR" -->
          <el-button
            type="primary"
            @click="getProcessResult()"
          >查看过程结果
          </el-button>
          <el-button
            type="text"
            class="fullScreen"
            icon="el-icon-full-screen"
            @click="requestFullScreen"
          ></el-button>
          <!-- <a
            href="javascript:void(0)"
            @click="requestFullScreen"
            class="fullScreen"
            >全屏</a
          > -->
        </div>
      </div>
      <el-card id="graphcontainerdiv" style="height: 95.3%">
        <graph :graphList="submitGraph" ref="graph"/>
      </el-card>
    </div>
    <div class="origin-data-container">
      <el-dialog
        title="原始数据集"
        :modal-append-to-body="false"
        :visible.sync="dialogVisibleOriginData"
        center
        append-to-body
        width="65%"
      >
        <el-form :inline="true" label-width="120px">
          <el-row :gutter="10">
            <el-col>
              <el-table :data="originDataTable">
                <!--1、在每个需要点击可编辑的列里面都放置一个和那个列宽高都相等，且样式都一样的input输入框
                    2、使用v-if和v-else来控制input和span
                    3、让input的v-model和span绑定值是同一个，再定义一个变量来控制input和span的显示隐藏切换
                    4、当点击span的时候，span隐藏，input显示，这时显示的内容因为是和span绑定的内容一致的，所以更改会实时生效，不用事件去控制
                    5、当input失去焦点，input隐藏span显示-->
                <el-table-column
                  :prop="item"
                  :label="item"
                  align="center"
                  :key="index"
                  v-for="(item, index) in Object.keys(
                    originDataTable[0] ? originDataTable[0] : {}
                  )"
                >
                  <template slot-scope="{ row, $index }">
                    <!--                    前两列是id和国家名字不能编辑-->
                    <el-input
                      v-if="
                        ifEdit &&
                        Object.keys(originDataTable[0]).length > 2 &&
                        item !== Object.keys(originDataTable[0])[0] &&
                        item !== Object.keys(originDataTable[0])[1]
                      "
                      v-model="row[item]"
                      @blur="loseFocus(row, $index)"
                    >{{ row[item] }}
                    </el-input
                    >
                    <span v-else @click="handleEdit(item)">{{
                        row[item]
                      }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleOriginData = false">取 消</el-button>
          <el-button type="primary" @click="getModifiedData()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div id="result-container">
      <el-dialog
        title="计算过程结果"
        :modal-append-to-body="false"
        :visible.sync="dialogVisiblePR"
        @open="open()"
        center
        width="65%"
      >
        <el-form :inline="true" label-width="120px">
          <el-row :gutter="10">
            <el-col
              :key="alResultIndex"
              v-for="(alResultItem, alResultIndex) in processResult"
            >
              <!-- 表格数据展示-->
              <el-form-item :label="alResultItem.title">
                <el-form
                  v-if="!alResultItem.isContainPR"
                  :inline="true"
                >
                  <el-table
                    v-if="!alResultItem.isContainPR"
                    :data="alResultItem.data"
                    style="width:980px;margin-top:20px"
                  >
                    <el-table-column
                      :prop="item"
                      :label="item"
                      :key="index"
                      width="90%"
                      v-for="(item, index) in Object.keys(alResultItem.data[0])"
                    >
                    </el-table-column>
                  </el-table>
                </el-form>

                <!--矩阵数据展示-->
                <el-form
                  v-if="alResultItem.isContainPR"
                  :inline="true"
                >
                  <el-row :gutter="10">
                    <el-col
                      :key="index"
                      v-for="(item, index) in alResultItem.data"
                    >
                      <el-form-item>
                        <div
                          :id="item.title"
                          style="width:980px;height:500px;margin-top:30px"
                        ></div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import router from "@/router";
import graph from "./components/zstp.vue";
import $axios from "@/utils/utils";
import * as echarts from "echarts";

export default {
  name: "zstp",
  components: {
    graph,
  },
  data() {
    return {
      //是否修改了原始数据集
      ifOriginDataModified: false,
      //是否能修改的控制器
      ifEdit: false,
      //原始数据集
      originDataTable: [],
      //算法计算的过程结果
      processResult: {},
      //展示算法计算过程结果的弹窗
      dialogVisiblePR: false,
      //查看原始数据集的弹窗控制
      dialogVisibleOriginData: false,
      //查看计算结果按钮活性控制
      //展示算法计算过程结果的弹窗
      showVisiblePR: true,
      //城市下拉框
      constructTargets: [],
      pzxData: {
        //算法选择参数
        algorithms: {
          missDataImputation: "",
          multivariateAnalysis: "",
          normalisation: "",
          weightingAndAggregation: "",
        },
        //地区得选择id
        targetId: "",
        modifiedDataList: [],
        ciFrameworkObjectId: 0,
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
      graph: [],
      //地区名称
      countryName: "",
      value: "",
      //获取点击提交后数据
      submitGraph: {
        //判断是否点击
        submitOnFlg: false,
        //图谱数据
        nodes: [],
        edges: [],
      },
    };
  },
  created() {
    this.recentlyId = window.sessionStorage.getItem("recentlyId")
    this.getData();

    // this.getOriginDataList();
  },
  watch: {
    // 监控原始数据集数据，发生改变的时候跟新单元格显示状态
    // originDataTable: function () {
    //   console.log('数据更新')
    // }
  },
  methods: {
    toExcelPage() {
      router.push("/excel");
    },
    resetData() {
      // sessionstorage里面存的是null字符串
      if (this.recentlyId === null || this.recentlyId === "null") {
        this.$message.warning("数据为空，请导入数据")
        return;
      }
      $axios.resetData().then((res) => {
        this.ifOriginDataModified = false;
        (this.pzxData = {
          //算法选择参数
          algorithms: {
            missDataImputation: "",
            multivariateAnalysis: "",
            normalisation: "",
            weightingAndAggregation: "",
          },
          targetId: "",
          modifiedDataList: [],
        }),
          this.resetForm();
        this.$refs.graph.getTpData();
        // this.getOriginDataList();
      });
    },
    getModifiedData() {
      // console.log("getModifiedData", JSON.stringify(this.originDataTable))
      this.ifOriginDataModified = true;
      this.dialogVisibleOriginData = false;
    },
    //失去聚焦的方法
    loseFocus(row, name) {
      // console.log("loseFocus", row, name);
      this.ifEdit = false;
    },
    //单击单元格的方法
    handleEdit(proName) {
      // console.log("handleEdit", proName);
      this.ifEdit = true;
    },
    //获取原始数据集
    getOriginDataList() {
      $axios.getOriginDataList().then((res) => {
        // console.log("getOriginDataList - res", res)
        this.originDataTable = res.data.data;
        // this.dialogVisibleOriginData = true;
      });
    },
    //打开弹窗后执行的方法,据说是个延迟函数，不然打开弹窗没有值，应该是弹窗打开的时候没有渲染完成
    open() {
      this.$nextTick(() => {
        //  执行echarts方法
        this.loadEcharts();
      });
    },
    //加载Echarts图
    loadEcharts() {
      //循环算法结果的记录，在tai案例中有原始数据、缺失值插补、多变量分析、数据标准化、权重和聚合
      for (let key in this.processResult) {
        //判断是否具有过程结果，有的话用Echarts表示
        if (this.processResult[key].isContainPR) {
          //遍历算法内部的多个结果
          for (let weightKey in this.processResult[key].data) {
            let weightPR = this.processResult[key].data[weightKey];
            var chartDom = document.getElementById(weightPR.title);
            //echars图得显示位置控制
            if (weightPR.title === "相关性矩阵") {
              chartDom.style.paddingLeft = 0 + "px";
            } else {
              chartDom.style.paddingLeft = 120 + "px";
            }
            var myChart = echarts.init(chartDom);
            var option;
            var text = weightPR.title;
            var data = weightPR.data;

            data = data.map(function (item) {
              return [item[1], item[0], item[2] || "-"];
            });

            option = {
              title: {
                text: text,
                textStyle: {
                  fontSize: 13,
                  fontWeight: "lighter",
                },
              },
              tooltip: {
                position: "top",
              },
              grid: {
                height: '80%',
                width: '90%',
                top: "5%",
                left: "10%",
              },
              xAxis: {
                type: "category",
                data: weightPR.xaxis,
                splitArea: {
                  show: true,
                },
              },
              yAxis: {
                type: "category",
                data: weightPR.yaxis,
                splitArea: {
                  show: true,
                },
              },
              visualMap: {
                min: weightPR.minValue,
                max: weightPR.maxValue,
                calculable: true,
                orient: "horizontal",
                left: "center",
                bottom: "0%",
              },
              series: [
                {
                  name: "Punch Card",
                  type: "heatmap",
                  data: data,
                  label: {
                    show: true,
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                  },
                },
              ],
            };
            option && myChart.setOption(option);
          }
        }
      }
    },
    //拿到过程结果数据
    getProcessResult() {
      $axios.getProcessResult(this.recentlyId).then((res) => {
        // console.log("getProcessResult - res", res)
        this.processResult = res.data.data;
        //赋值完成后打开弹窗
        this.dialogVisiblePR = true;
      });
    },
    // 点击提交
    submitIndicatorCalc() {
      this.pzxData.ciFrameworkObjectId = window.sessionStorage.getItem("recentlyId")
      if (this.ifOriginDataModified) {
        this.pzxData.modifiedDataList = this.originDataTable;
        $axios.getIndicatorCalc(this.pzxData).then((res) => {
          //可查看计算结果
          this.showVisiblePR = false;
          this.submitGraph.submitOnFlg = true;
          // console.log('res.data.data',res.data.data);
          this.submitGraph.edges = res.data.data.compIndGraphEdge;
          this.submitGraph.nodes = res.data.data.compIndGraphNode;
        });
      } else {
        $axios.getIndicatorCalc(this.pzxData).then((res) => {
          //可查看计算结果
          this.showVisiblePR = false;
          this.submitGraph.submitOnFlg = true;
          // console.log('res.data.data',res.data.data);
          this.submitGraph.edges = res.data.data.compIndGraphEdge;
          this.submitGraph.nodes = res.data.data.compIndGraphNode;
          // // //返回值数据获取
          // // this.graphDate = res.data.data;
          // //调取图渲数据处理方法
          // this.setZsptData();
        });
      }
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
    back() {
      this.$router.push({path: "/"});
    },
    //获取初期配置项下拉菜单相关得数据
    getData() {
      //获取构建对象数据
      // console.log("getData", window.sessionStorage.getItem("recentlyId"))
      $axios.getAllCiConstructTargets(this.recentlyId).then((res) => {
        this.constructTargets = res.data.data;
      });
      //获取算法相关数据
      $axios.getAlgorithmsAllDate().then((res) => {
        //标准化
        this.normalisationDate = res.data.data.normalisation
          ? res.data.data.normalisation
          : "";
        //权重与聚合
        this.wegAndAData = res.data.data.weightingAndAggregation
          ? res.data.data.weightingAndAggregation
          : "";
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
      this.pzxData.algorithms.missDataImputation = id + "" ? id + "" : "";
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
      this.pzxData.algorithms.multivariateAnalysis = id + "" ? id + "" : "";
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
      this.pzxData.algorithms.normalisation = id + "" ? id + "" : "";
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
      this.pzxData.algorithms.weightingAndAggregation = id + "" ? id + "" : "";
      // this.normalisationDateName=obj.displayName;
    },

    //获取地区下拉框id
    getselectId(id) {
      //  let obj = {};
      // obj = this.constructTargets.find((item) => {
      //   return item.id === id
      // });
      this.pzxData.targetId = id + "" ? id + "" : "";
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
<style lang="scss">
#graph {
  .change {
    text-align: left;
    line-height: 45px;
    background: #fafafa;
    padding-left: 10px;
    color: #666;
  }

  #item2 {
    font-size: 14px !important;
  }

  #graphcontainerdiv {
    background: #f9fbfd;
    margin: 0px 10px 0px 10px;
  }

  #result-container {
    .el-table th > .cell {
      width: 125%;
      color: #4c4b4be6;
    }

    .el-form-item__label {
      font-size: 16px !important;
    }
  }

  #graphcontainerdiv {
    .el-card__body {
      padding: 0px;
      height: 100%;
    }
  }

  .graphRightMenu {
    color: #009cff;
    position: absolute;
    font-size: 17px;
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .graphRightMenu:hover {
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
    margin: 10px 0px 0px 10px;
    // border: 1px solid #35475e45;
    border-top: transparent;
    top: 1px;
    // height: 98.7%;
    box-shadow: transparent !important;
  }

  .mainRight {
    //   background-color: red;
    margin-left: 310px;
    height: 100%;
  }

  #mainHeader2 {
    margin: 10px 10px 0px 10px;
    line-height: 45px;
    background: #fafafa;

    .tupuShow {
      width: 20%;
      float: left;
      text-align: left;
      padding-left: 10px;
    }
  ;

    .btnShow {
      text-align: right;
      padding-right: 10px;
    }
  ;

    .el-card__body {
      padding: 0px !important;
    }

    .el-button {
      line-height: 0.5;
    }
  }

  .fullScreen {
    text-decoration: none;
    color: black;
  }

  .el-dialog {
    margin-top: 8vh !important;
    overflow-y: auto;
    height: 850px;
  }

  .el-icon-menu {
    font-size: 15px;
  }

  .el-dropdown {
    color: #fff;
    font-size: 14px;
  }
}
</style>
