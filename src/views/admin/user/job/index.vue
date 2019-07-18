<template>
    <div>
        <div class="filter-container">
            <el-button
                    class="filter-item"
                    size="small"
                    style="margin-left: 10px;"
                    @click="handleAdd"
                    type="primary"
                    v-waves
                    icon="el-icon-plus">添加</el-button>
        </div>
        <el-table :key='tableKey'
                  :data="list"
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
                             label="职务名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
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

        <el-dialog title="添加"
                   :visible.sync="dialogFormVisible">
            <jobPosition :msg="form" @deliverMsg="create"></jobPosition>
        </el-dialog>
    </div>
</template>

<script>
    import jobPosition from "@/views/admin/jobPosition";
    import {job,delJob,addJob} from "@/api/user";
    import waves from "@/directive/waves/index"; // 水波纹指令
    export default {
        name: "user_job",
        directives: {
            waves
        },
        components: {
            jobPosition
        },
        props: ['paramsid'],
        data () {
            return {
                listLoading: true,
                addlistLoading: false,
                tableKey:0,
                dialogFormVisible:false,
                list:null,
                id: this.paramsid,
                form: {
                    status:true,
                    data:null
                }
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
                this.listLoading = true;
                job(this.id).then(response => {
                    if(response.data.success){
                        this.list = response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                    }
                    this.listLoading = false;
                });

            },
            handleAdd (){
                this.dialogFormVisible=true;
                this.form.data=this.list;
            },
            deletes (row) {
                this.$confirm(
                    "此操作将永久删除该用户的职务(职务:" + row.name + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                     delJob({
                         userId:this.id,
                         jobPositionId:row.id
                     }).then(response => {
                         console.log(response);
                         if(response.data.success){
                             this.getList();
                             this.$message.success("删除成功");
                         }else{
                             this.$message.error({message: response.data.message});
                         }
                     });

                }).catch (() => {
                });
            },
            cancel (formName) {
                this.dialogFormVisible = false;
            },
            create (formName) {
                addJob({
                    userJobPositionInfo:JSON.stringify({
                        userId: this.id,
                        jobPositionId:formName.id
                    })
                }).then((response) => {
                    this.cancel();
                    if(response.data.success){
                        this.getList();
                        this.$message.success("添加成功");
                    }else{
                        this.$message.error({message: response.data.message});
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .quartersAll{
        overflow: hidden;
    }
</style>