<template>
  <!-- 首页第一个echars图 -->
  <div class="home">
    <el-form>
      <el-form-item label="切换架构对象:">
        <el-select
          placeholder="请选择架构对象"
          @change="getSelectFrameObjectId($event)"
          v-model="frameObject"
        >
          <el-option
            v-for="item in frameObjectList"
            :key="item.id"
            :label="item.frameworkObjectName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card>
          <div id="barLineDate" style="height: 500px"></div>
        </el-card
        >
      </el-col>
      <!-- <el-col :span="8">
        <el-card><div id="perDate" style="height: 500px"></div></el-card
      ></el-col> -->
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="12">
        <el-card>
          <div style="height: 300px"></div>
        </el-card
        >
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="height: 300px"></div>
        </el-card
        >
      </el-col>
      <el-col :span="6">
        <el-card>
          <div i style="height: 300px"></div>
        </el-card
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import $axios from "../../utils/utils";
import * as echarts from "echarts";

export default {
  name: "home",
  data() {
    return {
      //id
      recentlyId: 0,
      //柱线图返回值数据
      barLineData: {},
      frameObject: {},
      frameObjectList: [],
    };
  },
  mounted() {
    if (this.recentlyId !== null && this.recentlyId !== "null") {
      //获取知识图谱数据
      this.getBarLineList();
    }
    //绘制饼状图
    // this.perEchars();
  },
  created() {
    //获取id
    this.recentlyId = window.sessionStorage.getItem("recentlyId");
    if (this.recentlyId === null || this.recentlyId === "null") {
      this.getRecentlyCiFrameworkObjectId();
    }
    this.getAllFrameworkObjects();
    // //获取数据
    // this.getBarLineList();
  },
  methods: {
    getAllFrameworkObjects() {
      $axios.ciFrameworkList().then((res) => {
        this.frameObjectList = res.data.data;
      });
    },
    //架构对象选择
    getSelectFrameObjectId(id) {
      window.sessionStorage.setItem("recentlyId", id)
      this.recentlyId = id
      console.log("getSelectFrameObjectId")
      $axios.switchFrameObj(id).then(res => {
        console.log("switchFrameObj")
        $axios.getCiFrameworkObjectInfo(id).then((res) => {
          if (res.data.code === 0) {
            //接受返回值参数
            this.barLineData = res.data.data.allTargetsCic;
            //调取折线图echars图
            this.barLineEchars();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      })
    },
    getRecentlyCiFrameworkObjectId() {
      $axios.getRecentlyCiFrameworkObjectId().then((result) => {
        // console.log("result", result);
        this.recentlyId = result.data.data;
        window.sessionStorage.setItem("recentlyId", this.recentlyId);
        this.getBarLineList();
      });
    },
    //柱线数据显示
    getBarLineList() {
      // sessionstorage里面存的是null字符串
      if (this.recentlyId === null || this.recentlyId === "null") {
        this.$message.warning("数据为空，请导入数据")
        return;
      }
      $axios
        .getCiFrameworkObjectInfo(this.recentlyId)
        .then((res) => {
          //接受返回值参数
          this.barLineData = res.data.data.allTargetsCic;
          // console.log('barLineData',barLineData);
          //调取折线图echars图
          this.barLineEchars();
        })
        .catch((reason) => {
          // console.log("reason", reason)
          this.$message({
            message: "请先进行指数计算",
            type: "warning",
          });
        });
    },
    //描绘echars折线图图得方法
    barLineEchars() {
      //获取id
      var chartDom = document.getElementById("barLineDate");
      var myChart = echarts.init(chartDom);
      var option;
      //x轴数据
      var xAxis = this.barLineData.xaxisData;
      //折线图数据
      var lineData = this.barLineData.series[0].data;
      //柱形图数据
      var barData = this.barLineData.series[1].data;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ["line", "bar"] },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        xAxis: [
          {
            type: "category",
            name: "构造对象",
            data: xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "指数",
            min: 0,
            interval: 50,
          },
        ],
        series: [
          {
            name: "",
            type: "bar",
            data: barData,
          },
          {
            name: "",
            type: "line",
            data: lineData,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    //绘制echars扇形图方法
    perEchars() {
      var chartDom = document.getElementById("perDate");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {value: 1048, name: "Search Engine"},
              {value: 735, name: "Direct"},
              {value: 580, name: "Email"},
              {value: 484, name: "Union Ads"},
              {value: 300, name: "Video Ads"},
            ],
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  margin: 10px;
}
</style>
