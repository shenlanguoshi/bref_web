<template>
    <d2-container class="no_top">
        <el-tabs v-model="activeName" type="border-card" class="may_tabs no_border">
            <el-tab-pane label="数据权限-行"
                         :lazy="true"
                         name="dataScope">
                <roleLine :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="数据权限-列"
                         :lazy="true"
                         name="dataSchema">
                <roleList :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="模块"
                         :lazy="true"
                         name="permissionModule">
                <permission-module :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="用户"
                         :lazy="true"
                         name="user">
                <user :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="组织机构"
                         :lazy="true"
                         name="corporation">
                <corporation :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="岗位"
                         :lazy="true"
                         name="corporationWork">
                <corporationWork :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="职务"
                         :lazy="true"
                         name="jobPosition">
                <jobPosition :paramsid="id"/>
            </el-tab-pane>

        </el-tabs>

    </d2-container>
</template>

<script>
    import roleLine from "./roleLine";
    import roleList from "./roleList";
    import user from "./user";
    import permissionModule from "./permissionModule";
    import corporation from "./corporation";
    import corporationWork from "./corporationWork";
    import jobPosition from "./jobPosition";

    export default {
        name: "info",
        components: {
            roleLine,
            roleList,
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
        }
    }
</script>