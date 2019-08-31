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
          <el-col :span="8"
                  >
              <tree ref="domTree" :accordion="true" @node-click="getNodeData"/>
          </el-col>
          <el-col :span="16"
                  >
              <!--<el-card class="box-card">-->
              <el-tabs v-model="tabName" type="border-card" class="may_tabs">
                  <el-tab-pane label="组织机构信息" name="info">

                      <el-form :label-position="labelPosition"
                               label-width="80px"
                               :model="form"
                               :rules="rules"
                               ref="form">

                          <!--  <el-form-item v-if="" class="right_r">
                              <el-button type="primary" size="small" icon="el-icon-view"
                                         @click="getUser">用户</el-button>

                              <el-button type="primary" size="small" icon="el-icon-view"
                                         @click="getAuthority">权限</el-button>

                            </el-form-item>-->

                          <el-form-item label="父级节点"
                                        prop="parentId">
                              <el-input v-model="form.parentId"
                                        :disabled="true"
                                        placeholder="请输入父级节点"></el-input>
                          </el-form-item>
                          <el-form-item label="名称"
                                        prop="name">
                              <el-input v-model="form.name"
                                        :disabled="formEdit"
                                        placeholder="请输入名称"></el-input>
                          </el-form-item>
                          <el-form-item label="主管"
                                        prop="permission">
                              <el-input v-model="form.supervisorName"
                                        :disabled="formEdit"
                                        @focus="getUserList()"
                                        readonly
                                        placeholder="请输入主管名称"></el-input>
                              <el-input v-model="form.supervisorId"
                                        type="hidden"></el-input>
                          </el-form-item>

                          <el-form-item v-if="formStatus == 'update'">
                              <el-button type="primary"
                                         @click="update">更新</el-button>
                              <el-button @click="onCancel">取消</el-button>
                          </el-form-item>
                          <el-form-item v-if="formStatus == 'create'">
                              <el-button type="primary"
                                         @click="create">保存</el-button>
                              <el-button @click="onCancel">取消</el-button>
                          </el-form-item>
                      </el-form>

                  </el-tab-pane>
                  <el-tab-pane label="组织机构用户" :lazy="true" name="user" :disabled="!Boolean(currentId)">
                      <corporation-user ref="myUser"
                                        :data="currentId"
                                        @deliverMsgs="userCreates"></corporation-user>
                  </el-tab-pane>
                  <!--<el-tab-pane label="组织机构权限" :lazy="true" name="authority" :disabled="!Boolean(currentId)">
                   &lt;!&ndash; v-if="tabName=='authority'"&ndash;&gt;
                    <corporation-authority
                                           :data="currentId"></corporation-authority>
                  </el-tab-pane>-->
              </el-tabs>

              <!--</el-card>-->
          </el-col>
      </el-row>
      <el-dialog :title="'选择'+dialogDeptVisible.title"  class="my_dialog_scroll"
                 :visible.sync="dialogDeptVisible.status">
          <user :msg="transmitform"  @deliverMsg="userCreate"></user>

      </el-dialog>
  </d2-container>
</template>

