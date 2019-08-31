<template>
  <d2-container >
    <template slot="header">
        <el-form inline :model="search" class="form_search" @keyup.enter.native="searchSubmit">
            <el-form-item label="用户账号">
                <el-input v-model="search.searchParam.username" :maxlength="50" placeholder="请输入用户账号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="btn_comm" @click="searchSubmit">搜索</el-button>
            </el-form-item>

        </el-form>
        <div class="table_btn" v-if="!msg">
            <el-button type="success" class="btn_comm" @click="handleAdd">新增</el-button>
        </div>
    </template>
      <el-table class="main_table"
                :data="list"
                ref="singleTable"
                stripe
                height="100%"
                style="width: 100%"
                @row-click="infoMsg">
          <nodata slot="empty"/>
          <el-table-column  type="index" label="ID" align="center" min-width="120"/>
          <el-table-column prop="username" label="用户账号" align="center" min-width="200"></el-table-column>
         <!-- <el-table-column label="密码" align="center" min-width="200">
              <template slot-scope="scope">
                  <el-button type="edits" class="el_text"
                             @click="topTableClick(scope.row)">重置</el-button>
              </template>
          </el-table-column>-->
         <!-- <el-table-column  label="用户组" align="center" min-width="160">
              <template slot-scope="scope">
                  <icontab color="#27C99B">{{showroles(scope.row.roles)}}</icontab>
              </template>
          </el-table-column>-->
          <el-table-column prop="createAt" label="创建日期" align="center" min-width="180"></el-table-column>
          <el-table-column align="center"
                           class-name="status-col"
                           label="状态">
              <template slot-scope="scope">
                  <icontab :color="statuschange(scope.row.enabled).color">{{statuschange(scope.row.enabled).text}}</icontab>
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="180" v-if="!msg">
              <template slot-scope="scope">
                  <el-button type="edit" class="el_text"
                             @click.stop="handleEdit(scope.row)">修改</el-button><!--v-has="'sys:user:update'"-->
                  <el-button type="del" class="el_text"
                             @click.stop="handleDelete(scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-dialog :show-close="false"
                 :title="`${formStatus}用户`"
                 :visible.sync="dialogVisible"
                 :close-on-click-modal="false"
                 width="560px"
                 @closed="handleClose('form')">
          <el-form label-width="110px"
                   class="form_view"
                   ref="form"
                   :model="form" :rules="rules" >
              <el-form-item label="用户账号"  prop="username">
                  <el-input v-model="form.username" :disabled="!!form.id" :maxlength="50" autocomplete="off" placeholder="请输入用户账号"></el-input>
              </el-form-item>

              <el-form-item label="用户密码" v-if="!form.id"  prop="password">
                  <el-input v-model="form.password" type="password" autocomplete="off" :maxlength="255" placeholder="请输入用户密码"></el-input>
              </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
                <el-button class="btn_comm" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" class="btn_comm"  :loading="$store.state.loading" @click="upsubmit('form')">确 定</el-button>
            </span>
      </el-dialog>
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
    import icontab from "@/components/icontab"
    import { fetchList, registerUser,getObj, addObj, putObj, delObj } from "@/api/user";

    export default {
        name: 'index',
        components: {
            icontab,
        },
        props: ['msg'],
        data() {
            return {
                search:{
                    pageNo:1,
                    pageSize:10,
                    searchParam:{
                        username:'',
                    }
                },
                total:0,
                list: [],
                roleList:[],
                corporationList:[],
                show: true,  // 初始启用按钮
                count: '',   // 初始化次数
                dialogFormDelVisible: false,
                dialogVisible: false,
                formStatus:"编辑",
                form: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [
                        {required: true,message: "请输入账户", trigger: "blur"},
                        {min: 6,max: 20, message: "长度在 6 到 20 个字符",trigger: "blur"}
                    ],
                    password: [
                        {required: true,message: "请输入密码",trigger: "blur"},
                        {min: 6,max: 20,message: "长度在 6 到 20 个字符",trigger: "blur"}
                    ],
                },
            }
        },
        created() {
            this.getlist();
            //console.log(this.$route)
        },

        watch : {
            'msg' (to) {
                this.parentFun(to)
            }
        },
        methods: {
            getlist(){
                fetchList(this.search).then(response => {
                    if(response.success){
                        this.list = response.data.list;
                        this.total = response.data.total;
                        if(this.msg){       //父组件调用
                            this.parentFun(this.msg)
                        }
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                        this.total=null;
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
            statuschange (data) {
                switch (data) {
                    case true :
                        return {
                            text:'有效',
                            color:"#34BF97"
                        };
                    case false :
                        return {
                            text:'无效',
                            color:"#999999"
                        };
                    default :
                        return {
                            text:'无效',
                            color:"#999999"
                        };
                }
            },
            handleAdd () {
                this.formStatus= "新增";
                this.dialogVisible= true;
            },
            handleEdit(row){
                this.formStatus= "编辑";
                getObj(row.id).then(res =>{
                    if(res.success){
                        //修改赋值
                        this.dialogVisible= true;
                        this.form ={
                            id: res.data.id,
                            username: res.data.username,
                        } ;
                    }else{
                        this.$message.warning(res.message); //warning
                    }
                })
            },
            handleDelete (row){
                this.$confirm(
                    "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
                    "删除",
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
                        this.$message.error("删除成功");
                    });
                }).catch (() => {
                    this.$message("取消成功");
                });
            },
            upsubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.state.loading = true;
                        //获取点击的节点权限(包含半节点)
                        (this.form.id?putObj:registerUser)(this.form).then(res =>{
                            if(res.success){
                                this.dialogVisible = false;
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
                this.form={
                    username: '',
                    password: '',
                }
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
        }
    }
</script>
