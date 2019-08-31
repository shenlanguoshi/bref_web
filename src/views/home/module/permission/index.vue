<template>
    <d2-container margin>
        <template slot="header">

            <el-button type="success" class="btn_comm" @click="handleCreate">添加</el-button>

        </template>
        <el-table :key='tableKey'
                  class="main_table"
                  :data="list"
                  stripe
                  height="100%"
                  style="width: 100%">
            <nodata slot="empty"/>
            <el-table-column align="center"
                             type="index"
                             width="50"
                             label="序号">
            </el-table-column>
            <el-table-column align="center"
                             prop="name"
                             label="权限名称"></el-table-column>
            <el-table-column prop="createAt" label="创建日期" align="center" ></el-table-column>
            <el-table-column align="center"
                             label="操作"
                             width="200">
                <template slot-scope="scope">
                    <el-button type="del" class="el_text"
                               @click.stop="deletes(scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog title="选择权限"
                   :visible.sync="dialogVisible">
            <!--<permission :msg="transmitform" @deliverMsg="create"></permission>-->
        </el-dialog>
    </d2-container>
</template>

<script>
    import {getModulenPermission,delModulenPermission,addModulenPermission} from "@/api/module";
    //import permission from "@/views/admin/permission";
    import util from "@/libs/util";
    export default {
        name: "modulePermission",
        components:{
           // permission
        },
        props:['data'],
        data () {
            return {
                dialogVisible:false,
                tableKey:1,
                list:null,
                transmitform: null,
            }
        },
        created () {
            this.getList()
        },
        watch : {
            'data' () {
                this.getList();
            }
        } ,
        methods: {
            getList () {
                getModulenPermission(this.data).then(response => {
                    if(response.success){
                        this.list=response.data;
                    }else{
                        this.$message.error({message: response.message});
                        this.list=null;
                    }
                })
            },
            handleCreate () {
                this.dialogVisible=true;
                this.transmitform={
                    data:util.deepClone(this.list),
                    status:true
                }
            },
            create (data) {
                this.dialogVisible=false;
                addModulenPermission(this.data,data.id).then((response) => {
                    if(response.success){
                        this.getList();
                        this.$message.success("添加成功");
                    }else{
                        this.$message.error({message: response.message});
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
                        if(response.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.message});
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