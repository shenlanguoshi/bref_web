<template>
    <d2-container >
        <template slot="header">
            <el-form inline :model="search" class="form_search" @keyup.enter.native="searchSubmit">
                <el-form-item label="名称">
                    <el-input v-model="search.searchParam.name" :maxlength="50" placeholder="数据权限-行名称"></el-input>
                </el-form-item>
                <el-form-item label="标识">
                    <el-select v-model="search.searchParam.entry"
                               clearable
                               @change="searchSubmit"
                               placeholder="标识">
                        <el-option
                                v-for="item in entryList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn_comm" @click="searchSubmit">搜索</el-button>
                </el-form-item>

            </el-form>
            <div class="table_btn" v-if="!msg">
                <el-button type="success" class="btn_comm" @click="handleAdd">新增</el-button>
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
            <el-table-column  type="index" label="ID" align="center" min-width="120"/>
            <el-table-column prop="name" label="数据权限-行名称" align="center" min-width="200"></el-table-column>
            <el-table-column prop="entry" label="数据权限标识" align="center" min-width="180"></el-table-column>
            <el-table-column prop="corporationName" label="组织机构" align="center" min-width="180"></el-table-column>
            <el-table-column prop="priority" label="优先级" align="center" min-width="180"></el-table-column>
            <el-table-column prop="createAt" label="创建日期" align="center" min-width="180"></el-table-column>
            <el-table-column prop="updateAt" label="修改时间" align="center" min-width="180"></el-table-column>
            <el-table-column label="操作" align="center" min-width="180" v-if="!msg">
                <template slot-scope="scope">
                    <el-button type="edit" class="el_text"
                               @click.stop="handleEdit(scope.row)">修改</el-button><!--v-has="'sys:user:update'"-->
                    <el-button type="del" class="el_text"
                               @click.stop="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :show-close="false"
                   :title="`${formStatus}`"
                   :visible.sync="dialogFormVisible"
                   :close-on-click-modal="false"
                   width="560px"
                   @closed="handleClose('form')">
            <el-form label-width="110px"
                     class="form_view"
                     ref="form"
                     :model="form" :rules="rules" >
                <el-form-item label="名称"  prop="name">
                    <el-input v-model="form.name" :maxlength="50" autocomplete="off" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="组织机构"
                              prop="corporationName">
                    <el-input v-model="form.corporationName"
                              placeholder="请选择组织机构"
                              @focus="handleDept()"
                              readonly></el-input>
                </el-form-item>
                <el-form-item label="标识"
                              prop="entry">
                    <el-select v-model="form.entry" clearable placeholder="请选择标识">
                        <el-option
                                v-for="item in entryList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优先级"
                              prop="priority">
                    <el-input-number v-model="form.priority"
                                     :min="0"
                                     controls-position="right"
                                     placeholder="请输优先级"></el-input-number>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="btn_comm" @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" class="btn_comm"  :loading="$store.state.loading" @click="upsubmit('form')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择组织机构"
                   :visible.sync="dialogDeptVisible">
            <tree @node-click="optTree"></tree>
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
    import {getDataScope,putDataScope,addDataScope,delDataScope,getDataScopeJson} from "@/api/roleLine";
    import util from "@/libs/util";
    import tree from "@/views/home/corporation/tree";

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
                        entry:'',
                        priority:'',
                        name:''
                    }
                },
                total:0,
                list: [],
                entryList:[],
                dialogFormVisible: false,
                dialogDeptVisible: false,
                formStatus:"编辑",
                form: {
                    corporationId:'',
                    corporationName:'',
                    entry:'',
                    priority:'',
                    name:'',
                    id:''
                },
                rules: {
                    name: [
                        {required: true,message: "请输入名称", trigger: "blur"},
                        {max:50, message: '最大长度50', trigger: 'blur' }
                    ],
                    entry: [
                        {required: true,message: "请选择标识", trigger: "blur"},
                        { min: 1,max:50, message: '最大长度50', trigger: 'blur' }
                    ],
                    priority: [
                        {required: true,message: "请输入优先级", trigger: "change"},
                    ],
                    corporationName: [
                        {required: true,message: "请选择组织机构",trigger: "change"}
                    ],
                },
            }
        },
        created() {
            this.getlist();
            this.getEntryList()
        },

        watch : {
            'msg' (to) {
                this.parentFun(to)
            }
        },
        methods: {
            getlist(){
                getDataScope(this.search).then(response => {
                    if(response.success){
                        this.list = response.data.list;
                        this.total = response.data.total;
                        if(this.msg){       //父组件调用
                            this.parentFun(this.msg.data)
                        }
                    }else{
                        this.$message.error({message: response.message});
                        this.list=null;
                        this.total=null;
                    }
                });

            },
            getEntryList () {
                getDataScopeJson().then(response => {
                    if(response.success){
                        this.entryList=this.dataDeal(response.data);
                    }else{
                        this.$message.error({message: response.message});
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
            handleAdd () {

                this.formStatus= "新增";
                this.dialogFormVisible= true;
            },
            handleEdit(row){
                this.formStatus= "编辑";
                this.form ={...this.form,...util.deepClone(row)} ;
                this.dialogFormVisible= true;
            },
            handleDept () {
                this.dialogDeptVisible = true;
            },
            optTree (data) {
                this.form.corporationId=data.id;
                this.form.corporationName=data.name;
                this.dialogDeptVisible = false;
            },
            handleDelete (row){
                this.$confirm("此操作将永久删除该数据权限-行(权限名:" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDataScope(row.id).then((response) => {
                        if(response.success){
                            this.getlist();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error({message: response.message});
                        }
                    })
                }).catch (() => {
                    this.$message("取消成功");
                });
            },
            upsubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.state.loading = true;
                        //获取点击的节点权限(包含半节点)
                        (this.form.id?putDataScope:addDataScope)(this.form).then(res =>{
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
            handleClose (row) {
                this.$refs[row].resetFields();
                this.form={
                    corporationId:'',
                    corporationName:'',
                    entry:'',
                    priority:'',
                    name:'',
                    id:''
                }
            },
            dataDeal (data) {
                let arr=[];
                for(let item in data){
                    arr.push(item);
                }
                return arr;
            },
            changeFun (row) {
                if(this.msg){
                    if(this.preventFun(row,this.msg.data)){
                        this.$message.warning("这个不能选择");
                        return;
                    }
                    this.$emit('deliverMsg',row);
                }else{
                    this.$router.push({ path:'/roleLine/info/'+row.id,query:{name:row.name,entry:row.entry}});
                }

            },
            preventFun (row,data) {
                if(data && data.length){
                    for(let i=0;i<data.length;i++){
                        if((data[i].dataScopeId || data[i].id)===row.id){
                            this.$refs.singleTable.setCurrentRow();
                            return true;
                        }
                    }
                }
                return false;
            },
            parentFun (to) {
                this.rowCla=(({row, rowIndex})=>{
                    if(to && to.length){
                        for(let i=0;i<to.length;i++){
                            if(row.id===(to[i].dataScopeId || to[i].id)){
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
</script>
