/* <template>
  <div>
    <el-card class="exMain">
      <div class="btnSingleLine">
        <el-button @click="previewExcelContent" type="primary" size="small"
          >数据加载</el-button
        >
        <el-button size="small" type="warning">上传Excel</el-button>
        <el-button size="small" type="primary" style="margin-left: 85%;"
          @click="$router.back()">返回</el-button>
      </div>
      <div id="excel-manager">
        <div class="dataUpdata2">
            <el-upload
          class="upload-demo"
          action="http://localhost:6060/file/upload"
          accept=".xlsx,.xls"
          :before-upload="beforeUpload"
          :on-success="handleAvatarSuccess"
          :on-exceed="handleExceed"
          multiple
          :limit="1"
          :auto-upload="true"
          :show-file-list="false"
        >
          <!--            <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>-->
        </el-upload>
        </div>
        <hot-table
          ref="hotTableComponent"
          :settings="excelSettings"
          :data="excelData"
          style="width: 90%;"
        >
          <hot-column
            :title="item"
            :data="item"
            :key="index"
            v-for="(item, index) in Object.keys(
              excelData[0] ? excelData[0] : {}
            )"
          >
          </hot-column>
        </hot-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { HotTable, HotColumn } from "@handsontable/vue";
import Handsontable from "handsontable";
import $axios from "../../utils/utils";
import "handsontable/dist/handsontable.full.css";

export default {
  name: "excel-manager",
  components: {
    HotTable,
    HotColumn,
  },
  data() {
    return {
      //表格数据
      excelData: [
        // { id: 1, name: 'Table tennis racket', price: 13, currency: 'PLN'},
        // { id: 2, name: 'Outdoor game ball', price: 14, currency: 'USD' },
        // { id: 3, name: 'Mountain bike', price: 300, currency: 'USD' },
        // { id: 3, name: 'Mountain bike', price: 2342, currency: 'USD' },
        // { id: 3, name: 'Mountain bike', price: 300, currency: 'USD' }
      ],
      //表格属性设置
      excelSettings: {
        height: 650,
        width: "auto",
        //  height: 'auto',
        //表头
        colHeaders: true,
        rowHeaders: true,
        readOnly: false,
        //容器的宽度
        stretchH: "all",
        //行移动
        manualRowMove: true,
        //手动调整列宽
        manualColumnResize: true,
        //右键菜单
        contextMenu: {
          items: {
            row_above: {
              name: "Insert row above this one (custom name)",
            },
            row_below: {},
            separator: Handsontable.plugins.ContextMenu.SEPARATOR,
            clear_custom: {
              name: "Clear all cells (custom)",
              callback() {
                this.clear();
              },
            },
          },
        },
        // height: 'auto',
        //声明非商用，不然有水印
        licenseKey: "non-commercial-and-evaluation",
      },
    };
  },
  created() {
    // 请求id
    var previewExcelId = this.$route.query.id;
    // 设置初期默认值
    this.previewExcelContent(previewExcelId);
  },
  methods: {
    previewExcelContent(previewExcelId) {
      $axios.previewExcelContent(previewExcelId, 1).then((result) => {
        // console.log("result", result);
        let resultArr = result.data.data;
        // this.excelData = result.data.data
        // this.excelData = []
        for (const row of resultArr) {
          this.excelData.push(row);
        }
        console.log("this.excelData", this.excelData);
      });
    },
    beforeUpload(file) {
      console.log("beforeUpload", file);
    },
    handleAvatarSuccess(res, file) {
      console.log("handleAvatarSuccess", res, file);
    },
    handleExceed(files) {
      console.log("handleExceed", files);
      this.$message.warning(`文件 “${files[0].name}” 已上传`);
    },
    getList() {},
    swapHotData: function () {
      // The Handsontable instance is stored under the `hotInstance` property of the wrapper component.
      this.$refs.hotTableComponent.hotInstance.loadData([["new", "data"]]);
    },
    // //返回
    // goBack(){
    //     ;
    // }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.btnExcel{
    line-height: 50px;
    text-align: left;
}
.el-table thead tr th {
  background: #f5f5f5;
  color: #808080;
  height: 42px;
}
.el-table td {
  height: 32px;
}

#excel-manager {
  width: 100%;
}
.exMain {
  width: 98%;
  margin: 10px;
}
.dataUpdata2 {
  left: 42px;
  position: absolute;
  top: 35px;
  border-radius: 5px;
}
.el-button--small {
  border-radius: 5px;
}

.handsontable thead th .relative {
  height: 30px;
}
.handsontable span.colHeader {
  line-height: 2.2 !important;
}
</style>


<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
 */