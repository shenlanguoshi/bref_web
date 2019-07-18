<template>
  <div class="app-container calendar-list-container">
    <basic-container>
     <!-- <el-button class="header__btn"
                 type="primary"
                 @click="breaks">关闭返回列表
      </el-button>-->
      <el-tabs v-model="activeName">
        <el-tab-pane label="组织机构"
                     :lazy="true"
                     name="framework">
          <user-framework :paramsid="id"></user-framework>
        </el-tab-pane>
        <el-tab-pane label="岗位"
                     :lazy="true"
                     name="quarters">
          <user-quarters :paramsid="id"></user-quarters>
        </el-tab-pane>
        <!--<el-tab-pane label="职务"
                     :lazy="true"
                     name="job">
          <user-job :paramsid="id"></user-job>
        </el-tab-pane>
        <el-tab-pane label="权限"
                     :lazy="true"
                     name="authority">
          <user-authority :paramsid="id"></user-authority>
        </el-tab-pane>-->
      </el-tabs>
    </basic-container>
  </div>
</template>


<script>
    import userFramework from "./framework";
    import userQuarters from "./quarters";
    import userJob from "./job";
    import userAuthority from "./authority";
    export default {
        components: {
            userFramework,
            userAuthority,
            userJob,
            userQuarters
        },
        name: "info",
        beforeRouteUpdate (to, from, next) {
            this.id = to.params.id;
            next()
        },
        data () {
            return {
                activeName: "framework",
                id:this.$route.params.id
            }
        },
        computed: {

        },
        created () {

        },
        methods: {
            breaks() {
                this.$router.$avueRouter.closeTag();
                this.$router.push({path: '/admin/user'})
            }
        }
    }
</script>