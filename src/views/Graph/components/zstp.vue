<template>
  <div style="width: 100%; height: 100%">
    <div id="main" style="width: 100%; height: 100%"></div>
    <div
      id="updataDg"
      class="menu"
      style="
        display: none;
        height: 300px;
        width: 300px;
        overflow-y: auto;
        background: #eeeeee;
      "
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>修改指标值</span>
        </div>
        <div>
          <el-form label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="dgFrom.nodeName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="指标值">
              <el-input v-model="dgFrom.upIndicatorValue"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(dgFrom)"
              >提交
              </el-button
              >
              <el-button @click="resetForm(dgFrom)">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import $axios from "../../../utils/utils";

export default {
  data() {
    return {
      recentlyId: 0,
      graphDate: {},
      nodesNew: [],
      dgFrom: {
        //弹出框得节点名称
        nodeName: "",
        //弹出框可修改得指标值
        upIndicatorValue: "",
        //点击节点得id
        nodeId: "",
      },
      //判断节点是否有指标值
      dicValueFlg: false,
    };
  },
  props: {
    graphList: {
      type: Object,
      required: true,
    },
  },
  watch: {
    graphList: {
      handler(val) {
        this.getGrapDate(val);
      },
      deep: true,
    },
  },
  mounted() {
    //获取知识图谱数据
    this.getTpData();
  },
  created() {
    this.recentlyId = window.sessionStorage.getItem("recentlyId")
  },
  computed: {},
  methods: {
    //弹出框重置
    resetForm(formName) {
      // this.$refs[formName].resetFields();
    },
    //立即创建被点击时
    getGrapDate(value) {
      if (value.submitOnFlg) {
        this.graphDate = {};
        this.graphDate = this.graphList;
        this.setZsptData();
      }
    },
    //获取知识图谱数据
    getTpData() {
      // sessionstorage里面存的是null字符串
      if (this.recentlyId === null || this.recentlyId === "null") {
        this.$message.warning("数据为空，请导入数据")
        return;
      }
      //获取画面初期值
      $axios.getZsptDate(this.recentlyId).then((res) => {
        //返回值数据获取
        this.graphDate = res.data.data;
        // console.log("getZsptDate()", res.data.data);
        // console.log('');
        //调取图渲数据处理方法
        this.setZsptData();
      });
    },

    //知识图谱执行发放
    setZsptData() {
      var myChart = echarts.init(document.getElementById("main"));
      document.oncontextmenu = function () {
        var contextmenu = document.querySelector("#updataDg");
        contextmenu.style.display = "none";
      };
      myChart.on("contextmenu", (params) => {
        if (params.dataType === "node") {
          //判断点击的是图表的节点部分
          this.nodeClick(params);
          // 当鼠标点击后关闭右键菜单
          document.querySelector("#main").onclick = function () {
            var contextmenu = document.querySelector("#updataDg");
            contextmenu.style.display = "none";
          };
        }
      });
      //最关键，自动调整canvas的
      myChart.resize();
      //数组去空
      var categories = [];
      for (var i = 0; i < this.graphDate.nodes.length; i++) {
        categories[i] = {
          name: "类目" + i,
        };
      }
      var option = {
        // 图的标题
        title: {
          // text: "ECharts 关系图",
        },
        // 提示框的配置
        tooltip: {
          formatter: function (x) {
            return x.data.des;
          },
        },
        // 工具箱
        toolbox: {
          // 显示工具箱
          show: true,
          feature: {
            mark: {
              show: true,
            },
            // 还原
            restore: {
              show: true,
            },
            // 保存为图片
            saveAsImage: {
              show: true,
            },
          },
        },
        series: [
          {
            type: "graph", // 类型:关系图
            layout: "force", //图的布局，类型为力导图
            symbolSize: 60, // 调整节点的大小
            roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [2, 10],
            // edgeLabel: {
            //   normal: {
            //     textStyle: {
            //       fontSize: 20,
            //     },
            //   },
            // },
            force: {
              repulsion: 2500,
              edgeLength: [10, 50],
            },
            draggable: true,
            lineStyle: {
              normal: {
                width: 2,
                color: "#4b565b",
              },
            },
            edgeLabel: {
              normal: {
                show: false,
                formatter: function (x) {
                  return x.data.des;
                },
              },
            },
            //node节点名称
            label: {
              normal: {
                show: true,
                formatter(v) {
                  let text = v.name;
                  //判断是否是数值
                  // if (v.name.length) {
                  //   return text.length < 6
                  //     ? text
                  //     : `${text.slice(0, 7) + "..."}`;
                  // } else {
                  //   return text;
                  // }
                  return text;
                },
                textStyle: {},
              },
            },
            // 数据
            data: this.graphDate.nodes.map(function (node) {
              var dicValueFlg = false;
              if (node.attributes.indicatorValue) {
                dicValueFlg = true;
              } else {
                dicValueFlg = false;
              }
              return {
                //节点名称
                name: node.attributes.name
                  ? node.attributes.name
                  : node.attributes.indicatorValue,
                //节点描述
                des: node.lbName,
                id: node.id + "",
                category: node.category,
                flg: dicValueFlg,
                parentId: node.parentId,
              };
            }),
            //线数据
            links: this.graphDate.edges.map(function (edge) {
              return {
                //线得源头
                source: edge.sourceId + "",
                //线得终点
                target: edge.targetId + "",
                //线得描述
                des: edge.des,
              };
            }),
            categories: categories,
          },
        ],
      };
      myChart.setOption(option);
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    //设置echaers图，修改节点信息
    nodeClick(params) {
      // 获取右键菜单
      var menuBox = document.querySelector("#updataDg");
      //弹出框赋值
      var nodeName = '';
      this.dgFrom.nodeId = params.data.id;
      this.graphDate.nodes.map(function (node) {
        if (params.data.parentId === node.id) {
          nodeName = node.attributes.name;
          return false;
        }
      });
      this.dgFrom.nodeName = nodeName;
      this.dgFrom.upIndicatorValue = params.data.name;
      // 为文档绑定右键菜单事件
      document.oncontextmenu = function (e) {
        e = e || window.event;
        // 阻止浏览器的默认行为
        if (e && e.preventDefault) {
          e.preventDefault(); //防止浏览器默认行为(W3C)
        } else {
          window.event.returnValue = false; //IE中阻止浏览器行为
        }
        if (params.data.flg) {
          // 事件被触发时，显示右键菜单
          menuBox.style.display = "block";
          // 位置定位在当前鼠标的位置
          menuBox.style.left = params.event.offsetX - 30 + "px";
          menuBox.style.top = params.event.offsetY + 10 + "px";
        } else {
          // 事件被触发时，显示右键菜单
          menuBox.style.display = "none";
        }
        return false;
      };
    },
    //修改指标值提交按钮
    submitForm(fromdata) {
      // 获取右键菜单
      var menuBox = document.querySelector("#updataDg");
      //构建指标值修改传入参数
      var map = {};
      map[fromdata.nodeName] = fromdata.upIndicatorValue;
      //调用指标值修改提交方式
      $axios.updataIndexValue(map).then((res) => {
        //修改id赋值
        this.graphDate.nodes.map(function (node) {
          if (fromdata.nodeId === node.id) {
            node.attributes.indicatorValue = fromdata.upIndicatorValue;
          }
          //综合指标值赋值
          if (node.lbName === "综合指标值") {
            node.attributes.indicatorValue = res.data.data;
          }
          return false;
        });
        // 右键菜单关闭
        menuBox.style.display = "none";
        //调取图渲数据处理方法
        this.setZsptData();
      });
    },
  },
};
</script>

<style scoped>
/* * {
  margin: 0;
  padding: 0;
} */
.menu {
  /*这个样式不写，右键弹框会一直显示在画布的左下角*/
  position: absolute;
  background: #444444;
  border-radius: 5px;
  left: 82%;
  top: 10%;
}
</style>
