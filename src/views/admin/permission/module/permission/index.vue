<template>
    <div>
        <div class="filter-container">
            <el-button
                    class="filter-item"
                    size="small"
                    style="margin-left: 10px;"
                    @click="handleCreate"
                    type="primary"
                    icon="el-icon-plus">添加</el-button>
        </div>
        <el-table :key='tableKey'
                  :data="list"
                  ref="singleTable"
                  v-loading="listLoading"
                  element-loading-text="给我一点时间"
                  border
                  fit
                  highlight-current-row
                  style="width: 99%">

            <el-table-column align="center"
                             type="index"
                             width="50"
                             label="序号">
            </el-table-column>
            <el-table-column align="center"
                             label="权限名称">
                <template slot-scope="scope">
                        <span>
                          {{scope.row.name}}
                        </span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             width="200">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click.stop="deletes(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog title="选择权限"
                   :visible.sync="dialogVisible">
            <permission :msg="transmitform" @deliverMsg="create"></permission>
        </el-dialog>
    </div>
</template>

<script>
    import {getModulenPermission,delModulenPermission,addModulenPermission} from "@/api/module";
    import permission from "@/views/admin/permission";
    import {deepClone} from "@/util/util";
    export default {
        name: "modulePermission",
        components:{
            permission
        },
        props:['data'],
        data () {
            return {
                dialogVisible:false,
                tableKey:1,
                list:null,
                listLoading:true,
                transmitform: null,
            }
        },
        created () {
            this.getList()
        },
        watch : {
            'data' (to) {
                this.getList();
            }
        } ,
        methods: {
            getList () {
                this.listLoading = true;
                getModulenPermission(this.data).then(response => {
                    if(response.data.success){
                        this.list=response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                    }
                    this.listLoading = false;
                })
            },
            handleCreate () {
                this.dialogVisible=true;
                this.transmitform={
                    data:deepClone(this.list),
                    status:true
                }
            },
            create (data) {
                this.dialogVisible=false;
                addModulenPermission(this.data,data.id).then((response) => {
                    if(response.data.success){
                        this.getList();
                        this.$message.success("添加成功");
                    }else{
                        this.$message.error({message: response.data.message});
                    }
                }).catch(() => {
                    this.$message.error("添加失败");
                });

            },
            deletes (row) {
                this.$confirm(
                    "此操作将永久删除该模块的权限(权限名:" + row.name + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delModulenPermission(this.data,row.id).then((response) => {
                        if(response.data.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.data.message});
                        }
                    }).catch(() => {
                        this.$message.error("删除失败");
                    });

                }).catch (() => {});
            },
        }
    }
</script>

<style scoped>

</style>