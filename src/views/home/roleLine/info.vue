<template>
    <d2-container class="no_top">
        <el-tabs v-model="activeName" type="border-card" class="may_tabs no_border">
            <el-tab-pane label="权限" :lazy="true" name="role">
                <role :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="项目信息" :lazy="true" name="item">
                <item :paramsid="id"/>
            </el-tab-pane>

        </el-tabs>

    </d2-container>
</template>

<script>
    import role from "./role";
    import item from "./item";

    export default {
        name: "info",
        components: {
            role,
            item
        },
        beforeRouteUpdate (to, from, next) {
            this.id = to.params.id;
            this.name = to.query.name;
            next()
        },
        data () {
            return {
                activeName: "role",
                id:this.$route.params.id,
                name:this.$route.query.name
            }
        }
    }
</script>