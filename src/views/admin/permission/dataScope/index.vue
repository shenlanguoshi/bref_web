<template>
    <basic-container>
            <data-scope></data-scope>
       <!-- <div  class="clearfix">
           <span>项目信息</span>
        </div>
            <data-scope-item></data-scope-item>-->
    </basic-container>

</template>

<script>
    import dataScope from './dataScope'
    import dataScopeItem from './dataScopeItem'
    export default {
        name: "dataScopeView",
        props: [],
        directives: {},
        components: {
            dataScope,
            dataScopeItem
        },
        data() {
            return {}
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped>

</style>