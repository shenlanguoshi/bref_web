<template>
    <d2-container margin>
        <template slot="header">
            <el-form inline :model="search" class="form_search" @keyup.enter.native="searchSubmit">
                <el-form-item label="名称">
                    <el-input v-model="search.searchParam.name" :maxlength="50" placeholder="数据权限-行名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn_comm" @click="searchSubmit">搜索</el-button>
                </el-form-item>

            </el-form>
            <el-button type="success" class="btn_comm" @click="handleAdd">添加</el-button>

        </template>
        <el-table
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
            <el-table-column prop="columnName" label="列名" align="center"></el-table-column>
            <el-table-column prop="operator" label="操作符" align="center"></el-table-column>
            <el-table-column prop="dataScope" label="列域" align="center"></el-table-column>
            <el-table-column prop="createAt" label="创建日期" align="center" ></el-table-column>
            <el-table-column prop="updateAt" label="修改时间" align="center" ></el-table-column>

            <el-table-column align="center"
                             label="操作"
                             width="200">
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
                <el-form-item label="数据权限-行id"
                              prop="dataScopeId">
                    <el-input v-model="form.dataScopeId"  disabled
                              placeholder="请输数据权限-行id"></el-input>
                </el-form-item>

                <el-form-item label="列名"
                              prop="columnName">
                    <el-select v-model="form.columnName" clearable
                               @change="validateColumnName"
                               placeholder="请选择列名">
                        <el-option
                                v-for="item in columnNameList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="判断符号"
                              prop="operator">
                    <el-select v-model="form.operator" clearable
                               @change="validateOperator"
                               placeholder="请选择判断符号">
                        <el-option
                                v-for="item in operatorList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行域"
                              prop="dataScope">
                    <el-input v-model="form.dataScope"
                              :disabled="!dataScopeOne"
                              readonly
                              @focus="getDataScopet()"
                              placeholder="请输行域"></el-input>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="btn_comm" @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" class="btn_comm"  :loading="$store.state.loading" @click="upsubmit('form')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加" class="my_dialog_scroll"
                   :visible.sync="dialogDeptVisible">
            <roleLine :msg="transmitform" @deliverMsg="createfun"></roleLine>
        </el-dialog>
        <change-field ref="domTree" :dataType="dataScopeOne"
                      @node-click="changeFieldPut"
                      @close="changeFieldClose"></change-field>
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
    import {getDataScopeItem,putDataScopeItem,addDataScopeItem,delDataScopeItem,getDataScopeJson} from "@/api/roleLine";
    import roleLine from "@/views/home/roleLine";
    import changeField from "./changeField";
    import util from "@/libs/util";

    export default {
        name: "index",
        components: {
            roleLine,
            changeField,
        },
        props: ['paramsid'],
        data () {
            return {
                search:{
                    pageNo:1,
                    pageSize:10,
                    searchParam:{
                        name:''
                    }
                },
                id:this.paramsid,
                total:0,
                list: [],
                dataScopeJsonList:null,
                columnNameList:[],
                operatorList:[],
                dataScopeOne:null,
                dialogFormVisible: false,
                dialogDeptVisible: false,
                formStatus:"编辑",
                transmitform: {
                    status:true,
                    data:null
                },
                form: {
                    dataScopeId:this.paramsid,
                    columnName:'',
                    operator:'',
                    dataScope:'',
                    id:''
                },
                rules: {
                    dataScopeId: [
                        {required: true,message: "请输入数据权限-行id", trigger: "change"},
                    ],
                    columnName: [
                        {required: true,message: "请选择列名称", trigger: "blur"},
                    ],
                    operator: [
                        {required: true,message: "请选择判断符号", trigger: "blur"},
                        { min: 1,max:20, message: '最大长度20', trigger: 'blur' }
                    ],
                    dataScope: [
                        {required: true,message: "请输入行域", trigger: "change"},
                    ]
                },
            }
        },
        created () {
            this.getlist();
            this.getEntryList();
        },
        watch : {
            'paramsid' (to) {
                this.id=to;
                this.getList();
            }
        } ,
        methods: {
            getlist(){
                getDataScopeItem(this.search).then(response => {
                    if(response.success){
                        this.list = response.data.list;
                        this.total = response.data.total;
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
                        this.columnNameList=this.dataDeal(response.data);
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
                this.dataScopeOne=this.dataScopeJsonList[this.form.columnName][this.form.operator];
            },
            handleDelete (row){
                this.$confirm("此操作将永久删除该数据权限-行项目(权限名:" + row.columnName + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDataScopeItem(row.id).then((response) => {
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
                        (this.form.id?putDataScopeItem:addDataScopeItem)(
                            this.form.dataScopeId,
                            this.form.columnName,
                            this.form.operator,
                            this.form.id?this.form.dataScope: this.form.dataScope.replace(/%/g,'%25'),
                            this.form.id
                        ).then(res =>{
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
                this.form = {
                    dataScopeId:this.paramsid,
                    columnName:'',
                    operator:'',
                    dataScope:'',
                    id:''
                };
                this.dataScopeOne='';
            },
            dataDeal (data) {
                let arr=[];
                if(data){
                    for(let item in data){
                        arr.push(item);
                    }
                }
                return arr;
            },
            validateColumnName (){
                this.form.operator=undefined;
                this.dataScopeOne=undefined;
            },
            validateOperator () {
                this.dataScopeOne=this.dataScopeJsonList[this.form.columnName][this.form.operator];
            },
            changeFieldPut (data) {
                this.form.dataScope=data;
            },
            getDataScopet () {
                this.$refs.domTree.openClick();
                //this.dataScopetOn=true;
            },
            changeFieldClose () {
                //this.dataScopetOn=false;
            },
            changedataScopeId () {
                this.dialogDeptVisible=true;
                //this.transmitform.data=this.list;
            },
            createfun (data) {
                this.form.dataScopeId=data.id;
                this.dialogDeptVisible=false;
            },
        }
    }
</script>