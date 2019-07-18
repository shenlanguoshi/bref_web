<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <el-card shadow="hover">
                <span>权限：{{name}}</span>
                <el-button class="header__btn" style="float: right"
                           type="primary"
                           @click="breaks">关闭返回列表
                </el-button>
            </el-card>
            <el-tabs v-model="activeName">
                <el-tab-pane label="数据权限-行"
                             :lazy="true"
                             name="dataScope">
                    <permission-data-scope :paramsid="id"></permission-data-scope>
                </el-tab-pane>
                <el-tab-pane label="数据权限-列"
                             :lazy="true"
                             name="dataSchema">
                    <permission-data-schema :paramsid="id"></permission-data-schema>
                </el-tab-pane>
                <el-tab-pane label="模块"
                             :lazy="true"
                             name="permissionModule">
                    <permission-module :paramsid="id"></permission-module>
                </el-tab-pane>
                <el-tab-pane label="用户"
                             :lazy="true"
                             name="user">
                    <user :paramsid="id"></user>
                </el-tab-pane>
                <el-tab-pane label="组织机构"
                             :lazy="true"
                             name="corporation">
                    <corporation :paramsid="id"></corporation>
                </el-tab-pane>
                <el-tab-pane label="岗位"
                             :lazy="true"
                             name="corporationWork">
                    <corporationWork :paramsid="id"></corporationWork>
                </el-tab-pane>
                <el-tab-pane label="职务"
                             :lazy="true"
                             name="jobPosition">
                    <jobPosition :paramsid="id"></jobPosition>
                </el-tab-pane>
            </el-tabs>
        </basic-container>
    </div>
</template>

<script>
    import permissionDataScope from "./permissionDataScope";
    import permissionDataSchema from "./permissionDataSchema";
    import user from "./user";
    import permissionModule from "./permissionModule";
    import corporation from "./corporation";
    import corporationWork from "./corporationWork";
    import jobPosition from "./jobPosition";
    export default {
        name: "info",
        components: {
            permissionDataScope,
            permissionDataSchema,
            user,
            corporation,
            corporationWork,
            jobPosition,
            permissionModule,
        },
        beforeRouteUpdate (to, from, next) {
            this.id = to.params.id;
            this.name = to.query.name;
            next()
        },
        data () {
            return {
                activeName: "dataScope",
                id:this.$route.params.id,
                name:this.$route.query.name
            }
        },
        methods: {
            breaks() {
                this.$router.$avueRouter.closeTag();
                this.$router.push({path: '/permission/index'})
            }
        }
    }
</script>

<style scoped>

</style>