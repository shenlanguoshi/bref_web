<template>
    <d2-container margin>
        <template slot="header">

                <el-button type="success" class="btn_comm" @click="handleCreate">添加</el-button>

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
    </d2-container>
</template>

<script>
    import {getCorporationUser,delCorporationUser,addCorporationUser} from "@/api/corporation";
    import icontab from "@/components/icontab"
    export default {
        name: "index",
        props:['data','dialog'],
        components: {
            icontab,
        },
        data () {
            return {
                dialogVisible:true,
                tableKey:1,
                list:null,
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
            'paramsid' (to) {
                this.id=to;
                this.getList();
            }
        } ,
        methods: {
            getList () {
                getCorporationUser(this.data).then(response => {
                    if(response.success){
                        this.list=response.data;
                    }else{
                        this.$message.error({message: response.message});
                        this.list=null;
                    }
                })
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
                        if(response.success){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.message});
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
                    if(response.success){
                        this.getList();
                        this.$message.success("添加成功");
                    }else{
                        this.$message.error({message: response.message});
                    }
                });
            }
        }
    }
</script>