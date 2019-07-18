<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter"
                          style="width: 200px;"
                          class="filter-item"
                          size="small"
                          clearable
                          placeholder="职务名"
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
                                 label="职务名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}} </span>
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
                <el-form-item label="职务名称"
                              prop="name">
                    <el-input v-model="form.name"
                              placeholder="请输职务名称"></el-input>
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
    import {getJobPosition,addJobPosition,putJobPosition,delJobPosition} from "@/api/jobPosition";
    import {deepClone} from "@/util/util";
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    export default {
        name: "jobPosition",
        props: ['msg'],
        directives: {
            waves
        },
        data () {
            return {
                list: null,
                listLoading: true,
                total: null,
                listQuery: {
                    pageNo: 1,
                    pageSize: 10,
                    name:''
                },
                form: {
                    id:null,
                    name: undefined,
                },
                rules: {
                    name: [
                        {required: true,message: "岗位名称", trigger: "blur"}
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
        created () {
            this.getList();
        },
        methods: {
            getList () {
                this.listLoading = true;
               getJobPosition(this.listQuery).then(response => {
                    if(response.data.success){
                        this.list = response.data.data.list;
                        this.total = response.data.data.total;
                        if(this.msg){       //父组件调用
                            this.parentFun(this.msg)
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
            handleCreate () {
                this.resetTemp();
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            resetTemp () {
                this.form = {
                    id:null,
                    name: undefined,
                };
            },
            handleUpdate (row) {
                this.form = deepClone(row);
                this.dialogFormVisible = true;
                this.dialogStatus = "update";
            },
            deletes (row) {
                this.$confirm("此操作将永久删除该职务(职务名:" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delJobPosition(row.id).then((response) => {
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
            cancel (formName) {
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            create (formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        addJobPosition({
                            name:this.form.name
                        }).then((response) => {
                            this.dialogFormVisible = false;
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
                        putJobPosition(this.form).then((response) => {
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
            changeFun (row) {
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
        },
        watch : {
            'msg' (to) {
                this.parentFun(to)
            }
        }
    }
</script>

<style scoped>

</style>