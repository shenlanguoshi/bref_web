<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter"
                  style="width: 200px;"
                  class="filter-item"
                  size="small"
                  clearable
                  placeholder="用户名"
                  v-model="listQuery.username">
        </el-input>
        <el-button class="filter-item"
                   type="primary"
                   size="small"
                   v-waves
                   icon="el-icon-search"
                   @click="handleFilter">搜索</el-button>
        <el-button v-if="sys_user_add && !msg"
                   class="filter-item"
                   size="small"
                   style="margin-left: 10px;"
                   @click="handleCreate"
                   type="primary"
                   icon="el-icon-plus">添加</el-button>
      </div>

      <el-table :key='tableKey'
                :data="list"
                ref="singleTable"
                @row-click="infoMsg"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                border
                fit
                highlight-current-row
                :row-class-name="rowCla"
                style="width: 99%">

        <el-table-column align="center"
                         type="index"
                         width="50"
                         label="序号">
          <template scope="scope">
            <span>{{scope.$index+(listQuery.page - 1) * listQuery.limit + 1}} </span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="用户名">
          <template slot-scope="scope">
                        <span>
                         <!-- <img v-if="scope.row.avatar"
                               class="user-avatar"
                               style="width: 20px; height: 20px; border-radius: 50%;"
                               :src="scope.row.avatar+'?imageView2/1/w/20/h/20'">-->
                          {{scope.row.username}}
                        </span>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center"
                          label="所属部门"
                          show-overflow-tooltip>
           <template slot-scope="scope">
             <span>{{scope.row.deptName}} </span>
           </template>
         </el-table-column>-->

        <!--<el-table-column align="center"
                         label="角色">
          <template slot-scope="scope">
            <span v-for="role in scope.row.roleList">{{role.roleDesc}} </span>
          </template>
        </el-table-column>-->

        <el-table-column align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         class-name="status-col"
                         label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.enabled?'success':'danger'">{{scope.row.enabled | statusFilter}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="操作"
                         v-if="!msg"
                         width="200">
          <template slot-scope="scope">
            <el-button v-if="sys_user_edit"
                       size="mini"
                       type="success"
                       icon="el-icon-edit"
                       @click.stop="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button v-if="sys_user_del"
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
                       :current-page.sync="listQuery.page"
                       :page-sizes="[10,20,30, 50]"
                       :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </basic-container>
  <!--  <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree"
               :data="treeDeptData"
               :default-checked-keys="checkedKeys"
               check-strictly
               node-key="id"
               highlight-current
               ref="deptTree"
               :props="defaultProps"
               @node-click="getNodeData"
               default-expand-all>
      </el-tree>
    </el-dialog>-->

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="100px">
        <el-form-item v-if="dialogStatus == 'create'"
                      label="用户名"
                      prop="username">
          <el-input v-model="form.username"
                    placeholder="请输用户名"></el-input>
        </el-form-item>

        <el-form-item
                label="密码"
                prop="newpassword1">
          <el-input type="password"
                    placeholder="请输入密码"
                    v-model="form.newpassword1"></el-input>
        </el-form-item>
          <el-form-item label="组织机构"
                        v-if="dialogStatus == 'create'"
                        prop="corporationName">
              <el-input v-model="form.corporationName"
                        placeholder="请选择组织机构"
                        @focus="handleDept('corporation')"
                        readonly></el-input>
          </el-form-item>
          <el-form-item label="岗位"
                        v-if="dialogStatus == 'create'"
                        prop="corporationWorkName">
              <el-input v-model="form.corporationWorkName"
                        placeholder="请选择岗位"
                        @focus="handleDept('corporationWork')"
                        readonly></el-input>
          </el-form-item>
        <!-- <el-form-item label="所属部门"
                       prop="deptName">
           <el-input v-model="form.deptName"
                     placeholder="选择部门"
                     @focus="handleDept()"
                     readonly></el-input>
           <input type="hidden"
                  v-model="form.deptId" />
         </el-form-item>-->

        <!--<el-form-item label="角色"
                      prop="role">
          <el-select class="filter-item"
                     v-model="role"
                     placeholder="请选择"
                     multiple>
            <el-option v-for="item in rolesOptions"
                       :key="item.roleId"
                       :label="item.roleDesc"
                       :value="item.roleId"
                       :disabled="isDisabled[item.delFlag]">
              <span style="float: left">{{ item.roleDesc }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>-->

        <!-- <el-form-item label="状态"
                       v-if="dialogStatus == 'update' && sys_user_del "
                       prop="delFlag">
           <el-select class="filter-item"
                      v-model="form.delFlag"
                      placeholder="请选择">
             <el-option v-for="item in statusOptions"
                        :key="item"
                        :label="item | statusFilter"
                        :value="item"> </el-option>
           </el-select>
         </el-form-item>-->
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
      <el-dialog :title="'选择'+textMaps[dialogStatuss]"
                 :visible.sync="dialogDeptVisible">
          <tree v-show="dialogStatuss==='corporation'" @node-click="optTree"></tree>
          <corporation-work v-show="dialogStatuss==='corporationWork'" :msg="{status:true}" @deliverMsg="optTree"></corporation-work>
      </el-dialog>
  </div>
</template>
<script>
    import { fetchList, registerUser,getObj, addObj, putObj, delObj } from "@/api/user";
   /* import { deptRoleList, fetchDeptTree } from "@/api/role";*/
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    // import { parseTime } from '@/utils'
    import { mapGetters } from "vuex";
  /*  import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
    import ElOption from "element-ui/packages/select/src/option";*/
    import tree from "@/views/admin/corporation/tree";
    import corporationWork from "@/views/admin/corporationWork/index";
    export default {
        name: "user",
        components: {
            tree,
            corporationWork
        },
        props: ['msg'],
        directives: {
            waves
        },
        data () {
            return {
                treeDeptData: [],
                checkedKeys: [],
                defaultProps: {
                    children: "children",
                    label: "name"
                },
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10
                },
                role: [],
                form: {
                    username: undefined,
                    newpassword1: undefined,
                    delFlag: undefined,
                    deptId: undefined,
                    corporationId: null,
                    corporationName: undefined,
                    corporationWorkId: undefined,
                    corporationWorkName: undefined,
                },
                rules: {
                    username: [
                        {required: true,message: "请输入账户", trigger: "blur"},
                        {min: 6,max: 20, message: "长度在 6 到 20 个字符",trigger: "blur"}
                    ],
                    newpassword1: [
                        {required: true,message: "请输入密码",trigger: "blur"},
                        {min: 6,max: 20,message: "长度在 6 到 20 个字符",trigger: "blur"}
                    ],
                    corporationName: [
                        {required: true,message: "请选择组织机构",trigger: "change"},
                    ],
                    corporationWorkName: [
                        {required: true,message: "请选择岗位",trigger: "change"},
                    ],
                    deptId: [
                        {required: true,message: "请选择部门",trigger: "blur"}
                    ],
                    role: [
                        {required: true,message: "请选择角色", trigger: "blur"}
                    ]
                },
                statusOptions: ["0", "1"],
                rolesOptions: [],
                dialogFormVisible: false,
                dialogDeptVisible: false,
                userAdd: false,
                userUpd: false,
                userDel: false,
                dialogStatus: "",
                dialogStatuss: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                textMaps: {
                    corporation: "组织机构",
                    corporationWork: "岗位"
                },
                isDisabled: {
                    0: false,
                    1: true
                },
                tableKey: 0
            };
        },
        computed: {
            ...mapGetters(["permissions"])
        },
        filters: {
            statusFilter (status) {
                const statusMap = {
                    true: "有效",
                    false: "无效",
                    9: "锁定"
                };
                return statusMap[status];
            }
        },
        created () {
            this.getList();
            this.sys_user_add =true; this.permissions["sys_user_add"];
            this.sys_user_edit =true; //this.permissions["sys_user_edit"];
            this.sys_user_del =true; //this.permissions["sys_user_del"];
        },
        methods: {
            getList () {
                this.listLoading = true;
                this.listQuery.isAsc = false;
                fetchList(this.listQuery).then(response => {
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
            /*getNodeData (data) {
                this.dialogDeptVisible = false;
                this.form.deptId = data.id;
                this.form.deptName = data.name;
                deptRoleList(data.id).then(response => {
                    this.rolesOptions = response.data;
                });
            },*/
            /*handleDept () {
                fetchDeptTree().then(response => {
                    this.treeDeptData = response.data;
                    this.dialogDeptVisible = true;
                });
            },*/
            handleFilter () {
                this.listQuery.page = 1;
                this.getList();
            },
            handleSizeChange (val) {
                this.listQuery.limit = val;
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
            handleUpdate (row) {
                getObj(row.id).then(response => {
                    this.form = response.data.data;
                    this.dialogFormVisible = true;
                    this.dialogStatus = "update";
                    /* this.role = [];   //权限
                     for (var i = 0; i < row.roleList.length; i++) {
                       this.role[i] = row.roleList[i].roleId;
                     }
                     deptRoleList(response.data.deptId).then(response => {
                       this.rolesOptions = response.data;
                     });*/
                });
            },
            create (formName) {
                const set = this.$refs;
                this.form.role = this.role;
                set[formName].validate(valid => {
                    if (valid) {
                        registerUser({
                            userInfo:JSON.stringify({
                                username: this.form.username,
                                password:this.form.newpassword1,
                                corporationId:this.form.corporationId,
                                corporationWorkId:this.form.corporationWorkId
                            })
                        }).then((response) => {
                            this.dialogFormVisible = false;
                            if(response.data.success){
                                this.getList();
                                this.$notify({
                                    title: "成功",
                                    message: "创建成功",
                                    type: "success",
                                    duration: 2000
                                });
                            }else{
                                this.$message.error({message: response.data.message});
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancel (formName) {
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            update (formName) {
                const set = this.$refs;
                this.form.role = this.role;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.form.password = undefined;
                        putObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({
                                title: "成功",
                                message: "修改成功",
                                type: "success",
                                duration: 2000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            deletes (row) {
                this.$confirm(
                    "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    delObj(row.id)
                        .then(() => {
                            this.getList();
                            this.$message.success("删除成功");
                        }).catch(() => {
                        this.$notify({
                            title: "失败",
                            message: "删除失败",
                            type: "error",
                            duration: 2000
                        });
                    });
                }).catch (() => {
                });
            },
            handleDept (data) {
                this.dialogStatuss=data;
                this.dialogDeptVisible = true;
            },
            optTree (data) {
                this.form[this.dialogStatuss+'Id']=data.id;
                this.form[this.dialogStatuss+'Name']=data.name;
                this.dialogDeptVisible = false;
            },
            resetTemp () {
                this.form = {
                    id: undefined,
                    username: "",
                    password: "",
                    role: [],
                    delFlag: "",
                    deptId: "",
                    corporationId: null,
                    corporationName: undefined,
                    corporationWorkId: undefined,
                    corporationWorkName: undefined,
                };
            },
            infoMsg (row, event, column) {
               /* this.$store.commit('ADD_TAG',{
                    label: row.username,
                    value: '/user/info/'+row.id
                });*/

               if(this.msg){
                   if(this.msg.status && this.preventFun(row,this.msg.data)){
                       this.$message.warning("这个不能选择");
                       return;
                   }
                   this.$emit('deliverMsg',row);
               }else{
                   this.$router.push({ path:'/user/info/'+row.id,query:{name:row.username}});
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
                }else{
                    this.rowCla=(({row, rowIndex})=>{
                        return 'rowCla';
                    });
                    let j=-1;
                    for(let i=0;i<this.list.length;i++){
                        if(this.list[i].id===to.supervisorId){
                            j=i;
                            break;
                        }
                    }
                    this.$refs.singleTable.setCurrentRow(this.list[j])
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
<style lang="scss">

</style>