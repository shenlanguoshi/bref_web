<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter"
                          style="width: 200px;"
                          class="filter-item"
                          size="small"
                          clearable
                          placeholder="数据权限-行名称"
                          v-model="listQuery.name">
                </el-input>
                <el-button class="filter-item"
                           type="primary"
                           size="small"
                           v-waves
                           icon="el-icon-search"
                           @click="handleFilter">搜索</el-button>
                <el-button v-if=" !msg"
                           class="filter-item"
                           size="small"
                           style="margin-left: 10px;"
                           @click="handleCreate"
                           type="primary"
                           icon="el-icon-plus">添加</el-button>
            </div>
            <el-table :key='tableKey'
                      ref="singleTable"
                      :data="list"
                      v-loading="listLoading"
                      element-loading-text="给我一点时间"
                      @row-click="changeFun"
                      :row-class-name="rowCla"
                      border
                      fit
                      highlight-current-row
                      style="width: 99%">

                <el-table-column align="center"
                                 type="index"
                                 width="50"
                                 label="序号">
                    <template scope="scope">
                        <span>{{scope.$index+(listQuery.pageNo - 1) * listQuery.pageSize + 1}} </span>
                    </template>
                </el-table-column>

                <el-table-column align="center"
                                 label="列名">
                    <template slot-scope="scope">
                        <span>{{scope.row.columnName}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="操作符">
                    <template slot-scope="scope">
                        <span>{{scope.row.operator}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="列域">
                    <template slot-scope="scope">
                        <span>{{scope.row.dataScope}} </span>
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
                                 v-if="!msg"
                                 width="200">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="success"
                                icon="el-icon-edit"
                                @click.stop="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click.stop="deletes(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div v-show="!listLoading"
                 class="pagination-container">
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page.sync="listQuery.pageNo"
                               :page-sizes="[10,20,30, 50]"
                               :page-size="listQuery.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </basic-container>
        <el-dialog :title="textMap[dialogStatus]"
                   :visible.sync="dialogFormVisible"
                   @close="cancel('form')">
            <el-form :model="form"
                     :rules="rules"
                     ref="form"
                     label-width="120px">
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
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'"
                           type="primary"
                           @click="create('form')">确 定</el-button>
                <el-button v-else
                           type="primary"
                           @click="update('form')">修 改</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择权限"
                   :visible.sync="dialogVisible">
            <data-scope :msg="transmitform" @deliverMsg="createfun"></data-scope>
        </el-dialog>
        <change-field ref="domTree" :dataType="dataScopeOne"
                      @node-click="changeFieldPut"
                      @close="changeFieldClose"></change-field>
        <!--v-if="dataScopeOne && dataScopetOn"-->
    </div>
</template>

<script>
    import {getDataScopeItem,putDataScopeItem,addDataScopeItem,delDataScopeItem,getDataScopeJson} from "@/api/dataScope";
    import waves from "@/directive/waves/index"; // 水波纹指令
    import {deepClone} from "@/util/util";
    import dataScope from "./dataScope";
    import changeField from "./changeField";
    export default {
        name: "dataScopeItem",
        props: ['msg','paramsid'],
        directives: {
            waves
        },
        components: {
            dataScope,
            changeField
        },
        data () {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    pageNo: 1,
                    pageSize: 10,
                    entry:undefined,
                    priority:undefined,
                    dataScopeId:this.paramsid,
                    name:undefined
                },
                form: {
                    dataScopeId:undefined,
                    columnName:undefined,
                    operator:undefined,
                    dataScope:undefined,
                    id:null
                },
                dataScopeJsonList:null,
                columnNameList:[],
                operatorList:[],
                dataScopeOne:null,
                //dataScopetOn:false,
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
                dialogFormVisible: false,
                dialogVisible:false,
                transmitform: {
                    status:true,
                    data:null
                },
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                isDisabled: {
                    0: false,
                    1: true
                },
                tableKey: 10
            };
        },
        created () {
            this.getList();
            this.getEntryList();
        },
        methods: {
            getList () {
                this.listLoading = true;
                //this.listQuery.isAsc = false;
                getDataScopeItem(this.listQuery).then(response => {
                    if(response.data.success){
                        this.list = response.data.data.list;
                        this.total = response.data.data.total;
                        if(this.msg){       //父组件调用
                            this.parentFun(this.msg.data)
                        }
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                        this.total=null;
                    }
                    this.listLoading = false;
                });
            },
            handleFilter () {
                this.listQuery.page = 1;
                this.getList();
            },
            handleSizeChange (val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange (val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleUpdate (row) {
                this.form = deepClone(row);
                this.dialogFormVisible = true;
                this.dialogStatus = "update";
                this.dataScopeOne=this.dataScopeJsonList[this.form.columnName][this.form.operator];
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
            deletes (row) {
                this.$confirm("此操作将永久删除该数据权限-行项目(权限名:" + row.columnName + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDataScopeItem(row.id).then((response) => {
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
            create (formName) {
                const set = this.$refs;

                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        addDataScopeItem(
                            this.form.dataScopeId,
                            this.form.columnName,
                            this.form.operator,
                            this.form.dataScope
                        ).then((response) => {
                            if(response.data.success){
                                this.getList();
                                this.$message.success({message:'创建成功'});
                            }else{
                                this.$message.error({message: response.data.message});
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            update (formName) {
                const set = this.$refs;
                console.log(this.form)
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.form.dataScope=this.form.dataScope.replace(/%/g,'%25');
                        putDataScopeItem(
                            this.form.id,
                            this.form.dataScopeId,
                            this.form.columnName,
                            this.form.operator,
                            this.form.dataScope
                        ).then((response) => {
                            if(response.data.success){
                                this.getList();
                                this.$message.success({message:'修改成功'});
                            }else{
                                this.$message.error({message: response.data.message});
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            resetTemp () {
                this.form = {
                    dataScopeId:this.paramsid,
                    columnName:undefined,
                    operator:undefined,
                    dataScope:undefined,
                    id:null
                };
                this.dataScopeOne=null;
            },
            validateColumnName (){
                this.form.operator=undefined;
                this.dataScopeOne=undefined;
            },
            validateOperator () {
                this.dataScopeOne=this.dataScopeJsonList[this.form.columnName][this.form.operator];
            },
            getEntryList () {
                getDataScopeJson().then(response => {
                    if(response.data.success){
                        this.dataScopeJsonList=response.data.data[this.$route.query.entry];
                        this.columnNameList=this.dataDeal(this.dataScopeJsonList);
                    }else{
                        this.$message.error({message: response.data.message});
                    }
                });
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
            dataDeal (data) {
                let arr=[];
                if(data){
                    for(let item in data){
                        arr.push(item);
                    }
                }
                return arr;
            },
            changedataScopeId () {
                this.dialogVisible=true;
                //this.transmitform.data=this.list;
            },
            createfun (data) {
                this.form.dataScopeId=data.id;
                this.dialogVisible=false;
            },
            changeFun (row) {
                if(this.msg){
                    if(this.preventFun(row,this.msg.data)){
                        this.$message.warning("这个不能选择");
                        return;
                    }
                    this.$emit('deliverMsg',row);
                }else{
                    //this.$router.push({ path:'/permission/dataSchema/info/'+row.id,query:{name:row.name}});
                }

            },
            rowCla ({row, rowIndex}) {
                return '';  //rowCla
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
                this.rowCla=(({row, rowIndex})=>{
                    if(to && to.length){
                        for(let i=0;i<to.length;i++){
                            if(row.id===to[i].id){
                                return 'error-row';
                            }
                        }
                    }
                    return '';
                });
                this.$refs.singleTable.setCurrentRow();
            }
        },
        watch : {
            'msg' (to) {
                this.parentFun(to.data)
            },
            'paramsid' (to) {
                this.listQuery.dataScopeId=to;
                this.getList();
                this.getEntryList();
            },
            'form.columnName' (to) {
                this.operatorList=this.dataDeal(this.dataScopeJsonList[to]);
            }
        }
    }
</script>

<style scoped>

</style>