<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="userInfo"
           label-width="0">
    <el-form-item prop="username">
      <el-input size="small"
                @keyup.enter.native="handleRegister"
                v-model="userInfo.username"
                auto-complete="off"
                placeholder="请输入用户名">
        <i slot="prefix"
           class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                @keyup.enter.native="handleRegister"
                :type="passwordType"
                v-model="userInfo.password"
                auto-complete="off"
                placeholder="请输入密码">
        <i class="el-icon-view el-input__icon"
           slot="suffix"
           @click="showPassword"></i>
        <i slot="prefix"
           class="icon-mima"></i>
      </el-input>
    </el-form-item>


    <el-form-item>
      <el-button type="primary"
                 size="small"
                 :loading="buLoad"
                 @click.native.prevent="handleRegister"
                 class="login-submit">注册</el-button>

    </el-form-item>
    <el-form-item class="center">
      <router-link to="/login"><el-button type="text">登录</el-button></router-link>
    </el-form-item>
  </el-form>
</template>

<script>
    import {registerUser} from "@/api/user";
  import { validatenull } from "@/util/validate";
    export default {
        name: "registerView",
      data () {
        const validateUsername = (rule, value, callback) => {
          if (validatenull(value)) {
            callback(new Error("请输入正确的用户名"));
          } else {
            callback();
          }
        };
        return {
          userInfo: {
            username: "",
            password: "",
          },
          buLoad: false,
          checked: true,
          code: {
            src: "",
            value: "",
            len: 4,
            type: "text"
          },
          loginRules: {
            username: [
              { required: true, trigger: "blur", message: "请输入用户名" },
              { min: 6, max: 16, message: "用户名长度在 6 到 20 个字符", trigger: "blur" }
            ],
            password: [
              { required: true, message: "请输入密码", trigger: "blur" },
              { min: 6,max: 20, message: "密码长度6 到 20 个字符", trigger: "blur" }
            ],
            code: [
              { required: true, message: "请输入验证码", trigger: "blur" },
              { min: 4, max: 16, message: "验证码长度为4位", trigger: "blur" },
              { required: true, trigger: "blur", validator: '' }
            ]
          },
          passwordType: "password"
        };
      },
      created () { },
      mounted () { },
      props: [],
      methods: {
        refreshCode () {

        },
        showPassword () {
          this.passwordType == ""
            ? (this.passwordType = "password")
            : (this.passwordType = "");
        },
        handleRegister () {
          this.$refs.loginForm.validate(valid => {
            if (valid && !this.buLoad) {
              this.buLoad=true;
              registerUser({
                  userInfo:JSON.stringify({
                      username: this.userInfo.username,
                      password:this.userInfo.password
                  })
              }).then(response => {
                  if(response.data.success){
                      this.$confirm("注册成功", "提示", {
                          confirmButtonText: "登录",
                          showCancelButton:false,
                          showClose:false,
                          closeOnClickModal:false,
                          closeOnPressEscape:false,
                          type: "success"
                      }).then(() => {
                          this.$router.push({ path: "/login" });
                      });
                  }else{
                      this.$message.error({message: response.data.error_description});
                  }
              }).catch((error) => {
                  this.buLoad=false;
              });
            }
          });

        }
      }
    }
</script>

<style scoped>
  .center {
    padding-left:20px;
  }

</style>
