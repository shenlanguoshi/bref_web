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
                  ref="singleTable"
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
                    <span>{{scope.row.name}} </span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="权限创建时间">
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
           <permission :msg="form"  @deliverMsg="create"></permission>
        </el-dialog>
    </div>
</template>

<script>
    import permission from "@/views/admin/permission";
    import {getCorporationWorkP,delCorporationWorkP,addCorporationWorkP} from "@/api/corporationWork";
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    export default {
        name: "corporationWorkPermission",
        directives: {
            waves
        },
        components:{
            permission
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
                getCorporationWorkP(this.id).then(response => {
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
            deletes (row){
                this.$confirm("此操作将永久删除该岗位的权限(权限名:" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delCorporationWorkP({id:this.id,permissionId:row.id}).then((response) => {
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
                addCorporationWorkP({
                    corporationWorkId: this.id,
                    permissionId:data.id
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