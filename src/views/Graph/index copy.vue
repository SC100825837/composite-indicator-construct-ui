<template>
  <div id="chart" class="chart" style="width: 100%px; height: 800px"></div>
</template>
<script>
import echarts from "echarts";
import $axios from "../../utils/utils";
import { expendNodes } from "./mock";
import graph from "./index";
// import axios from "axios";
export default {
  name: "Charts",
  components: {},
  mixins: [],
  props: {
    // chartList: {
    //   type: Array,
    //   required: true,
    // },
  },
  watch: {
    // chartList: {
    //   handler(val) {
    //     this.formatData(val || [], true);
    //   },
    // },
  },
  data() {
    return {
      myChart: "",
      seriesData: [],
      seriesLinks: [],
      categories: [],
      graphDate: [],
      lastClickId: "",
    };
  },
  computed: {},
  methods: {
    //获取知识图谱数据
    getTpData() {
      //获取画面初期值
      $axios.getZsptDate().then((res) => {
        //返回值数据获取
        this.graphDate = res.data.data;
        //调取图渲数据处理方法
        this.setZsptData();
      });
    },
    //知识图谱执行发放
    setZsptData() {
      var categories = [];
      for (var i = 0; i < 4; i++) {
        categories[i] = {
          name: "层级" + i,
        };
        let graph = [
          {
            id: 10000,
            name: "盗墓笔记重启[南派三叔所著小说]", //节点名字
            linkDes: "12213424", //两个连线之间描述
            des: "描述", //鼠标悬浮后的提示框显示得内容（可以不要）
            category: 0,
            childerNum: 1, //子节点个数
            children: [
              {
                id: 2,
                name: "盗墓笔记重启",
                des: "描述",
                category: 2,
                children: [
                  {
                    id: 11,
                    name: "南派三叔1213",
                    des: "描述",
                    category: 3,
                  },
                  {
                    id: 12,
                    name: "南派三叔1213",
                    des: "描述",
                    category: 3,
                  },
                ],
              },
              {
                id: 3,
                name: "南派三叔",
                des: "描述",
                category: 2,
              },
              {
                id: 4,
                name: "悬疑",
                des: "描述",
                category: 2,
              },
              {
                id: 6,
                name: "连载平台",
                des: "描述",
                category: 2,
              },
              {
                id: 7,
                name: "最新章节",
                des: "描述",
                category: 2,
              },
              {
                id: 8,
                name: "小说主角",
                des: "描述",
                category: 2,
              },
              {
                id: 9,
                name: "连载状态",
                des: "描述",
                category: 2,
              },
            ],
          },
        ];
        this.graphDate = graph;
        console.log("this.graphDate", this.graphDate);

        this.formatData(graph || [], categories, true);
      }
    },
    /**
     * 节点点击事件
     */
    async nodeClick(params) {
      //debugger;
      console.log("params", params);
      // 在数据中找到点击得那个节点
      const index = this.seriesData.findIndex(
        (item) => item.id === params.data.id
      );
      //取出数据并存放在info中
      const info = this.seriesData[index];
      console.log("info", info);
      if (info.isRoot) return;
      if (!info.isClicked) {
        this.lastClickId = info.id;
        //点击需要展开
        info.isClicked = true;
        //info数据替换下标为index得数据
        this.seriesData.splice(index, 1, info);
        let result = this.expendNodes(info.id);
        this.formatData(result);
      } else {
        //已经点击过  当前点击需要折叠
        info.isClicked = false;
        //删除节点信息以及连线
        this.removeChilds(info.id);
      }
    },
    async expendNodes(id) {
      //debugger;
      return new Promise((resolve, reject) => {
        let totalList = [];
        //拆除来所有的children到第一层
        this.graphDate.forEach(item=>{
            getDeepChildrens(totalList,item,0)
        })

        let list = [];
        for (let item of totalList) {
          if (item.parentId.toString() === id) {
            const { children, ...reset } = item;
            list.push({
              ...reset,
            });
          }
        }
        if (list.length > 0) {
          resolve(list);
        } else {
          reject();
        }
      });
    },

    /**
     * 递归数组,把所有children都拆出来到第一层
     * @param {*} list
     * @param {*} item
     */
    getDeepChildrens(list, item, parentId) {
      const { children, ...reset } = item;
      list.push({
        ...reset,
        parentId,
      });
      if (children && children.length > 0) {
        children.forEach((child) => {
          this.getDeepChildrens(list, child, item.id);
        });
      }
    },

    /**
     * 点击节点折叠操作
     */
    removeChilds(id) {
      console.log("id", id);
      // 清除data数据
      let list = [];
      let links = [];
      let delIds = [];
      this.getDeleteParentIds(delIds, [id]);

      this.seriesData.map((item) => {
        if (!delIds.includes(item.id)) {
          list.push(item);
        }
      });
      this.seriesLinks.map((item) => {
        if (!delIds.includes(item.source) && !delIds.includes(item.target)) {
          links.push(item);
        }
      });
      this.seriesData = [].concat(list);
      this.seriesLinks = [].concat(links);
      this.initCharts();
    },

    /**
     * 递归获取当前节点以下节点id
     */
    getDeleteParentIds(delIds, ids) {
      let list = [];
      this.seriesData.map((item) => {
        if (ids.includes(item.parentId)) {
          list.push(item.id);
        }
      });
      if (list.length > 0) {
        delIds.push(...list);
        this.getDeleteParentIds(delIds, list);
      }
    },

    /**
     * 设置echarts配置项,重绘画布
     */
    initCharts() {
      ////debugger
      this.myChart = echarts.init(document.getElementById("chart"));
      this.myChart.on("click", (params) => {
        if (params.dataType === "node") {
          //判断点击的是图表的节点部分
          this.nodeClick(params);
          console.log("params", params);
        }
      });
      // 指定图表的配置项和数据
      let option = {
        // 动画更新变化时间
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        tooltip: {
          show: false,
        },
        series: [
          {
            type: "graph",
            layout: "force", //力引导布局
            // legendHoverLink: true, //是否启用图例 hover(悬停) 时的联动高亮。
            // hoverAnimation: true, //是否开启鼠标悬停节点的显示动画
            label: {
              show: true,
            },
            //   edgeLabel: {
            //     normal: {
            //         show: true,
            //         formatter: function (x) {
            //           console.log('x',x);
            //             return x.data.des;
            //         }
            //     }
            // },
            edgeLabel: {
              // 节点连线标签
              position: "middle", //边上的文字样式
              normal: {
                formatter: "{c}",
                show: true,
              },
            },
            edgeSymbol: ["arrow", ""],
            edgeSymbolSize: [10],
            force: {
              // 边的两个节点之间的距离
              edgeLength: 120,
              //节点之间的斥力因子。
              repulsion: 500,
            },
            roam: true,
            draggable: true, //每个节点的拖拉
            lineStyle: {
              width: 2,
            },
            symbolSize: 30, //节点大小
            categories: this.categories,
            links: this.seriesLinks,
            data: this.seriesData,
            cursor: "pointer",
          },
        ],
      };
      console.log("option", option);
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },
    /**
     * 格式化数据到表格需要的数据
     */
    formatData(list, categories, reset = false) {
      //debugger;
      let nodes = [];
      const data = [];
      const links = [];
      let target = "";
      if (reset) {
        this.seriesData = [];
        this.seriesLinks = [];
        nodes = [].concat(list[0].children);
        target = list[0].id + "";
        const dataInfo = {
          id: target,
          name: list.name,
          category: list.category,
          isClicked: true,
          isRoot: true,
          symbolSize: 50,
        };
        data.push(dataInfo);
      } else {
        nodes = [].concat(list);
        target = this.lastClickId;
      }

      nodes.forEach((item, index) => {
        // 注意 id必须是string  否则连线连不上
        const id = item.id + "";
        const dataInfo = {
          id: id,
          parentId: target,
          category: item.category,
          name: item.name,
          des: item.des,
          isClicked: false,
        };
        data.push(dataInfo);
        if (target != item.id) {
          links.push({
            value: item.linkDes,
            target: target,
            source: id,
          });
        }
      });
      this.seriesData.push(...data);
      this.seriesLinks.push(...links);
      this.categories.push(...categories);
      this.initCharts();
    },
  },
  created() {},
  mounted() {
    // this.getTpData();
    //调取图渲数据处理方法
    this.setZsptData();
  },
  beforeDestroy() {},
};
</script>
<style scoped>
.chart {
  height: 100%;
}
</style>
