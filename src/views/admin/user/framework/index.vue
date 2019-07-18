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
                             label="主管名称">
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
            <tree :msg="form" @node-click="create"></tree>
        </el-dialog>
    </div>
</template>

<script>
    import tree from "@/views/admin/corporation/tree";
    import { corporation,delCorporation,addCorporation} from "@/api/user";
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    export default {
        name: "user_framework",
        directives: {
            waves
        },
        components : {
            tree
        },
        props: ['paramsid'],
        data () {
            return {
                listLoading: true,
                tableKey:0,
                dialogFormVisible:false,
                list:null,
                role: [],
                options:[],
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
                corporation(this.id).then(response => {
                    if(response.data.success){
                        this.list = response.data.data;
                       // this.total = response.data.data.total;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                        //this.total='';
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
                    "此操作将永久删除该用户的组织机构(组织机构:" + row.name + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delCorporation({
                        userId:this.id,
                        corporationId:row.id
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
            create (formName) {
                addCorporation({
                    userCorporationInfo:JSON.stringify({
                        userId: this.id,
                        corporationId:formName.id
                    })
                }).then((response) => {
                    this.dialogFormVisible = false;
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

</style>