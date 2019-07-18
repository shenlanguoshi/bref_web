<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0">
    <el-form-item prop="username">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                auto-complete="off"
                placeholder="请输入用户名">
        <i slot="prefix"
           class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="请输入密码">
        <i class="el-icon-view el-input__icon"
           slot="suffix"
           @click="showPassword"></i>
        <i slot="prefix"
           class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="14">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    :maxlength="code.len"
                    v-model="loginForm.code"
                    auto-complete="off"
                    placeholder="请输入验证码">
            <i slot="prefix"
               class="icon-yanzhengma"></i>
          </el-input>
        </el-col>
        <el-col :span="10">
          <div class="login-code">
            <span class="login-code-img"
                  @click="refreshCode"
                  v-if="code.type == 'text'">{{code.value}}</span>
            <img :src="code.src"
                 alt="验证码"
                 class="login-code-img"
                 @click="refreshCode"
                 v-else/>
            <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 size="small"
                 :loading="buLoad"
                 @click.native.prevent="handleLogin"
                 class="login-submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum } from '@/util/util'
import { validatenull } from '@/util/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'userlogin',
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.code.value !== value) {
        this.loginForm.code = ''
        this.refreshCode()
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      socialForm: {
        code: '',
        state: ''
      },
      loginForm: {
        username: 'admin',
        password: 'admin',
        code: '1111',
        randomStr: ''
      },
        buLoad: false,
      code: {
        src: '/code',
        value: '1111',
        len: 4,
        type: 'text' //image
      },
      loginRules: {
        username:[
            { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, message: '密码长度最少为4位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  watch: {
    $route() {
      const params = this.$route.query
      this.socialForm.state = params.state
      this.socialForm.code = params.code
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `登录中,请稍后。。。`,
          spinner: 'el-icon-loading'
        })
        setTimeout(() => {
          loading.close()
        }, 2000)
        this.handleSocialLogin()
      }
    }
  },
  created() {
    this.refreshCode()
  },
  mounted() { },
  computed: {
    ...mapGetters(['tagWel'])
  },
  props: [],
  methods: {
    refreshCode() {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`)
        this.loginForm.code = this.code.value;
    },
    showPassword() {
      this.passwordType == ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleSocialLogin() {
      this.$store.dispatch('LoginBySocial', this.socialForm).then(
        res => {
          this.$store.commit('ADD_TAG', this.tagWel)
          this.$router.push({ path: this.tagWel.value })
          this.$router.push({ path: this.tagWel.value })
        }
      )
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && !this.buLoad) {
            this.buLoad=true;
          this.$store.dispatch('LoginByUsername', this.loginForm).then(
            res => {
                this.buLoad=false;
              this.$store.commit('ADD_TAG', this.tagWel);
              this.$router.push({ path: this.tagWel.value })
            },
            error => {
                this.buLoad=false;
              this.refreshCode()
            }
          )
        }
      })
    }
  }
}
</script>

<style>
</style>
