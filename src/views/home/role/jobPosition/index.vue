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

            <el-table-column prop="name" align="center" label="职务名称"></el-table-column>
            <el-table-column prop="createAt" align="center" label="创建时间"></el-table-column>
            <el-table-column prop="updateAt" align="center" label="修改时间"></el-table-column>

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
                   width="820px"
                   class="my_dialog_scroll"
                   :visible.sync="dialogFormVisible">
            <jobPosition :msg="form" @deliverMsg="create"></jobPosition>
        </el-dialog>
    </d2-container>
</template>

<script>
    import jobPosition from "@/views/home/jobPosition";
    import {getPermissionJobPosition,delPermissionJobPosition,addPermissionJobPosition} from "@/api/role";

    export default {
        name: "index",
        components : {
            jobPosition
        },
        props: ['paramsid'],
        data () {
            return {
                tableKey:0,
                dialogFormVisible:false,
                list:null,
                role: [],
                options:[],
                id:this.paramsid,
                form: {
                    status:true,
                    data:null
                },
            }
        },
        created () {
            this.getList();
        },
        watch: {
            'paramsid' (to, from) {
                this.id=to;
                this.getList();
            }
        },
        methods: {
            getList () {
                getPermissionJobPosition(this.id).then(response => {
                    if(response.success){
                        this.list = response.data;
                    }else{
                        this.$message.warning(response.message);
                        this.list=null;
                    }
                });

            },
            handleAdd (){
                this.dialogFormVisible=true;
                this.form.data=this.list;
            },
            deletes (row) {
                this.$confirm("此操作将永久删除该权限的职务(职务名:" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delPermissionJobPosition(this.id,row.id).then(response => {
                        if(response.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.warning(response.data.message);
                        }
                    });

                }).catch (() => {
                });
            },
            cancel () {
                this.dialogFormVisible = false;
            },
            create (data) {
                addPermissionJobPosition(this.id,data.id).then((response) => {
                    this.cancel();
                    if(response.success){
                        this.getList();
                        this.$message.success("添加成功");
                    }else{
                        this.$message.warning(response.data.message);
                    }
                });
            },
        }
    }
</script>