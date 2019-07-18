<template>
    <div class="app-container calendar-list-container">
        <basic-container>
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
                        <span>{{scope.row.user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="用户id">
                    <template slot-scope="scope">
                        <span>{{scope.row.user_id}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="token（令牌）">
                    <template slot-scope="scope">
                        <span>{{scope.row.token_value}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="认证类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.grant_type}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="令牌类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.token_type}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="	客户端id">
                    <template slot-scope="scope">
                        <span>{{scope.row.client_id}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="有效时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.expires_in | periodTime()}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </basic-container>
    </div>
</template>

<script>
    import {getListToken } from "@/api/user";
    export default {
        name: "listToken",
        data() {
            return {
                dialogVisible:false,
                tableKey:1,
                list:null,
                listLoading:true,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList () {
                this.listLoading = true;
                getListToken().then(response => {
                    if(response.data.success){
                        this.list=response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                    }
                    this.listLoading = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>