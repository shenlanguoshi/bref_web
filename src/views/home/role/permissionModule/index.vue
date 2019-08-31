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
            <el-table-column prop="sort" label="模块排序" align="center" min-width="200"></el-table-column>
            <el-table-column prop="title" label="模块名" align="center" min-width="180"></el-table-column>
            <el-table-column prop="uri" label="模块链接地址" align="center" min-width="180"></el-table-column>
            <el-table-column prop="controls" label="前端控件" align="center" min-width="180"></el-table-column>
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
        <el-dialog title="添加"
                   :visible.sync="dialogFormVisible">
            <moduleTree :msg="form"  @node-click="create"></moduleTree>
        </el-dialog>
    </d2-container>
</template>

<script>
    import {getPermissionModule,delPermissionModule,addPermissionModule} from "@/api/role";
    import moduleTree from "@/views/home/module/moduleTree";

    export default {
        name: "index",
        components: {
            moduleTree,
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
                getPermissionModule(this.id).then(response => {
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
                    "此操作将永久删除该权限的模块(模块名:" + row.name + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delPermissionModule(this.id,row.id).then((response) => {
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
                addPermissionModule(this.id,data.id).then((response) => {
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