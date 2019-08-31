<template>
    <d2-container margin>
        <template slot="header">

            <el-button type="success" class="btn_comm" @click="handleAdd">添加</el-button>

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
            <el-table-column prop="name" label="权限名称" align="center"></el-table-column>
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
        <el-dialog title="添加" class="my_dialog_scroll"
                   :visible.sync="dialogFormVisible">
            <role :msg="form"  @deliverMsg="create"></role>
        </el-dialog>
    </d2-container>
</template>

<script>
    import {getDataSchemaPermission,delDataSchemaPermission,addDataSchemaPermission} from "@/api/roleList";
    import role from "@/views/home/role";

    export default {
        name: "index",
        components: {
            role,
        },
        props: ['paramsid'],
        data () {
            return {
                id:this.paramsid,
                list: null,
                dialogFormVisible:false,
                form: {
                    status:true,
                    data:null
                },
                tableKey: 0
            }
        },
        created () {
            this.getList()
        },
        watch : {
            'paramsid' (to) {
                this.id=to;
                this.getList();
            }
        } ,
        methods: {
            getList () {
                getDataSchemaPermission(this.id).then(response => {
                    if(response.success){
                        this.list = response.data;

                    }else{
                        this.$message.warning({message: response.message});
                        this.list=null;
                    }
                });
            },
            handleAdd () {
                this.dialogFormVisible = true;
                this.form.data=this.list;
            },
            deletes (row){
                this.$confirm(
                    "此操作将永久删除该权限(权限名:" + row.name + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delDataSchemaPermission(this.id,row.id).then((response) => {
                        if(response.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.warning({message: response.message});
                        }
                    })
                }).catch (() => {
                });
            },
            create (data) {
                this.dialogFormVisible = false;
                addDataSchemaPermission(this.id,data.id).then((response) => {
                    if(response.success){
                        this.getList();
                        this.$message.success({message:'创建成功'});
                    }else{
                        this.$message.warning({message: response.message});
                    }
                });
            }
        }
    }
</script>