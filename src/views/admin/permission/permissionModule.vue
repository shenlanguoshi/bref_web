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
                             label="模块排序">
                <template slot-scope="scope">
                    <span>{{scope.row.sort}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="模块名">
                <template slot-scope="scope">
                    <span>{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="模块链接地址">
                <template slot-scope="scope">
                    <span>{{scope.row.uri}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="前端控件">
                <template slot-scope="scope">
                    <span>{{scope.row.controls}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="模块图标">
                <template slot-scope="scope">
                    <span>{{scope.row.icon}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="是否为菜单">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.menu?'info':'danger'">{{scope.row.menu | statusFilter}}</el-tag>
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
            <module-tree :msg="form" @node-click="create"></module-tree>
        </el-dialog>
    </div>
</template>

<script>
    import moduleTree from "./module/moduleTree";
    import {getPermissionModule,delPermissionModule,addPermissionModule} from "@/api/permission";
    import waves from "@/directive/waves/index";
    export default {
        name: "permissionModule",
        props: ['paramsid'],
        components : {
            moduleTree
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
                    true: "菜单",
                    false: "按钮",
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
                getPermissionModule(this.id).then(response => {
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
                this.$confirm("此操作将永久删除该权限的模块(模块名:" + row.title + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delPermissionModule(this.id,row.id).then((response) => {
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
                addPermissionModule(this.id,data.id).then((response) => {
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