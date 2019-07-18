<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <el-card shadow="hover">
                <span>数据权限-行：{{name}}</span>
                <el-button class="header__btn" style="float: right"
                           type="primary"
                           @click="breaks">关闭返回列表
                </el-button>
            </el-card>
            <el-tabs v-model="activeName">
                <el-tab-pane label="权限"
                             :lazy="true"
                             name="permission">
                    <permission :paramsid="id"></permission>
                </el-tab-pane>
                <el-tab-pane label="项目信息"
                             :lazy="true"
                             name="item">
                    <data-scope-item :paramsid="id"></data-scope-item>
                </el-tab-pane>
            </el-tabs>
        </basic-container>
    </div>
</template>

<script>
    import permission from './permission'
    import dataScopeItem from './dataScopeItem'
    export default {
        name: "info",
        components: {
            permission,
            dataScopeItem
        },
        beforeRouteUpdate (to, from, next) {
            this.id = to.params.id;
            this.name = to.query.name;
            next()
        },
        data () {
            return {
                activeName: "permission",
                id:this.$route.params.id,
                name:this.$route.query.name
            }
        },
        methods: {
            breaks() {
                this.$router.$avueRouter.closeTag();
                this.$router.push({path: '/permission/dataScope'})
            }
        }
    }
</script>

<style scoped>

</style>