<template>
    <d2-container margin>
        <template slot="header">

            <el-button type="success" class="btn_comm" @click="handleAdd">添加</el-button>

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

            <el-table-column prop="name" align="center" label="组织机构名称"></el-table-column>
            <el-table-column prop="supervisorName" align="center" label="主管名称"></el-table-column>
            <el-table-column prop="createAt" align="center" label="创建时间"></el-table-column>
            <el-table-column prop="updateAt" align="center" label="修改时间"></el-table-column>
            <el-table-column align="center"
                             label="操作"
                             width="200">
                <template slot-scope="scope">
                    <el-button type="del" class="el_text"
                               @click.stop="deletes(scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog title="添加"
                   :visible.sync="dialogFormVisible">
            <tree :msg="form" @node-click="create"></tree>
        </el-dialog>
    </d2-container>
</template>

<script>
    import tree from "@/views/home/corporation/tree";
    import { corporation,delCorporation,addCorporation} from "@/api/user";

    export default {
        name: "index",
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
                    if(response.success){
                        this.list = response.data;
                        // this.total = response.data.data.total;
                    }else{
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
                        if(response.success){
                            this.getList();
                            this.$message.success("删除成功");
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
                    if(response.success){
                        this.getList();
                        this.$message.success("添加成功");
                    }
                });
            },
        }
    }
</script>