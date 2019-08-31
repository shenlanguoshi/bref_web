<template>
    <el-dialog title="行域选择"
               :visible.sync="dialogVisible"
               @closed="close">
        <tree v-if="dataType=='corporation_tree'" @node-click="corporationClick"></tree>
        <corporation-work v-else-if="dataType=='sys_corporation_work_list'" :msg="{status:true}" @deliverMsg="workClick"></corporation-work>
        <!--<region v-else-if="dataType=='region_tree'" @node-click="corporationClick"></region>
        <industry-category v-else-if="dataType=='industry_category_tree'" @node-click="corporationClick"></industry-category>-->
    </el-dialog>
</template>

<script>
    import tree from "@/views/home/corporation/tree";
    import corporationWork from "@/views/home/corporationWork/index";
    ///import region from "@/views/home/region/tree";
    //import industryCategory from "@/views/home/industryCategory/tree";
    export default {
        name: "index",
        props: ['dataType'],
        directives: {},
        components: {
            tree,
            //region,
            //industryCategory,
            corporationWork
        },
        data() {
            return {
                dialogVisible:false
            }
        },
        created() {
        },
        methods: {
            openClick () {
                this.dialogVisible=true;
            },
            close () {
                this.$emit('close');
            },
            corporationClick (data) {
                this.$emit('node-click',"'%"+data.id+"%'");
                this.dialogVisible=false;
            },
            workClick (data) {
                this.$emit('node-click',"'"+data.id+"'");
                this.dialogVisible=false;
            }
        }
    }
</script>