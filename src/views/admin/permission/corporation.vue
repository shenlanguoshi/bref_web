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
                             label="组织机构名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="主管">
                <template slot-scope="scope">
                    <span>{{scope.row.supervisorName}}</span>
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
            <tree :msg="form" @node-click="create"></tree>
        </el-dialog>
    </div>
</template>

<script>
    import tree from "@/views/admin/corporation/tree";
    import {getPermissionCor,delPermissionCor,addPermissionCor} from "@/api/permission";
    import waves from "@/directive/waves/index";
    export default {
        name: "permissionCorporation",
        props: ['paramsid'],
        components : {
            tree
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
                getPermissionCor(this.id).then(response => {
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
                this.$confirm("此操作将永久删除该权限的组织机构(组织机构名:" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delPermissionCor({id:this.id,userId:row.id}).then((response) => {
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
                addPermissionCor({
                    permissionId: this.id,
                    corporationId:data.id
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