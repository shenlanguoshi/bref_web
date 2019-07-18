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
                             label="权限名称">
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
            <div class="filter-container">
                <el-form label-width="100px">
                    <el-form-item label="用户名">
                        <el-input v-model="$route.query.name"
                                  :disabled="true"
                                  placeholder=""></el-input>
                    </el-form-item>

                </el-form>
            </div>
            <permission :msg="transmitform" @deliverMsg="create"></permission>
        </el-dialog>
    </div>
</template>

<script>
    import {authority,delAuthority,addAuthority} from "@/api/user";
    import permission from "@/views/admin/permission";
    import {deepClone} from "@/util/util";
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    export default {
        name: "user_authority",
        components:{
            permission
        },
        directives: {
            waves
        },
        props: ['paramsid'],
        data () {
            return {
                listLoading: true,
                addlistLoading: false,
                total: null,
                addlist: null,
                multipleSelection:null,
                listQuery: {
                    pageNo: 1,
                    pageSize: 10,
                    name:'',
                },
                transmitform:null,
                tableKey:0,
                dialogFormVisible:false,
                list:null,
                role: [],
                id: this.paramsid,
                form: {
                    username: this.paramsid,
                    tissue: undefined,
                },
                rules: {
                    tissue: [
                        {required: true,message: "请选择组织机构",trigger: "blur"},
                    ]
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
                authority(this.id).then(response => {
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
                this.form.tissue=undefined;
                this.dialogFormVisible=true;
                this.transmitform={
                    data:deepClone(this.list),
                    status:true
                }
            },
            handleUpdate (row) {

            },
            deletes (row) {
                this.$confirm(
                    "此操作将永久删除该用户的权限(权限:" + row.name + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delAuthority({
                        userId:this.id,
                        permissionId:row.id
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
            cancel (formName) {
                this.dialogFormVisible = false;
            },
            create (formName) {
                this.cancel();
                addAuthority({
                    userPermissionInfo:JSON.stringify({
                        userId: this.id,
                        permissionId:formName.id
                    })
                }).then((response) => {
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