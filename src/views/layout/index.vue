<template>
  <div id="graphcon">
    <div class="header">
      <div class="headerFold">
        <!--左侧菜单展开关闭控制图标-->
        <el-button
          type="text"
          icon="el-icon-s-fold"
          @click="togleCollapse"
        ></el-button>
      </div>
      <!--最右侧用户信息包退出操作-->
      <div class="headerRight">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span @click="back">退出</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="navbar">
      <div class="graphRightMenu">
        <i class="el-icon-menu"></i>
        <span style="color: #fff">指数构建</span>
      </div>
      <div class="menu" id="menu">
        <el-menu
          router
          class="el-menu-vertical-demo"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <el-menu-item index="/layout/Graph">
            <i class="el-icon-menu"></i>
            <span slot="title">指数构建</span>
          </el-menu-item>
          <el-menu-item index="/layout/excel">
            <i class="el-icon-document"></i>
            <span slot="title">Excel展示</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
<script>
import $axios from "../../utils/utils";

export default {
  name: "layout",
  data() {
    return {
      username:'',
      isCollapse:false,

    }
  },
  created() {
    this.username = this.$route.query.username;
  },
  methods: {
    //控制展开与折叠
    togleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    //返回登录页面
    back() {
      this.$router.push({ path: "/" });
    },
     //全屏
    requestFullScreen() {
      var element = document.getElementById("graphcon");
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

  },
};
</script>
<style lang="scss" scoped>
// .el-menu-vertical-demo:not(.el-menu--collapse) {
//   width: 200px;
//   min-height: 400px;
// }
.el-button--text {
  color: #4b4f53;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
  font-size: 25px;
}
#menu {
  .el-menu {
    border-right: 0px;
  }
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
  position: absolute;
  left: 25px;
  top: 0px;
}

.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px;
  font-size: 15px;
  font-weight: 500;
  line-height: 50px;
  border-bottom: none;
  color: #000000c4;
}
#item2 {
  font-size: 14px !important;
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

/**头部样式 */
.header {
  position: absolute;
  line-height: 50px;
  top: 0px;
  left: 180px;
  right: 0px;
  border-bottom: solid 1px #e6e6e6;
  height: 50px;
  border-radius: 0px !important;
}

.headerFold {
  text-align: left;
  position: absolute;
  margin-left: 20px;
  color: #fff;
  width: 96%;
}

.headerRight {
  width: 100px;
  position: absolute;
  right: 0px;
  color: #000;
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
  background: #d8d8d861;
}
.menu {
  width: 100%;
  top: 50px;
  position: absolute;
}
</style>
