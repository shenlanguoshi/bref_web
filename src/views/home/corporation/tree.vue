<template>
    <el-tree class="filter-tree"
             node-key="id"
             highlight-current
             default-expand-all
             :check-on-click-node="msg && msg.status"
             :show-checkbox="msg && msg.status"
             check-strictly
             :data="treeData"
             :expand-on-click-node="false"
             :default-expanded-keys="aExpandedKeys"
             :filter-node-method="filterNode"
             :props="defaultProps"
             @check="getNodeData"
             @node-click="getNodeData"
             @node-expand="nodeExpand"
             @node-collapse="nodeCollapse">
    </el-tree>
</template>

<script>
    import {getCorporation} from "@/api/corporation";

    export default {
        name: "tree",
        props:['msg'],
        data () {
            return {
                treeData: [],
                aExpandedKeys: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
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
        created () {
            this.getList();
        },
        methods: {
            getList () {
                getCorporation().then(response => {
                    if(response.success){
                        if(this.msg && this.msg.status){
                            this.treeData = this.dataDispose(this.msg.data,response.data);
                        }else{
                            this.treeData=response.data;
                        }
                    }
                })
            },
            filterNode (value, data) {
                /* if (!value) return true
                 return data.label.indexOf(value) !== -1*/
                this.$emit('deliverMsg',row);
            },
            getNodeData (data) {
                if(this.msg && this.msg.status){
                    if(!data.disabled){
                        data.disabled= true;
                        this.$emit('node-click',data);
                    }
                }else{
                    this.$emit('node-click',data);
                }
                /* if (!this.formEdit) {
                     this.formStatus = 'update'
                 }
                 this.form=deepClone(data);
                 this.temporaryData=data;
                 this.currentId = this.form.id;
                 this.showElement = true*/
            },
            nodeExpand (data) {
                /*  let aChildren = data.children
                  if (aChildren.length > 0) {
                      this.oExpandedKey[data.id] = true
                      this.oTreeNodeChildren[data.id] = aChildren
                  }
                  this.setExpandedKeys()*/
            },
            nodeCollapse (data) {
                /*  this.oExpandedKey[data.id] = false
                  // 如果有子节点
                  this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
                      this.oExpandedKey[oNode.id] = false
                  });
                  this.setExpandedKeys()*/
            },
            dataDispose (mydata,alldata) {
                if(mydata && mydata.length){
                    for(let i=0;i<alldata.length;i++){
                        for(let j=0;j<mydata.length;j++){
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

<style scoped lang="scss">

</style>