<template>
    <div>
        <div class="filter-container">
            <el-button
                       class="filter-item"
                       size="small"
                       style="margin-left: 10px;"
                       @click="handleCreate"
                       type="primary"
                       icon="el-icon-plus">注册电表</el-button>
        </div>
        <div class="electricMeter"
             v-loading="listLoading"
             element-loading-text="给我一点时间">
            <div v-if="!listLoading && !list" class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
            <one v-for="(item, index) in list"
                 :key="item.id"
                 :index="index"
                 :msg="item" @update="handleUpdate" @del="deletes"></one>
        </div>
        <div v-show="!listLoading"
             class="pagination-container">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo"
                           :page-sizes="[5,10,20,30, 50]"
                           :page-size="listQuery.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="listQuery.total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]"
                   :visible.sync="dialogFormVisible"
                   @close="cancel('form')">
            <el-form :model="form"
                     :rules="rules"
                     ref="form"
                     label-width="120px">
                <el-form-item v-if="dialogStatus==='create'" label="产品key"
                              prop="productKey">
                    <el-input v-model="form.productKey"
                              placeholder="请输入产品key"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogStatus==='create'" label="设备名称"
                              prop="deviceName">
                    <el-input v-model="form.deviceName"
                              placeholder="请输入设备名称"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogStatus==='create'" label="设备secret"
                              prop="deviceSecret">
                    <el-input v-model="form.deviceSecret"
                              placeholder="请输入设备secret"></el-input>
                </el-form-item>
                <el-form-item label="电表名称"
                              prop="name">
                    <el-input v-model="form.name"
                              placeholder="请输入电表名称"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogStatus==='create'" label="所属区域"
                              prop="regionName">
                    <el-input v-model="form.regionName"
                              @focus="openDialogAll('region')"
                              readonly
                              placeholder="请选择电表所属区域"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogStatus==='create'" label="所属组织机构"
                              prop="corporationName">
                    <el-input v-model="form.corporationName"
                              @focus="openDialogAll('corporation')"
                              readonly
                              placeholder="请选择电表所属组织机构"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogStatus==='create'" label="所属行业分类"
                              prop="industryCategory">
                    <el-input v-model="form.industryCategoryNames"
                              @focus="openDialogAll('industryCategory')"
                              readonly
                              placeholder="请选择电表所属行业分类"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus==='create'"
                           type="primary"
                           @click="create('form')">确 定</el-button>
                <el-button v-else
                           type="primary"
                           @click="update('form')">修 改</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="'选择'+textsMap[dialogStatusA]"
                   :visible.sync="dialogDeptVisible">
            <region v-if="dialogStatusA==='region'" @node-click="getAllid"></region>
            <industry-category v-else-if="dialogStatusA==='industryCategory'" :msg="{check:true,chs:form.industryCategoryIds}" @node-click="getAllids"></industry-category>
            <corporation v-else="dialogStatusA==='corporation'" @node-click="getAllid"></corporation>
            <div slot="footer"
                 class="dialog-footer">
                <el-button v-if="dialogStatusA==='industryCategory'"
                           type="primary"
                           @click="industryCategoryCli">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {delSupervise,addSupervise,putSupervise} from "@/api/electricMeter/supervise";
    import {getData} from "@/api/electricMeter/data";
    import {deepClone} from "@/util/util";
    import one from "./one";
    import region from "@/views/admin/region/tree";
    import industryCategory from "@/views/admin/industryCategory/tree";
    import corporation from "@/views/admin/corporation/tree";
    export default {
        name: "item",
        props: ['msg'],
        components: {
            one,
            region,
            industryCategory,
            corporation
        },
        data() {
            return {
                listQuery: {
                    total: null,
                    pageNo: 1,
                    pageSize: 5,
                    id:this.msg
                },
                list:null,
                listLoading:false,
                form: {
                    id:null,
                    productKey: undefined,
                    deviceName: undefined,
                    deviceSecret: undefined,
                    name: undefined,
                    regionId: undefined,
                    regionName: undefined,
                    corporationId: undefined,
                    corporationName: undefined,
                    industryCategoryNames: undefined,
                    industryCategoryIds: undefined,
                },
                industryCategoryData:null,
                rules: {
                    name: [
                        {required: true,message: "请输入电表名称", trigger: "blur"}
                    ],
                    productKey: [
                        {required: true,message: "请输入产品key", trigger: "blur"}
                    ],
                    deviceName: [
                        {required: true,message: "请输入设备名称", trigger: "blur"}
                    ],
                    deviceSecret: [
                        {required: true,message: "请输入设备secret", trigger: "blur"}
                    ],
                    regionName: [
                        {required: true,message: "请输入所属区域", trigger: "change"}
                    ],
                    corporationName: [
                        {required: true,message: "请输入所属组织机构", trigger: "change"}
                    ]
                },
                dialogFormVisible: false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                dialogDeptVisible: false,
                dialogStatusA:"",
                textsMap: {
                    region: "区域",
                    industryCategory: "行业分类",
                    corporation: "组织机构"
                } ,
                i:null
            }
        },
        created() {
            //this.getList();
        },
        methods: {
            getList (id) {
                if(id){
                    this.listQuery.id=id;
                }
                this.listLoading = true;
                this.listQuery.isAsc = false;
                getData(this.listQuery).then(response => {
                    if(response.data.success){
                        this.list = response.data.data.list;
                        this.listQuery.total = response.data.data.total;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                        this.total=null;
                    }
                    this.listLoading = false;
                });
            },
            handleSizeChange (val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange (val) {
                this.listQuery.pageNo = val;
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
                    productKey: undefined,
                    deviceName: undefined,
                    deviceSecret: undefined,
                    name: undefined,
                    regionId: this.msg.id,
                    regionName: this.msg.name,
                    corporationId: undefined,
                    corporationName: undefined,
                    industryCategoryNames: undefined,
                    industryCategoryIds: undefined,
                };
            },
            handleUpdate (row) {
                this.i=row.i;
                this.form = deepClone(row.data);
                this.dialogFormVisible = true;
                this.dialogStatus = "update";
            },
            deletes (row) {
                this.$confirm("此操作将永久删除该电表(" + row.name + "), 是否继续?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delSupervise(row.id).then((response) => {
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
            openDialogAll (type) {
                this.dialogStatusA=type;
                this.dialogDeptVisible=true;
            },
            getAllid (data) {
                this.dialogDeptVisible=false;
                this.form[this.dialogStatusA+'Id']=data.id;
                this.form[this.dialogStatusA+'Name']=data.name;
            },
            getAllids (data) {
                this.industryCategoryData=data;
            },
            industryCategoryCli () {
                this.dialogDeptVisible=false;
                if(this.industryCategoryData){
                    this.form.industryCategoryIds=this.industryCategoryData.k.join(",");
                    this.form.industryCategoryNames=this.industryCategoryData.d.map(function(item,){
                        return item.name;
                    }).join(",");
                }
            },
            create (formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        addSupervise(this.form).then((response) => {
                            this.dialogFormVisible = false;
                            if(response.data.success){
                                if(this.listQuery.id){
                                    this.getList();
                                }
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
                        //this.dialogFormVisible = false;
                        putSupervise(this.form).then((response) => {
                            if(response.data.success){
                                //this.getList();
                                this.list.splice(this.i, 1, this.form);
                                this.dialogFormVisible = false;
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
        }
    }
</script>

<style  lang="scss">
    .electricMeter {
        border:1px solid #EBEEF5;
        min-height: 200px;
        padding:5px;
        &:after{
            content:"";
            display: block;
            clear: both;

        }
        .pagination-container {

        }
        .box-card {
            width:380px;
            float:left;
            margin:5px;
            .el-card__header{
                padding:10px 20px
            }
            .no_b{
                margin:0;
                &.c{
                    text-align: center;
                }
                &.r{
                    text-align: right;
                }
            }
            .top_header{
            }
            .c_r{
                color:red;
            }
            .b_L{
                border-right:1px solid #F9F7F7;
            }
            .b_b{
                border-bottom:1px solid #F9F7F7;
            }
        }
    }
</style>