<template>
    <d2-container padding>
        <template slot="header">
            <div class="table_btns">
                <el-button type="success" class="btn_comm" plain @click="handlerAdd">添加</el-button>
                <el-button type="primary" class="btn_comm" plain @click="handlerEdit">编辑</el-button>
                <el-button type="danger" class="btn_comm" plain @click="handleDelete">删除</el-button>
            </div>
        </template>

        <el-row type="flex" style="height: 100%">
            <el-col :span="8">
                <module-tree ref="domTree" :accordion="true" @node-click="getNodeData"></module-tree>
            </el-col>
            <el-col :span="16">
                <!--<el-card class="box-card">-->
                    <el-tabs v-model="tabName" type="border-card" class="may_tabs">
                        <el-tab-pane label=" 模块信息" name="info" :lazy="true">
                            <el-form :label-position="labelPosition"
                                     label-width="80px"
                                     :model="form"
                                     style="max-width: 550px"
                                     :rules="rules"
                                     ref="form">
                                <el-form-item label="父级节点">
                                    <el-input v-model="form.parentId"
                                              :disabled="true"
                                              placeholder="请输入父级节点"></el-input>
                                </el-form-item>
                                <el-form-item label="标题"
                                              prop="title">
                                    <el-input v-model="form.title"
                                              :disabled="formEdit"
                                              placeholder="请输入标题"></el-input>
                                </el-form-item>
                                <el-form-item label="图标">
                                    <el-input v-model="form.icon"
                                              :disabled="formEdit"
                                              placeholder="请输入图标">
                                        <el-button  @click="getIconList" slot="append" icon="el-icon-search"></el-button>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="类型"
                                              prop="menu">
                                    <el-select class="filter-item"
                                               v-model="form.menu"
                                               :disabled="formEdit"
                                               placeholder="请输入节点类型">
                                        <el-option v-for="item in typeOptions"
                                                   :key="item.label"
                                                   :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="排序"
                                              prop="sort">
                                    <el-input-number
                                            controls-position="right"
                                            v-model="form.sort"
                                            :disabled="formEdit"
                                            placeholder="请输入排序"></el-input-number>
                                </el-form-item>
                                <el-form-item label="前端组件"
                                              prop="component">
                                    <el-autocomplete class="inline-input"
                                                     popper-class="my-autocomplete"
                                                     v-model="form.controls"
                                                     :disabled="formEdit"
                                                     :fetch-suggestions="querySearch"
                                                     placeholder="请输入前端组件地址">
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item['title'] }}</div>
                                            <p class="addr">{{ item['value'] }}</p>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                                <el-form-item label="前端地址"
                                              prop="component">
                                    <el-input v-model="form.uri"
                                              :disabled="formEdit"
                                              placeholder="请输入前端路由地址"></el-input>
                                </el-form-item>
                                <!--<el-form-item label="路由缓冲"
                                              prop="component">
                                    <el-switch v-model="form.keepAlive"
                                               :disabled="formEdit"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               :active-value='"1"'
                                               :inactive-value='"0"'>
                                    </el-switch>
                                </el-form-item>-->
                                <el-form-item v-if="formStatus == 'update'">
                                    <el-button type="primary"
                                               @click="update">更新
                                    </el-button>
                                    <el-button @click="onCancel">取消</el-button>
                                </el-form-item>
                                <el-form-item v-if="formStatus == 'create'">
                                    <el-button type="primary"
                                               @click="create">保存
                                    </el-button>
                                    <el-button @click="onCancel">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label=" 模块权限" name="permission" :lazy="true" :disabled="!Boolean(currentId)">
                            <module-permission :data="currentId"></module-permission>
                        </el-tab-pane>
                    </el-tabs>

                <!--</el-card>-->
            </el-col>
        </el-row>

        <el-dialog title="选择"
                   :visible.sync="dialogDeptVisible">
            <icon @change-click="changeIcon"></icon>
        </el-dialog>
    </d2-container>
</template>

