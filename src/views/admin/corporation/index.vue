<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-button-group>
          <el-button type="primary"
                     v-if="menuManager_btn_add"
                     icon="el-icon-plus"
                     @click="handlerAdd">添加</el-button>
          <el-button type="primary"
                     v-if="menuManager_btn_edit"
                     icon="el-icon-edit"
                     @click="handlerEdit">编辑</el-button>
          <el-button type="primary"
                     v-if="menuManager_btn_del"
                     icon="el-icon-delete"
                     @click="handleDelete">删除</el-button>
        </el-button-group>
      </div>

      <el-row>
        <el-col :span="8"
                style='margin-top:15px;'>
          <el-tree class="filter-tree"
                   node-key="id"
                   highlight-current
                   default-expand-all
                   draggable
                   :expand-on-click-node="false"
                   :data="treeData"
                   :default-expanded-keys="aExpandedKeys"
                   :filter-node-method="filterNode"
                   :props="defaultProps"
                   @node-click="getNodeData"
                   @node-expand="nodeExpand"
                   @node-collapse="nodeCollapse">
          </el-tree>
        </el-col>
        <el-col :span="16"
                style='margin-top:15px;'>
          <el-card class="box-card">
            <el-tabs v-model="tabName">
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

          </el-card>
        </el-col>
      </el-row>
    </basic-container>
    <el-dialog :title="'选择'+dialogDeptVisible.title"
               :visible.sync="dialogDeptVisible.status">
      <user :msg="transmitform"  @deliverMsg="userCreate"></user>

    </el-dialog>

  </div>
</template>

<script>
import {getCorporation,delCorporation,addCorporation,putCorporation} from "@/api/corporation";
import {deepClone} from "@/util/util";
import corporationAuthority from "./authority";
import corporationUser from "./user";
import user from "../user";
import { mapGetters } from 'vuex'

export default {
  name: 'corporation',
  components : {
      corporationAuthority,
      corporationUser,
      user
  },
  data () {
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
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false
    }
  },
  filters: {
    typeFilter (type) {
      const typeMap = {
        0: '菜单',
        1: '按钮'
      }
      return typeMap[type]
    }
  },
  created () {
    this.getList();
    this.menuManager_btn_add =true;// this.permissions['sys_menu_add']
    this.menuManager_btn_edit =true;// this.permissions['sys_menu_edit']
    this.menuManager_btn_del =true;// this.permissions['sys_menu_del']
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    getList () {
        getCorporation().then(response => {
            if(response.data.success){
                this.treeData=response.data.data;
            }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    nodeExpand (data) {
      let aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse (data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      });
      this.setExpandedKeys()
    },
    setExpandedKeys () {
      let oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (let sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey));
        }
      }
    },
    treeRecursion (aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          let oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },

    getNodeData (data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      this.form=deepClone(data);
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
            this.form=deepClone(this.temporaryData);
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
                    if(response.data.success){
                        this.getList();
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
            this.$message.error("请先选择组织机构");
        }
    },
    update () {
        this.$refs['form'].validate(valid => {
            if (valid) {
                this.form.parentIds=this.currentIds;
                putCorporation(this.form).then((response) => {
                    if(response.data.success){
                        this.getList();
                        this.onCancel(1);
                        this.$message.success("更新成功");
                    }else{
                        this.$message.error({message: response.data.message});
                    }
                })
            }
        });
    },
    create () {
        this.$refs['form'].validate(valid => {
            if (valid) {
                this.form.parentIds=this.currentIds;
                addCorporation(deepClone(this.form)).then((response) => {
                    if(response.data.success){
                        this.getList();
                        this.onCancel();
                        this.$message.success("添加成功");
                    }else{
                        this.$message.error({message: response.data.message});
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
      this.transmitform=deepClone(this.form) ;
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
          this.temporaryData=deepClone(this.form)  ;
      }else if(this.formStatus==='del'){
          this.currentId=null;
          this.resetForm();
          this.tabName='info';
      }else if(this.formStatus==='create' || this.formStatus==='update'){
          this.form=deepClone(this.temporaryData);
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
<style scoped lang="scss">

</style>