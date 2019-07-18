<template>
    <el-card class="box-card" shadow="hover">
        <div slot="header" class="top_header">
            <el-row :gutter="10">
               <!-- <el-col :span="6" class="no_b l"></el-col>-->
                <el-col :span="18" class="no_b c">{{item.name}}</el-col>
                <el-col :span="6" class="no_b r">
                    <el-dropdown class="tags-menu ">
                        <el-button  style="padding:0;border:0;" icon="el-icon-setting"></el-button>
                        <el-dropdown-menu slot="dropdown" split-button >
                            <el-dropdown-item icon="el-icon-edit" type="success" @click.stop.native="handleUpdate(item)">
                                <i class="el-icon-edit"></i>编辑
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-delete" type="danger" @click.stop.native="deletes(item)">
                                <i class="el-icon-delete"></i>删除
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="5">
            <el-col :span="12" class="no_b c">
                <img src="/img/data/biao.png"/>
            </el-col>
            <el-col :span="12" class="no_b c">
                <p>产品key:{{item.productKey}}</p>
                <p>设备名称:{{item.deviceName}}</p>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12" class="no_b c">
                <el-button size="mini" type="text">历史数据</el-button>
                <el-button size="mini" type="text" @click="log">报警数据</el-button>
            </el-col>
            <el-col :span="12" class="no_b c">
                <el-button size="mini" type="primary" @click="getDetail">查看详情</el-button>
            </el-col>
        </el-row>
        <el-dialog title="修改"
                   :visible.sync="dialogFormVisible"
                   @close="cancel('form')">
            <el-form :model="form"
                     :rules="rules"
                     ref="form"
                     label-width="120px">

                <el-form-item label="电表名称"
                              prop="name">
                    <el-input v-model="form.name"
                              placeholder="请输入电表名称"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button
                           type="primary"
                           @click="update('form')">修 改</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    import {putSupervise} from "@/api/electricMeter/supervise";
    import {deepClone} from "@/util/util";
    export default {
        name: "one",
        props: ['msg','index'],
        directives: {},
        components: {},
        data() {
            return {
                item:this.msg,
                time:null,
                listLoading:false,
                dialogFormVisible:false,
                form: {
                    id: undefined,
                    name: undefined,
                },
                rules: {
                    name: [
                        {required: true,message: "请输入电表名称", trigger: "blur"}
                    ],
                },
            }
        },
        created() {
            this.listLoading = true;
            //this.getList();
        },
        destroyed () {
            clearTimeout(this.time);
        },
        methods: {
            getList () {
                getrealTimeData(this.item).then(response => {
                    if(response.data.success){
                        this.realTimeData= response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.realTimeData=null;

                    }
                    this.listLoading =false;
                });
            },
            handleUpdate (data) {
                this.form = deepClone(data);
                this.dialogFormVisible = true;
                //this.$emit('update',{i:this.index,data:data});
            },
            update (formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        putSupervise(this.form).then((response) => {
                            if(response.data.success){
                                this.item.name=this.form.name;
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
            cancel (formName) {
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            deletes (data) {
                this.$emit('del',data);
            },
            getDetail () {
                this.$router.push({ path:'/electricMeter/info/'+this.item.id,query:this.item});
            },
            log () {
                this.$router.push({ path:'/electricMeter/log/'+this.item.id,query:{
                        ...this.item,
                        title:this.item.name,
                        name:'报警日志-'+this.item.name,
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>