<template>
    <div>
        <div class="filter-container">
            <el-button
                    class="filter-item"
                    size="small"
                    style="margin-left: 10px;"
                    @click="handleCreate"
                    type="primary"
                    icon="el-icon-plus">添加</el-button>
        </div>
            <el-table :key='tableKey'
                      :data="list"
                      ref="singleTable"
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
                                 label="用户名">
                    <template slot-scope="scope">
                        <span>
                          {{scope.row.username}}
                        </span>
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
    </div>

</template>

<script>
    import {getCorporationUser,delCorporationUser,addCorporationUser} from "@/api/corporation";
    import user from "@/views/admin/user";
    export default {
        name: "corporation_user",
        components : {
            user
        },
        props:['data','dialog'],
        data () {
            return {
                dialogVisible:true,
                tableKey:1,
                list:null,
                listLoading:true,
                transmitform:{
                    id:null
                }
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
        created () {
            this.getList()
        },
        watch : {
            'data' (to) {
                this.getList();
            }
        } ,
        methods: {
            getList () {
                this.listLoading = true;
                getCorporationUser(this.data).then(response => {
                    if(response.data.success){
                        this.list=response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                    }
                    this.listLoading = false;
                })
            },
            deletes (row) {
                this.$confirm(
                    "此操作将永久删除该组织机构用户(用户名:" + row.username + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delCorporationUser({
                        userId:row.id,
                        id:this.data
                    }).then((response) => {
                        if(response.data.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.data.message});
                        }
                    }).catch(() => {
                        this.$message.error("删除失败");
                    });

                }).catch (() => {
                });
            },
            handleCreate () {
                this.$emit('deliverMsgs',this.list);
            },
            add (e) {
                addCorporationUser({
                    corporationId:this.data,
                    userId:e
                }).then(response => {
                    if(response.data.success){
                        this.getList();
                        this.$message.success("添加成功");
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