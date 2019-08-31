<template>
  <div class="d2-mr">
    <span class="btn-text">{{info.username ? `你好 ${info.username}` : '未登录'}}</span>
      <el-button @click="logOff" type="text">注销</el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>
