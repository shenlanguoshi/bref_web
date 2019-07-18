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
                             label="岗位名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="所属组织机构名称">
                <template slot-scope="scope">
                    <span>{{scope.row.corporationName}}</span>
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
            <corporationWork :msg="form" @deliverMsg="create"></corporationWork>
        </el-dialog>
    </div>
</template>

<script>
    import corporationWork from "@/views/admin/corporationWork";
    import {quarters,delQuarters,addQuarters} from "@/api/user";
    import waves from "@/directive/waves/index"; // 水波纹指令
    export default {
        name: "user_quarters",
        directives: {
            waves
        },
        components: {
            corporationWork
        },
        props: ['paramsid'],
        data () {
            return {
                listLoading: true,
                listQuery: {
                    pageNo: 1,
                    pageSize: 10,
                    name:'',
                    corporationId:''
                },
                tableKey:0,
                dialogFormVisible:false,
                list:null,
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
                this.listLoading = true;
                quarters(this.id).then(response => {
                    if(response.data.success){
                        this.list = response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                    }
                    this.listLoading = false;
                });

            },
            changeFun(val) {
                let status=1;
                if(this.list && this.list.length){
                    for(let i=0;i<this.list.length;i++){
                        if(this.list[i].id===val.id){
                            status=0;
                            break;
                        }
                    }
                }
                if(status){
                    this.multipleSelection = val;
                }else{
                    this.multipleSelection = null;
                    this.$refs.singleTable.setCurrentRow();
                }
            },
            handleAdd (){
                this.dialogFormVisible=true;
                this.form.data=this.list;
            },
            deletes (row) {
                this.$confirm(
                    "此操作将永久删除该用户的岗位(岗位:" + row.name + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delQuarters({
                        userId:this.id,
                        corporationWorkId:row.id
                    }).then(response => {
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
            cancel () {
                this.dialogFormVisible = false;
            },
            create (data) {
                addQuarters({
                    userCorporationWorkInfo:JSON.stringify({
                        userId: this.id,
                        corporationWorkId:data.id
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