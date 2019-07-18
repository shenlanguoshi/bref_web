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
                  highlight-current-row>

            <el-table-column align="center"
                             type="index"
                             width="50"
                             label="序号">

            </el-table-column>

            <el-table-column align="center"
                             label="用户名">
                <template slot-scope="scope">
                    <span>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             class-name="status-col"
                             label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enabled?'success':'danger'">{{scope.row.enabled | statusFilter}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center"
                             label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="修改时间">
                <template slot-scope="scope">
                    <span>{{scope.row.updateAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center"
                             label="操作">
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
            <user :msg="form"  @deliverMsg="create"></user>
        </el-dialog>
    </div>
</template>

<script>
    import user from "@/views/admin/user";
    import {getPermissionUser,delPermissionUser,addPermissionUser} from "@/api/permission";
    import waves from "@/directive/waves/index";
    export default {
        name: "permissionUser",
        props: ['paramsid'],
        components : {
            user
        },
        directives: {
            waves
        },
        data () {
            return {
                list: null,
                listLoading: true,
                id:this.paramsid,
                form: {
                    status:true,
                    data:null
                },
                dialogFormVisible:false,
                tableKey:0
            }
        },
        filters: {
            statusFilter (status) {
                const statusMap = {
                    true: "有效",
                    false: "无效",
                    9: "锁定"
                };
                return statusMap[status];
            }
        },
        watch: {
            'paramsid' (to) {
                this.id=to;
                this.getList();
            }
        },
        created () {
            this.getList();
        },
        methods: {
            getList () {
                this.listLoading = true;
                getPermissionUser(this.id).then(response => {
                    if(response.data.success){
                        this.list = response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                    }
                    this.listLoading = false;
                });

            },
            handleAdd () {
                this.dialogFormVisible = true;
                this.form.data=this.list;
            },
            deletes (row) {
                this.$confirm("此操作将永久删除该权限的用户(用户名:" + row.username + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delPermissionUser({id:this.id,userId:row.id}).then((response) => {
                        if(response.data.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.data.message});
                        }
                    })
                }).catch (() => {
                });
            },
            create (data) {
                this.dialogFormVisible = false;
                addPermissionUser({
                    permissionId: this.id,
                    userId:data.id
                }).then((response) => {
                    if(response.data.success){
                        this.getList();
                        this.$message.success({message:'创建成功'});
                    }else{
                        this.$message.error({message: response.data.message});
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>