<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container">
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="模块名">
                        <el-input @keyup.enter.native="handleFilter"
                                  size="small"
                                  clearable
                                  placeholder="模块名"
                                  v-model="listQuery.title">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select size="small"
                                    v-model="listQuery.menu"
                                    clearable placeholder="请选择">
                            <el-option v-for="item in options"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                                   size="small"
                                   v-waves
                                   icon="el-icon-search"
                                   @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-button
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
                                 label="模块名">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="模块链接地址">
                    <template slot-scope="scope">
                        <span>{{scope.row.uri}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="前端组件地址">
                    <template slot-scope="scope">
                        <span>{{scope.row.controls}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="模块图标">
                    <template slot-scope="scope">
                        <span>{{scope.row.icon}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="模块排序">
                    <template slot-scope="scope">
                        <span>{{scope.row.sort}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="是否为菜单">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.menu?'info':'danger'">{{scope.row.menu | statusFilter}}</el-tag>
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
                <el-form-item label="模块父节点id">
                    <el-input v-model="form.parentId"
                              @focus="showmoduleTree"
                              readonly
                              placeholder="请选择模块父节点id"></el-input>
                </el-form-item>
                <el-form-item label="模块名称"
                              prop="title">
                    <el-input v-model="form.title"
                              placeholder="请输入模块名称"></el-input>
                </el-form-item>
                <el-form-item label="模块连接地址">
                    <el-input v-model="form.uri"
                              placeholder="请输入模块连接地址"></el-input>
                </el-form-item>
                <el-form-item label="前端组件地址">
                    <el-input v-model="form.controls"
                              placeholder="请输入前端组件地址"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model="form.icon"
                              placeholder="请输入图标">
                        <i slot="prefix"  @click="getIconList" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.sort"
                                     controls-position="right"
                                     @change=""></el-input-number>
                </el-form-item>
                <el-form-item label="是否为菜单"
                              prop="menu">
                    <el-select v-model="form.menu" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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

        <el-dialog title="选择"
                    :visible.sync="dialogDeptVisible">
            <module-tree v-if="dialogFormVisible" v-show="!isIcon" :disabled="chId" @node-click="getParentId"></module-tree>
            <icon v-show="isIcon" @change-click="changeIcon"></icon>
        </el-dialog>
    </div>
</template>

<script>
    import moduleTree from "./moduleTree";
    import icon from "./icon";
    import {getModulen,putModulen,addModulen,delModulen} from "@/api/module";
    import waves from "@/directive/waves/index"; // 水波纹指令
    import {deepClone} from "@/util/util";
    export default {
        name: "module",
        props: [],
        directives: {
            waves
        },
        components: {
            icon,
            moduleTree
        },
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    pageNo: 1,
                    pageSize: 10,
                    title:undefined,
                    parentId:undefined,
                    uri:undefined,
                    icon:undefined,
                    sort:undefined,
                    menu:undefined,
                    controls:undefined
                },
                chId:null,
                options: [{
                    value: true,
                    label: '菜单'
                }, {
                    value: false,
                    label: '按钮'
                }],
                form: {
                    title:undefined,
                    parentId:undefined,
                    uri:undefined,
                    icon:undefined,
                    sort:undefined,
                    menu:undefined,
                    controls:undefined
                },
                rules: {
                    title: [
                        {required: true,message: "请输入模块名称", trigger: "blur"},
                    ],
                    menu: [
                        {required: true,message: "请选择是否为菜单", trigger: "blur"},
                    ],
                },
                dialogFormVisible: false,
                dialogDeptVisible: false,
                isIcon:false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                isDisabled: {
                    0: false,
                    1: true
                },
                tableKey: 0
            }
        },
        filters: {
            statusFilter (status) {
                const statusMap = {
                    true: "菜单",
                    false: "按钮",
                };
                return statusMap[status];
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList () {
                this.listLoading = true;
                //this.listQuery.isAsc = false;
                getModulen(this.listQuery).then(response => {
                    if(response.data.success){
                        this.list = response.data.data.list;
                        this.total = response.data.data.total;
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
                let data=deepClone(row);
                this.form =data;
                this.chId=this.form.id;
                this.dialogFormVisible = true;
                this.dialogStatus = "update";
            },
            handleCreate () {
                this.resetTemp();
                this.chId=null;
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            cancel (formName) {
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            deletes (row) {
                this.$confirm("此操作将永久删除该模块(模块名:" + row.title + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delModulen(row.id).then((response) => {
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
                        addModulen(
                            this.form.title,
                            this.form.parentId,
                            this.form.uri,
                            this.form.icon,
                            this.form.sort,
                            this.form.menu,
                            this.form.controls
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
                        putModulen(
                            this.form.id,
                            this.form.title,
                            this.form.parentId,
                            this.form.uri,
                            this.form.icon,
                            this.form.sort,
                            this.form.menu,
                            this.form.controls
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
            showmoduleTree () {
                this.dialogDeptVisible=true;
                this.isIcon=false;
            },
            getParentId (data) {
                this.dialogDeptVisible=false;
                this.form.parentId=data.id;
            },
            getIconList () {
                this.isIcon=true;
                this.dialogDeptVisible=true;
            },
            changeIcon (data) {
                this.form.icon=data;
                this.dialogDeptVisible=false;
            },
            resetTemp () {
                this.form = {
                    title:undefined,
                    parentId:undefined,
                    uri:undefined,
                    icon:undefined,
                    sort:undefined,
                    menu:undefined,
                    controls:undefined
                };
            },
            changeFun (row) {
               /* if(this.msg){
                    if(this.preventFun(row,this.msg.data)){
                        this.$message.warning("这个不能选择");
                        return;
                    }
                    this.$emit('deliverMsg',row);
                }else{
                    this.$router.push({ path:'/permission/info/'+row.id,query:{name:row.name}});
                }*/

            },
            rowCla ({row, rowIndex}) {
                return 'rowCla';
            },
        }
    }
</script>

<style scoped>

</style>