<template>
    <el-tree class="filter-tree"
             node-key="id"
             highlight-current
             :default-expand-all="isShow"
             :check-on-click-node="isShow"
             :show-checkbox="isShow"
             :expand-on-click-node="false"
             check-strictly
             :accordion="accordion"
             ref="tree"
             :data="treeData"
             :default-expanded-keys="aExpandedKeys"
             :filter-node-method="filterNode"
             :props="defaultProps"
             empty-text="当前暂无数据，请添加～～～"
             @check="getNodeData"
             @node-click="getNodeData"
             @node-expand="nodeExpand"
             @node-collapse="nodeCollapse">
    </el-tree>
</template>

<script>
    import {getModulenTree} from "@/api/module";
    import util from "@/libs/util";
    export default {
        name: "moduleTree",
        props:['msg','disabled','accordion'],
        directives: {},
        components: {},
        data() {
            return {
                treeData: [],
                aExpandedKeys: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                oExpandedKey: {
                    // key (from tree id) : expandedOrNot boolean
                },
                oTreeNodeChildren: {
                    // id1 : [children] (from tree node id1)
                    // id2 : [children] (from tree node id2)
                },
            }
        },
        computed: {
            isShow: function () {
                // `this` 指向 vm 实例
                return Boolean(this.disabled) || Boolean(this.msg && this.msg.status)
            }
        },
        watch :{
            'disabled' (to) {
                this.disabled=to;
                this.getList();
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList () {
                getModulenTree().then(response => {
                    if(response.success){
                        response.data=util.sortModule(response.data);
                        if(this.disabled){
                            this.treeData = this.disabledFun(response.data,this.disabled);
                        }else if(this.msg && this.msg.status){
                            this.treeData = this.dataDispose(this.msg.data,response.data);
                        }else{
                            this.treeData=response.data;
                        }
                    }
                })
            },
            filterNode (value, data) {
                this.$emit('deliverMsg',row);
            },
            getNodeData (data) {
                if(this.disabled){
                    if(!data.disabled){
                        this.$emit('node-click',data);
                        this.$refs.tree.setChecked(data,false);
                    }
                }else if(this.msg && this.msg.status){
                    if(!data.disabled){
                        this.$emit('node-click',data);
                        this.$refs.tree.setChecked(data,false);
                        data.disabled=true;
                    }
                }else{
                    this.$emit('node-click',data);
                }
            },
            nodeExpand () {

            },
            nodeCollapse () {

            },
            disabledFun (data,id,status) {
                if(id){
                    for(var i=0;i<data.length;i++){
                        if(data[i].id ===id || status){
                            data[i].disabled= true;
                            if(data[i].children && data[i].children.length){
                                data[i].children=this.disabledFun(data[i].children,id,true);
                            }
                        }
                        if(data[i].children && data[i].children.length){
                            data[i].children=this.disabledFun(data[i].children,id);
                        }
                    }
                }
                return data;
            },
            dataDispose (mydata,alldata) {
                if(mydata && mydata.length){
                    for(var i=0;i<alldata.length;i++){
                        for(var j=0;j<mydata.length;j++){
                            if(alldata[i].id === mydata[j].id){
                                alldata[i].disabled= true;
                            }
                        }
                        if(alldata[i].children && alldata[i].children.length){
                            alldata[i].children=this.dataDispose(mydata,alldata[i].children);
                        }
                    }
                }
                return alldata;
            }
        }
    }
</script>

<style scoped>

</style>