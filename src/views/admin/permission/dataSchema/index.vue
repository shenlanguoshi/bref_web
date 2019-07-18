<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container">
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="名称">
                        <el-input @keyup.enter.native="handleFilter"
                                  style="width: 200px;"
                                  class="filter-item"
                                  size="small"
                                  clearable
                                  placeholder="数据权限-列名称"
                                  v-model="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item label="标识">
                        <el-input @keyup.enter.native="handleFilter"
                                  style="width: 200px;"
                                  class="filter-item"
                                  size="small"
                                  clearable
                                  placeholder="标识"
                                  v-model="listQuery.entry"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                                   size="small"
                                   v-waves
                                   icon="el-icon-search"
                                   @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
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
                                 label="数据权限-行名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="数据权限标识">
                    <template slot-scope="scope">
                        <span>{{scope.row.entry}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="列域">
                    <template slot-scope="scope">
                        <span>{{scope.row.dataSchema}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="优先级">
                    <template slot-scope="scope">
                        <span>{{scope.row.priority}} </span>
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
                     label-width="100px">
                <el-form-item label="名称"
                              prop="name">
                    <el-input v-model="form.name"
                              placeholder="请输名称"></el-input>
                </el-form-item>
                <el-form-item label="标识"
                              prop="entry">
                    <el-input v-model="form.entry"
                              placeholder="请输标识"></el-input>
                </el-form-item>
                <el-form-item label="	列域"
                              prop="entry">
                    <el-input v-model="form.dataSchema"
                              type="textarea"
                              placeholder="请输	列域"></el-input>
                </el-form-item>
                <el-form-item label="优先级"
                              prop="priority">
                    <el-input-number v-model="form.priority"
                                     controls-position="right"
                                     placeholder="请输优先级"></el-input-number>
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
    </div>
</template>

<script>
    import {getDataSchema,putDataSchema,addDataSchema,delDataSchema} from "@/api/dataSchema";
    import waves from "@/directive/waves/index"; // 水波纹指令
    import {deepClone} from "@/util/util";
    export default {
        name: "index",  //数据权限-列列表
        props: ['msg'],
        directives: {
            waves
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
                    name:undefined
                },
                form: {
                    entry:undefined,
                    priority:undefined,
                    name:undefined,
                    dataSchema:undefined,
                    id:null
                },
                rules: {
                    name: [
                        {required: true,message: "请输入名称", trigger: "blur"},
                        {max:20, message: '最大长度20', trigger: 'blur' }
                    ],
                    entry: [
                        {required: true,message: "请输入标识", trigger: "blur"},
                        { min: 1,max:20, message: '最大长度20', trigger: 'blur' }
                    ],
                    priority: [
                        {required: true,message: "请输入优先级", trigger: "change"},
                    ]
                },
                dialogFormVisible: false,
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
        },
        methods: {
            getList () {
                this.listLoading = true;
                //this.listQuery.isAsc = false;
                getDataSchema(this.listQuery).then(response => {
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
                this.$confirm("此操作将永久删除该数据权限-列(权限名:" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDataSchema(row.id).then((response) => {
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
                        addDataSchema(
                            this.form.entry,
                            this.form.priority,
                            this.form.name,
                            this.form.dataSchema
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
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        putDataSchema(
                            this.form.id,
                            this.form.entry,
                            this.form.priority,
                            this.form.name,
                            this.form.dataSchema
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
                    entry:undefined,
                    priority:undefined,
                    name:undefined,
                    id:null
                };
            },
            changeFun (row) {
                if(this.msg){
                    if(this.preventFun(row,this.msg.data)){
                        this.$message.warning("这个不能选择");
                        return;
                    }
                    this.$emit('deliverMsg',row);
                }else{
                    this.$router.push({ path:'/permission/dataSchema/info/'+row.id,query:{name:row.name}});
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
                this.rowCla=(({row, rowIndex})=>{
                    if(to && to.length){
                        for(let i=0;i<to.length;i++){
                            if(row.id===to[i].id){
                                return 'error-row';
                            }
                        }
                    }
                    return 'rowCla';
                });
                this.$refs.singleTable.setCurrentRow();
            }
        },
        watch : {
            'msg' (to) {
                this.parentFun(to.data)
            }
        }
    }
</script>

<style scoped>

</style>