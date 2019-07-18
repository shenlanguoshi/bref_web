<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container">
                <el-button-group>
                    <el-button type="primary"
                               v-if="menuManager_btn_add"
                               icon="plus"
                               @click="handlerAdd">添加
                    </el-button>
                    <el-button type="primary"
                               v-if="menuManager_btn_edit"
                               icon="edit"
                               @click="handlerEdit">编辑
                    </el-button>
                    <el-button type="primary"
                               v-if="menuManager_btn_del"
                               icon="delete"
                               @click="handleDelete">删除
                    </el-button>
                </el-button-group>
            </div>

            <el-row>
                <el-col :span="8"
                        style='margin-top:15px;'>
                    <tree ref="domTree" :accordion="true" @node-click="getNodeData"></tree>
                </el-col>
                <el-col :span="16"
                        style='margin-top:15px;'>
                    <el-card class="box-card">
                        <el-form :label-position="labelPosition"
                                 label-width="120px"
                                 :model="form"
                                 :rules="rules"
                                 ref="form">
                            <el-form-item label="父级节点">
                                <el-input v-model="form.parentId"
                                          clearable
                                          :disabled="formEdit || formStatus!='create'"
                                          @focus="changeParent"
                                          readonly
                                          placeholder="请输入父级节点"></el-input>
                            </el-form-item>
                            <el-form-item label="行业分类"
                                          prop="name">
                                <el-input v-model="form.name"
                                          :disabled="formEdit"
                                          placeholder="请输入行业分类"></el-input>
                            </el-form-item>
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
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog title="选择"
                       :visible.sync="dialogDeptVisible">
                <tree v-if="dialogDeptVisible" @node-click="getParentId"></tree>
            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
    import {deepClone} from "@/util/util";
    import tree from "./tree";
    import {addIndustryCategory,putIndustryCategory,delIndustryCategory} from "@/api/industryCategory";
    export default {
        name: "index",
        components: {
            tree,
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
                listQuery: {
                    name: undefined
                },
                labelPosition: 'right',
                temporaryData:{
                    name:undefined,
                    parentId:undefined,
                    ids:undefined,
                    id:undefined,
                    parentIds:undefined,
                },
                form: {
                    name:undefined,
                    parentId:undefined,
                    ids:undefined,
                    id:undefined,
                    parentIds:undefined,
                },
                rules: {
                    name: [
                        {required: true,message: "请输入行业分类", trigger: "blur"},
                    ]
                },
                currentId: undefined,
                currentIds: undefined,
                menuManager_btn_add: false,
                menuManager_btn_edit: false,
                menuManager_btn_del: false
            }
        },
        created() {
            this.getList();
            this.menuManager_btn_add =true;// this.permissions['sys_menu_add']
            this.menuManager_btn_edit =true;// this.permissions['sys_menu_edit']
            this.menuManager_btn_del =true;// this.permissions['sys_menu_del']
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
                let data=deepClone(row);
                this.form =data;
                this.temporaryData=row;
                this.currentId = data.id;
                this.currentIds = data.ids;
                this.showElement = true
            },
            handlerEdit() {
                if (this.currentId) {
                    this.formEdit = false;
                    if(this.formStatus === 'create'){
                        this.form=deepClone(this.temporaryData);
                    }
                    this.formStatus = 'update'
                }else{
                    this.$message.error("请先选择一个节点");
                }
            },
            handlerAdd() {
                this.resetForm();
                this.formEdit = false;
                this.formStatus = 'create'
            },
            handleDelete() {
                if (this.form.id) {
                    this.formStatus = 'del';
                    this.$confirm('此操作将永久删除('+this.form.name+'), 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delIndustryCategory(this.currentId).then((response) => {
                            if(response.data.success){
                                this.$refs.domTree.getList();
                                this.resetForm();
                                this.onCancel();
                                this.$message.success("删除成功");
                            }else{
                                this.$message.error({message: response.data.message});
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
                        putIndustryCategory(
                            this.form.id,
                            this.form.name,
                            this.form.parentId
                        ).then((response) => {
                            if(response.data.success){
                                this.$refs.domTree.getList();
                                this.onCancel(1);
                                this.$message.success("更新成功");
                            }else{
                                this.$message.error({message: response.data.message});
                            }
                        })
                    }
                })
            },
            create() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        addIndustryCategory(
                            this.form.name,
                            this.form.parentId,
                            this.form.ids
                        ).then((response) => {
                            if(response.data.success){
                                this.$refs.domTree.getList();
                                this.onCancel();
                                this.$message.success("创建成功");
                            }else{
                                this.$message.error({message: response.data.message});
                            }
                        })
                    }
                })
            },
            changeParent () {
                this.dialogDeptVisible=true;
            },
            getParentId (data) {
                this.form.parentId=data.id;
                this.form.ids=data.ids;
                this.dialogDeptVisible=false;
            },
            onCancel(data) {
                this.formEdit = true;
                this.$refs['form'].clearValidate();
                if(this.formStatus==='update' && data ===1){
                    // this.$refs.treeCor.setCheckedNodes([this.form]);
                    this.temporaryData=deepClone(this.form)  ;
                }else if(this.formStatus==='del'){
                    this.currentId=null;
                    this.resetForm();
                }else if(this.formStatus==='create' || this.formStatus==='update'){
                    this.form=deepClone(this.temporaryData);
                }
                this.formStatus = '';
            },
            resetForm() {
                this.form = {
                    name:undefined,
                    parentId:this.currentId || undefined,
                    ids:this.currentIds || undefined,
                    id:undefined,
                    parentIds:undefined
                }
            }
        }
    }
</script>

<style scoped>

</style>