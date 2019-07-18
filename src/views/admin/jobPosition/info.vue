<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <el-card shadow="hover">
                <span>职务：{{name}}</span>
            </el-card>
            <el-tabs v-model="activeName">
                <el-tab-pane label="用户"
                             :lazy="true"
                             name="user">
                    <user :paramsid="id"></user>
                </el-tab-pane>
                <el-tab-pane label="权限"
                             :lazy="true"
                             name="authority">
                    <permission :paramsid="id"></permission>
                </el-tab-pane>
            </el-tabs>
        </basic-container>
    </div>
</template>

<script>
    import permission from "./permission";
    import user from "./user";
    export default {
        name: "info",
        components: {
            permission,
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

<style scoped>

</style>