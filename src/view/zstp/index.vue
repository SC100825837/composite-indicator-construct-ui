<template>
  <div id="main" style="width: 100%;height:100%"></div>
</template>
<script>
import echarts from "echarts";
import $axios from "../../utils/utils";
export default {
  data() {
    return {
      zstpDate: {},
      nodesNew: [],
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
  },
  computed: {},
  methods: {
    getGrapDate(value){
      if(value.submitOnFlg){
        this.zstpDate={};
        this.zstpDate=this.graphList;
        this.setZsptData();
      }
    },
    //获取知识图谱数据
    getTpData() {
      //获取画面初期值
      $axios.getZsptDate().then((res) => {
        //返回值数据获取
        this.zstpDate = res.data.data;
        // console.log('');
        //调取图渲数据处理方法
        this.setZsptData();
      });
    },
    //知识图谱执行发放
    setZsptData() {
      var myChart = echarts.init(document.getElementById("main"));
      //最关键，自动调整canvas的
      myChart.resize();
      //数组去空
      // let nodesNew = [];
      // let edgesNew = [];
      // this.zstpDate.nodes.map(function (node) {
      //   if (node) {
      //     nodesNew.push(node);
      //   }
      // });
      // this.zstpDate.edges.map(function (edge) {
      //   if (edge) {
      //     edgesNew.push(edge);
      //   }
      // });
      var categories = [];
      for (var i = 0; i < this.zstpDate.nodes.length; i++) {
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
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20,
                },
              },
            },
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
                  if(v.name.length){
                   return text.length < 6 ? text : `${text.slice(0, 7) + "..."}`;
                  }else{
                    return text;
                  }
                },
                textStyle: {},
              },
            },
            // 数据
            data: this.zstpDate.nodes.map(function (node) {
              return {
                name: node.attributes.name ? node.attributes.name : node.attributes.indicatorValue,
                des: node.lbName,
                id: node.id + "",
                category: node.category,
              };
            }),
            //线数据
            links: this.zstpDate.edges.map(function (edge) {
              return {
                source: edge.sourceID + "",
                target: edge.targetID + "",
                des: edge.des,
              };
            }),
            categories: categories,
          },
        ],
      };
      myChart.setOption(option);
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
     window.addEventListener('resize', function () {
      myChart.resize()
      });
    },
    // 点击提交
    submitIndicatorCalc(value) {
      $axios.getIndicatorCalc(value).then((res) => {
        console.log("res.data.data", res.data.data);
        // // //返回值数据获取
        // // this.zstpDate = res.data.data;
        // //调取图渲数据处理方法
        // this.setZsptData();
      });
    },
  },
};
</script>

