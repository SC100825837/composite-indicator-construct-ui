<template>
  <div>
    <el-card class="exMain" v-loading="loading" element-loading-text="请稍等...">
      <div class="btnSingleLine" >
        <div style="float:left" >
          <el-upload
            class="upload-demo"
            action="http://localhost:6060/file/upload"
            accept=".xlsx,.xls"
            :before-upload="beforeUpload"
            :on-success="handleAvatarSuccess"
            :on-error="uploadError"
            :on-exceed="handleExceed"
            multiple
            :limit="1"
            :auto-upload="true"
            :show-file-list="false"
          >
            <el-button size="small" type="warning">上传Excel</el-button>
            <!--            <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>-->
          </el-upload>
        </div>
        <div style="float:right">
          <el-button
            size="small"
            type="primary"
            @click="$router.back()"
          >返回
          </el-button
          >
        </div>
      </div>
      <div id="excel-manager">
        <div class="dataUpdata">
        </div>
        <el-table
          :data="excelData"
          style="width: 100%; margin-top: 10px"
          border
          highlight-current-row
        >
          <el-table-column fixed prop="frameworkObjectName" sortable label="名称">
          </el-table-column>
          <el-table-column prop="uploadDate" sortable label="上传时间">
          </el-table-column>
          <el-table-column prop="uploaderId" sortable label="上传者"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
              >查看
              </el-button
              >
              <el-button
                @click.native.prevent="deleteRow(scope.$index, excelData)"
                style="color: red"
                type="text"
                size="small"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total=total
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {HotTable, HotColumn} from "@handsontable/vue";
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
      recentlyId: 0,
      //当前页数
      currentPage4: 1,
      pageSize: 10,
      //总条目
      total: 0,
      //表格数据
      excelData: [
        // { id: 1, name: 'Table tennis racket', price: 13, currency: 'PLN'},
        // { id: 2, name: 'Outdoor game ball', price: 14, currency: 'USD' },
        // { id: 3, name: 'Mountain bike', price: 300, currency: 'USD' },
        // { id: 3, name: 'Mountain bike', price: 2342, currency: 'USD' },
        // { id: 3, name: 'Mountain bike', price: 300, currency: 'USD' }
      ],
      loading: false,
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
    this.recentlyId = window.sessionStorage.getItem("recentlyId");
    //表格数据得初期显示
    this.getCiFrameworkList();
  },
  methods: {
    getRecentlyCiFrameworkObjectId() {
      $axios.getRecentlyCiFrameworkObjectId().then((result) => {
        // console.log("result", result);
        this.recentlyId = result.data.data;
        window.sessionStorage.setItem("recentlyId", this.recentlyId);
      });
    },
    //表格数据显示
    getCiFrameworkList() {
      $axios.ciFrameworkList().then((res) => {
        // console.log("result", res.data);
        this.excelData = res.data.data;
        this.total = res.data.data.length;
        // console.log('this.total',this.total);
      });
    },
    beforeUpload(file) {
      this.loading = true;
      console.log("beforeUpload", file);
    },
    handleAvatarSuccess(res, file) {
      this.loading = false;
      if (res.code === 1) {
        this.$message.warning(res.msg)
      } else {
        if (this.recentlyId === null || this.recentlyId === "null") {
          this.getCiFrameworkList();
          this.getRecentlyCiFrameworkObjectId();
        }
      }
      console.log("handleAvatarSuccess", res, file);
    },
    handleExceed(files) {
      this.loading = false;
      console.log("handleExceed", files);
      this.$message.warning(`文件 “${files[0].name}” 已上传`);
    },
    uploadError(res) {
      console.log("uploadError", res)
      this.loading = false;
      this.$message.error("上传失败");
    },
    getList() {
    },
    swapHotData: function () {
      // The Handsontable instance is stored under the `hotInstance` property of the wrapper component.
      this.$refs.hotTableComponent.hotInstance.loadData([["new", "data"]]);
    },
    //表格高亮现实
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    //点击查看页面跳转
    handleClick(rows) {
      this.$router.push({path: "/layout/excelData", query: {id: rows.id}});
    },
    //表格数据行删除
    deleteRow(index, rows) {
      // console.log("deleteRow", index, rows)
      this.loading = true;
      let rowId = rows[index].id
      // console.log("deleteRow", index, rows[index])
      $axios.deleteCiFrameworkObject(rowId).then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          rows.splice(index, 1);
          this.$message.success("删除成功")
        }
        $axios.getRecentlyCiFrameworkObjectId().then(result => {
          window.sessionStorage.setItem("recentlyId", result.data.data)
        })
      });
    },
    // 每页 ${val} 条分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //当前页: ${val}
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
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

.dataUpdata {
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

.block {
  text-align: right;
  margin-top: 10px;
}
</style>


<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