<script>
    import modulePermission from "./permission";
    import icon from "./icon";
    import util from "@/libs/util";
    import url from "@/plugin/url";
    import moduleTree from "./moduleTree";
    import {getModulen,putModulen,addModulen,delModulen} from "@/api/module";

    export default {
        name: 'module',
        components: {
            icon,
            moduleTree,
            modulePermission
        },
        data() {
            return {
                list: null,
                total: null,
                formEdit: true,
                formAdd: true,
                formStatus: '',
                dialogDeptVisible: false,
                showElement: false,
                tabName: 'info',
                listQuery: {
                    name: undefined
                },
                typeOptions: [{
                    value: true,
                    label: '菜单'
                }, {
                    value: false,
                    label: '按钮'
                }],
                labelPosition: 'right',
                temporaryData:{
                    title:undefined,
                    parentId:undefined,
                    uri:undefined,
                    icon:undefined,
                    sort:undefined,
                    menu:true,
                    controls:undefined
                },
                form: {
                    title:undefined,
                    parentId:undefined,
                    uri:undefined,
                    icon:undefined,
                    sort:undefined,
                    menu:true,
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
                controlsList:url,
                currentId: undefined,
                menuManager_btn_add: false,
                menuManager_btn_edit: false,
                menuManager_btn_del: false
            }
        },
        filters: {
            typeFilter(type) {
                const typeMap = {
                    true: '菜单',
                    false: '按钮'
                };
                return typeMap[type]
            }
        },
        created() {
            //this.getlist()

        },

        methods: {
            getList() {
                /* fetchTree(this.listQuery).then(response => {
                     this.treeData = response.data.data
                 })*/
            },
            setExpandedKeys() {
                let oTemp = this.oExpandedKey
                this.aExpandedKeys = []
                for (let sKey in oTemp) {
                    if (oTemp[sKey]) {
                        this.aExpandedKeys.push(parseInt(sKey));
                    }
                }
            },
            treeRecursion(aChildren, fnCallback) {
                if (aChildren) {
                    for (let i = 0; i < aChildren.length; ++i) {
                        let oNode = aChildren[i]
                        fnCallback && fnCallback(oNode)
                        this.treeRecursion(oNode.children, fnCallback)
                    }
                }
            },

            getNodeData(row) {
                if (!this.formEdit) {
                    this.formStatus = 'update'
                }
                let data=util.deepClone(row);
                this.form =data;
                this.temporaryData=row;
                this.currentId = data.id;
                this.showElement = true
            },
            handlerEdit() {
                if (this.currentId) {
                    this.formEdit = false;
                    this.tabName='info';
                    if(this.formStatus === 'create'){
                        this.form=util.deepClone(this.temporaryData);
                    }
                    this.formStatus = 'update'
                }else{
                    this.$message.error("请先选择一个节点");
                }
            },
            getIconList () {
                this.dialogDeptVisible=true;
            },
            changeIcon (data) {
                this.form.icon=data;
                this.dialogDeptVisible=false;
            },
            handlerAdd() {
                this.resetForm();
                this.tabName='info';
                this.formEdit = false;
                this.formStatus = 'create'
            },
            querySearch (queryString, cb) {
                let restaurants = this.controlsList;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleDelete() {
                if (this.form.id) {
                    this.formStatus = 'del';
                    this.$confirm('此操作将永久删除('+this.form.title+'), 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delModulen(this.currentId).then((response) => {
                            if(response.success){
                                this.$refs.domTree.getList();
                                this.resetForm();
                                this.onCancel();
                                this.tabName='info';
                                this.$message.success("删除成功");
                            }else{
                                this.$message.error({message: response.message});
                            }
                        })
                    }).catch (() => {
                    });
                }else{
                    this.$message.error("请先选择一个节点");
                }
            },
            update() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
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
                            if(response.success){
                                this.$refs.domTree.getList();
                                this.onCancel(1);
                                this.$message.success("更新成功");
                            }else{
                                this.$message.error({message: response.message});
                            }
                        })
                    }
                })
            },
            create() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        addModulen(
                            this.form.title,
                            this.form.parentId,
                            this.form.uri,
                            this.form.icon,
                            this.form.sort,
                            this.form.menu,
                            this.form.controls
                        ).then((response) => {
                            if(response.success){
                                this.$refs.domTree.getList();
                                this.onCancel();
                                this.$message.success("创建成功");
                            }else{
                                this.$message.error({message: response.message});
                            }
                        })
                    }
                })
            },
            onCancel(data) {
                this.formEdit = true;
                this.$refs['form'].clearValidate();
                if(this.formStatus==='update' && data ===1){
                    // this.$refs.treeCor.setCheckedNodes([this.form]);
                    this.temporaryData=util.deepClone(this.form)  ;
                }else if(this.formStatus==='del'){
                    this.currentId=null;
                    this.resetForm();
                }else if(this.formStatus==='create' || this.formStatus==='update'){
                    this.form=util.deepClone(this.temporaryData);
                }
                this.formStatus = '';
            },
            resetForm() {
                this.form = {
                    title:undefined,
                    parentId:this.currentId || undefined,
                    uri:undefined,
                    icon:undefined,
                    sort:undefined,
                    menu:true,
                    controls:undefined
                }
            }
        }
    }
</script>