<script>
    import {delCorporation,addCorporation,putCorporation} from "@/api/corporation";
    import util from "@/libs/util";
    import corporationUser from "./user";
    import tree from "./tree";
    import user from "@/views/home/user";

    export default {
        name: 'index',
        components: {
            tree,
            corporationUser,
            user
        },
        props: ['msg'],
        data() {
            return {
                list: null,
                total: null,
                formEdit: true,
                formAdd: true,
                formStatus: '',
                tabName:'info',
                showElement: false,
                listQuery: {
                    name: undefined
                },
                rules: {
                    name: [
                        {required: true,message: "请输入名称",trigger: "blur"},
                    ]
                },
                treeData: [],
                oExpandedKey: {
                    // key (from tree id) : expandedOrNot boolean
                },
                oTreeNodeChildren: {
                    // id1 : [children] (from tree node id1)
                    // id2 : [children] (from tree node id2)
                },
                aExpandedKeys: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                labelPosition: 'right',
                temporaryData:{
                    createAt: undefined,
                    name: undefined,
                    parentId: undefined,
                    parentIds: undefined,
                    supervisorId: undefined,
                    supervisorName: undefined,
                    updateAt: undefined,
                    id: undefined
                },
                form: {
                    createAt: undefined,
                    name: undefined,
                    parentId: undefined,
                    parentIds: undefined,
                    supervisorId: undefined,
                    supervisorName: undefined,
                    updateAt: undefined,
                    id: undefined
                },
                transmitform: {
                    createAt: undefined,
                    name: undefined,
                    parentId: undefined,
                    parentIds: undefined,
                    supervisorId: undefined,
                    supervisorName: undefined,
                    updateAt: undefined,
                    id: undefined
                },
                dialogDeptVisible:{
                    status:false,
                    title:'主管'
                },
                currentId: '',
                currentIds: '',
                authorityData:{show:false},
            }
        },
        created() {

        },

        methods: {
            getNodeData (data) {
                if (!this.formEdit) {
                    this.formStatus = 'update'
                }
                this.form=util.deepClone(data);
                this.temporaryData=data;
                this.currentId = this.form.id;
                this.currentIds = this.form.ids;
                this.showElement = true
            },
            handlerEdit () {
                if (this.currentId) {
                    this.formEdit = false;
                    this.tabName='info';
                    if(this.formStatus === 'create'){
                        this.form=util.deepClone(this.temporaryData);
                    }
                    this.formStatus = 'update';

                }else{
                    this.$message.error("请先选择组织机构");
                }
            },
            handlerAdd () {
                this.resetForm();
                this.formEdit = false;
                this.tabName='info';
                this.formStatus = 'create'
            },
            handleDelete () {
                if (this.form.id) {
                    this.formStatus = 'del';
                    this.$confirm('此操作将永久删除('+this.form.name+'), 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delCorporation(this.currentId).then((response) => {
                            if(response.success){
                                this.$refs.domTree.getList();
                                this.resetForm();
                                this.onCancel();
                                this.$message.success("删除成功");
                            }else{
                                this.$message.error({message: response.message});
                            }
                        })
                    }).catch (() => {
                    });
                }else{
                    this.$message.error("请先选择组织机构");
                }
            },
            update () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.form.parentIds=this.currentIds;
                        putCorporation(this.form).then((response) => {
                            if(response.success){
                                this.$refs.domTree.getList();
                                this.onCancel(1);
                                this.$message.success("更新成功");
                            }else{
                                this.$message.error({message: response.message});
                            }
                        })
                    }
                });
            },
            create () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.form.parentIds=this.currentIds;
                        addCorporation(util.deepClone(this.form)).then((response) => {
                            if(response.success){
                                this.$refs.domTree.getList();
                                this.onCancel();
                                this.$message.success("添加成功");
                            }else{
                                this.$message.error({message: response.message});
                            }
                        })
                    }
                });
            },
            convert (data) {
                return JSON.parse(JSON.stringify(data));
            },
            getUserList () {
                this.dialogDeptVisible={
                    status:true,
                    title:'主管'
                };
                this.transmitform=util.deepClone(this.form) ;
                this.transmitform.status=false;
            },
            userCreates (data) {
                this.transmitform={status:true,data:data};
                this.dialogDeptVisible={
                    status:true,
                    title:'用户'
                };
            },
            userCreate (e) {
                this.dialogDeptVisible.status=false;
                if(this.dialogDeptVisible.title==='主管'){
                    this.form.supervisorId=e.id;
                    this.form.supervisorName=e.username;
                }else{
                    this.$refs.myUser.add(e.id)
                }
            },
            onCancel (data) {
                this.formEdit = true;
                this.$refs['form'].clearValidate();
                if(this.formStatus==='update' && data ===1){
                    // this.$refs.treeCor.setCheckedNodes([this.form]);
                    this.temporaryData=util.deepClone(this.form)  ;
                }else if(this.formStatus==='del'){
                    this.currentId=null;
                    this.resetForm();
                    this.tabName='info';
                }else if(this.formStatus==='create' || this.formStatus==='update'){
                    this.form=util.deepClone(this.temporaryData);
                }
                this.formStatus = '';
            },
            resetForm () {
                this.form = {
                    createAt: undefined,
                    name: undefined,
                    parentId: this.currentId || undefined,
                    parentIds: undefined,
                    supervisorId: undefined,
                    supervisorName: undefined,
                    updateAt: undefined,
                    id: undefined
                }
            }
        }
    }
</script>
