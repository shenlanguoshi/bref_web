<template>
    <d2-container class="no_top">
        <el-tabs v-model="activeName" type="border-card" class="may_tabs no_border">
            <el-tab-pane label="组织机构" :lazy="true" name="corporation">
                <corporation :paramsid="id"/>
            </el-tab-pane>
            <el-tab-pane label="岗位" :lazy="true" name="corporationWork">
                <corporationWork :paramsid="id"/>
            </el-tab-pane>

        </el-tabs>

    </d2-container>
</template>

<script>
    import corporation from "./corporation"
    import corporationWork from "./corporationWork"

    export default {
        name: "info",
        mixins: [],
        components: {
            corporation,
            corporationWork
        },
        props: [],
        data() {
            return {
                activeName: "corporation",
                id:this.$route.params.id
            }
        },
    }
</script>