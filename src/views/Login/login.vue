<template>
  <div class="login-container">
    <el-form
      autoComplete="on"
      :model="loginForm"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="card-box login-form"
      :rules="rules"
    >
      <h3 class="title">综合指数构建工具</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autoComplete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-s-goods"></i>
        </span>
        <el-input
          name="password"
          :type="pwdType"
          v-model="loginForm.password"
          autoComplete="on"
        ></el-input>
        <span class="show-pwd" @click="showPwd"
        ><i class="el-icon-view"></i
        ></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%" :loading="loading" @click="go('loginForm')">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "password",
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名',},
        ],
        password: [
          {required: true, message: '请输入密码',}
        ],
      },
      loading: false,
      pwdType: "password",
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    go(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push(
            {
              path: '/layout/home',
              query: {username: this.loginForm.username}
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

#app {
  margin-top: 0px;
}

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }

  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;

    &_login {
      font-size: 20px;
    }
  }

  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
