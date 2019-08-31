<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <!--<ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>-->
    </div>
    <!--<div
      class="page-login&#45;&#45;layer page-login&#45;&#45;layer-time"
      flex="main:center cross:center">
      {{time}}
    </div>-->
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:center cross:center box:center">
        <div
          class="page-login--content-main"
          flex=" main:center cross:center">
            <div>
                <img src="/image/login/msg.png"/>
            </div>
          <div class="page-login--form">
                <p class="login-h">用户登录</p>
              <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                <el-form-item prop="username">
                  <el-input class="login_input" type="text" v-model="formLogin.username" placeholder="请输入用户名">
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input class="login_input" type="password" v-model="formLogin.password" placeholder="请输入密码">
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input class="login_input" type="text" v-model="formLogin.code" placeholder="请输入验证码">
                    <template slot="append">
                      <img class="login-code" src="./image/login-code.png">
                    </template>
                  </el-input>
                </el-form-item>
                <el-button size="default" @click="submit" type="primary" class="button-login">登录</el-button>
              </el-form>
            <p
              class="page-login--options"
              flex="main:center cross:center">
                <span><router-link to="/register">注册用户</router-link></span>
            </p>

          </div>
        </div>
      </div>
    </div>
   <!-- <el-dialog
      title="快速选择用户"
      :visible.sync="dialogVisible"
      width="400px">
      <el-row :gutter="10" style="margin: -20px 0px -10px 0px;">
        <el-col v-for="(user, index) in users" :key="index" :span="8">
          <div class="page-login&#45;&#45;quick-user" @click="handleUserBtnClick(user)">
            <d2-icon name="user-circle-o"/>
            <span>{{user.name}}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>-->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      //timeInterval: null,
      //time: dayjs().format('HH:mm:ss'),
      // 快速选择用户
      //dialogVisible: false,
      users: [
        {
          name: '管理员',
          username: 'admin',
          password: 'admin'
        },
        {
          name: '编辑',
          username: 'editor',
          password: 'editor'
        },
        {
          name: '用户1',
          username: 'user1',
          password: 'user1'
        }
      ],
      // 表单
      formLogin: {
        username: 'admin',
        password: "admin",
        code: 'v9am'
      },
      // 校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  /*mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },*/
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    /*refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },*/
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            username: this.formLogin.username,
            password: this.formLogin.password
          })
            .then(() => {
              // 重定向对象不存在则返回顶层路径
              this.$router.replace(this.$route.query.redirect || '/')
            })
        } else {
          // 登录表单校验失败
          this.$message.error('表单校验失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.page-login {
 // @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
      background: url('/image/login/bg.jpg') center no-repeat;
      background-size: cover;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }

    .page-login--content-main{
        background: $color-ff;
        padding:58px 60px;
        border-radius:10px;
    }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0;
      padding: 0;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
      span {
        color: $color-text-sub;
      }
    }
  }
  // main
  .page-login--logo {
    width: 240px;
    margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 341px;
      padding-left:50px;
    // 卡片
      .login-h{
          font-size:24px;
          font-weight:500;
          color:$color-text-h;
      }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0 14px;
    }
      .login_input {
          padding:5px 0;
          .el-input__inner{
              border-left: none;
              border-right: none;
              border-top: none;
              border-bottom-color: #E5E7ED;
              color: #636B90;
              border-radius: 0;
              padding:0;
          }
          &.code_img{
              .el-input__inner{
                  padding-right:140px;
              }
          }
          .el-input-group__append{
              border-width:0 0 1px ;
              background: $color-ff;
          }
      }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 29px 0 0;
      font-size: 14px;
      color: $color-text-other;
        font-weight:400;
        a{
            color:$color-text-other
        }
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 14px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
