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
            <el-table-column prop="username" label="用户账号" align="center"></el-table-column>
            <el-table-column align="center"
                             class-name="status-col"
                             label="状态">
                <template slot-scope="scope">
                    <icontab :color="statuschange(scope.row.enabled).color">{{statuschange(scope.row.enabled).text}}</icontab>
                </template>
            </el-table-column>
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
            <user :msg="form"  @deliverMsg="create"></user>
        </el-dialog>
    </d2-container>
</template>

<script>
    import {getJobPositionUser,delJobPositionUser,addJobPositionUser} from "@/api/jobPosition";
    import icontab from "@/components/icontab"
    import user from "@/views/home/user";
    export default {
        name: "index",
        components: {
            icontab,
            user,
        },
        props: ['paramsid'],
        data () {
            return {
                id:this.paramsid,
                list: null,
                listLoading: true,
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
                getJobPositionUser(this.id).then(response => {
                    if(response.success){
                        this.list = response.data;

                    }else{
                        this.$message.error({message: response.message});
                        this.list=null;
                    }
                });
            },
            handleAdd () {
                this.dialogFormVisible = true;
                this.form.data=this.list;
            },
            deletes (row){
                this.$confirm("此操作将永久删除该职务的用户(用户名:" + row.username + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delJobPositionUser({id:this.id,userId:row.id}).then((response) => {
                        if(response.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.message});
                        }
                    })
                }).catch (() => {
                });
            },
            create (data) {
                this.dialogFormVisible = false;
                addJobPositionUser({
                    jobPositionId: this.id,
                    userId:data.id
                }).then((response) => {
                    if(response.success){
                        this.getList();
                        this.$message.success({message:'创建成功'});
                    }else{
                        this.$message.error({message: response.message});
                    }
                });
            },
            statuschange (data) {
                switch (data) {
                    case true :
                        return {
                            text:'有效',
                            color:"#34BF97"
                        };
                    case false :
                        return {
                            text:'无效',
                            color:"#999999"
                        };
                    default :
                        return {
                            text:'无效',
                            color:"#999999"
                        };
                }
            },
        }
    }
</script>