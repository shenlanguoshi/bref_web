<template>
    <d2-container class="no_top">
        <el-tabs v-model="activeName" type="border-card" class="may_tabs no_border">
            <el-tab-pane label="用户"
                         :lazy="true"
                         name="user">
                <user :paramsid="id"></user>
            </el-tab-pane>
            <!-- <el-tab-pane label="权限"
                          :lazy="true"
                          name="authority">
                 <permission :paramsid="id"></permission>
             </el-tab-pane>-->
        </el-tabs>

    </d2-container>
</template>

<script>
    import user from "./user";
    export default {
        name: "info",
        components: {
            user,
        },
        beforeRouteUpdate (to, from, next) {
            this.id = to.params.id;
            this.name = to.query.name;
            next()
        },
        data () {
            return {
                activeName: "user",
                id:this.$route.params.id,
                name:this.$route.query.name
            }
        }
    }
</script>