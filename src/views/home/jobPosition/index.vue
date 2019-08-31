<template>
    <d2-container >
        <template slot="header">
            <el-form inline :model="search" class="form_search" @keyup.enter.native="searchSubmit">
                <el-form-item label="职务名称">
                    <el-input v-model="search.searchParam.name" :maxlength="50" placeholder="请输入职务名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn_comm" @click="searchSubmit">搜索</el-button>
                </el-form-item>

            </el-form>
            <div class="table_btn" v-if="!msg">
                <el-button type="success" class="btn_comm" @click="handleCreate">新增</el-button>
            </div>
        </template>
        <el-table class="main_table"
                  :data="list"
                  ref="singleTable"
                  stripe
                  height="100%"
                  style="width: 100%"
                  @row-click="changeFun">
            <nodata slot="empty"/>
            <el-table-column align="center"
                             type="index"
                             width="50"
                             label="序号">
                <template scope="scope">
                    <span>{{scope.$index+(search.pageNo - 1) * search.pageSize + 1}} </span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="职务名称" align="center" min-width="200"></el-table-column>
            <el-table-column prop="createAt" label="创建时间" align="center" min-width="180"></el-table-column>
            <el-table-column prop="updateAt" label="修改时间" align="center" min-width="180"></el-table-column>
            <el-table-column label="操作" align="center" min-width="180" v-if="!msg">
                <template slot-scope="scope">
                    <el-button type="edit" class="el_text"
                               @click.stop="handleUpdate(scope.row)">修改</el-button><!--v-has="'sys:user:update'"-->
                    <el-button type="del" class="el_text"
                               @click.stop="deletes(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :show-close="false"
                   :title="textMap[dialogStatus]"
                   :visible.sync="dialogFormVisible"
                   @close="cancel('form')"
                   :close-on-click-modal="false"
                   width="560px">
            <el-form label-width="110px"
                     class="form_view"
                     ref="form"
                     :model="form" :rules="rules" >
                <el-form-item label="职务名称"
                              prop="name">
                    <el-input v-model="form.name"
                              placeholder="请输职务名称"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="btn_comm" @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" class="btn_comm"  :loading="$store.state.loading" @click="upsubmit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <template slot="footer">
            <el-pagination
                    background
                    :page-size="search.pageSize"
                    :current-page.sync="search.pageNo"
                    layout="prev, pager, next"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
            </el-pagination>
        </template>
    </d2-container>
</template>

<script>
    import {getJobPosition,addJobPosition,putJobPosition,delJobPosition} from "@/api/jobPosition";
    import tree from "@/views/home/corporation/tree";
    import util from "@/libs/util";

    export default {
        name: 'index',
        components: {
            tree
        },
        props: ['msg'],
        data() {
            return {
                search:{
                    pageNo:1,
                    pageSize:10,
                    searchParam:{
                        name:'',
                    }
                },
                list: null,
                total: null,
                form: {
                    id:null,
                    name: undefined,
                },
                rules: {
                    name: [
                        {required: true,message: "职务名称", trigger: "blur"}
                    ]
                },
                dialogFormVisible: false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                tableKey: 0
            }
        },
        created() {
            this.getlist();
            //console.log(this.$route)
        },

        watch : {
            'msg' (to) {
                this.parentFun(to)
            }
        },
        methods: {
            getlist(){
                getJobPosition(this.search).then(response => {
                    if(response.success){
                        this.list = response.data.list;
                        this.total = response.data.total;
                        if(this.msg){       //父组件调用
                            this.parentFun(this.msg)
                        }
                    }else{
                        this.list=null;
                        this.total=null;
                    }
                });
            },
            handleSizeChange(val) {
                this.search.pageSize= val;
            },
            handleCurrentChange(val) {
                this.search.pageNo = val;
                this.getlist();
            },
            searchSubmit () {
                this.search.pageNo=1;
                this.getlist()
            },
            handleUpdate (row) {
                this.form = util.deepClone(row);
                this.dialogFormVisible = true;
                this.dialogStatus = "update";
            },
            handleCreate () {
                this.resetTemp();
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            cancel (formName) {
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            upsubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.state.loading = true;
                        //获取点击的节点权限(包含半节点)
                        (this.form.id?putJobPosition:addJobPosition)(this.form).then(res =>{
                            if(res.success){
                                this.dialogFormVisible = false;
                                //重新获取列表页
                                this.getlist();
                                this.$message.success(res.message);
                            }else{
                                this.$message.warning(res.message);
                            }
                        })
                    }
                })
            },
            deletes (row) {
                this.$confirm("此操作将永久删除该职务(职务名:" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delJobPosition(row.id).then((response) => {
                        if(response.data.success){
                            this.getlist();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.data.message});
                        }
                    })
                }).catch (() => {
                    this.$message("取消删除");
                });
            },
            resetTemp () {
                this.form = {
                    id:'',
                    name: '',
                };
            },
            changeFun (row ,event, column) {
                if(this.msg){
                    if(this.msg.status && this.preventFun(row,this.msg.data)){
                        this.$message.warning("这个不能选择");
                        return;
                    }
                    this.$emit('deliverMsg',row);
                }else{
                    this.$router.push({ path:'/jobPosition/info/'+row.id,query:{name:row.name}});
                }
            },
            rowCla ({row, rowIndex}) {
                return 'rowCla';
            },
            preventFun (row,data) {
                if(data && data.length){
                    for(let i=0;i<data.length;i++){
                        if(data[i].id===row.id){
                            this.$refs.singleTable.setCurrentRow();
                            return true;
                        }
                    }
                }
                return false;
            },
            parentFun (to) {
                if(to.status){
                    this.rowCla=(({row, rowIndex})=>{
                        if(to.data && to.data.length){
                            for(let i=0;i<to.data.length;i++){
                                if(row.id===to.data[i].id){
                                    return 'error-row';
                                }
                            }
                        }
                        return 'rowCla';
                    });
                    this.$refs.singleTable.setCurrentRow();
                }
            }
        }
    }
</script>
