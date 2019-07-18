<template>
    <div class="app-container calendar-list-container">
        <el-button type="text" icon="el-icon-back" @click="breaks">返回</el-button>
        <el-row :gutter="20" class="detialInfo">
            <el-col :md="9" :lg="7" :xl="5">
                <el-card class="box-card" shadow="hover">
                    <ul class="flex-wrap">
                        <li class="flex-con">
                            <p>终端信息</p>
                            <el-form label-width="auto" size="mini">
                                <el-form-item label="设备名称:">{{item.deviceName}}</el-form-item>
                                <el-form-item label="电表名称:">{{item.name}}</el-form-item>
                                <el-form-item label="注册时间:">{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</el-form-item>
                            </el-form>
                        </li>
                        <li class="l_right">
                            <img class="dbIcon" src="/img/data/biao.png"/>
                        </li>
                    </ul>
                </el-card>
                <el-card shadow="hover">
                    <div slot="header" class="top_header">
                        <span>电表实时数据</span>
                        <el-button style="float: right; padding: 3px 0" type="text" disabled
                                   icon="el-icon-time">{{realTimeData.AirConCurrent.time | dateformats()}}</el-button>
                    </div>
                    <ul class="table_i"
                        v-loading="listLoading"
                        element-loading-spinner="el-icon-loading"
                        element-loading-text="数据获取中...">
                        <li>实时电流<br>{{realTimeData.AirConCurrent.value}}{{realTimeData.AirConCurrent.unit}}</li>
                        <li>剩余电流<br>{{realTimeData.LineLeakage.value}}{{realTimeData.LineLeakage.unit}}</li>
                        <li>电压<br>{{realTimeData.AirConVolt.value}}{{realTimeData.AirConVolt.unit}}</li>
                        <li>温度<br>{{realTimeData.CurrentTemperature.value}}°C</li>
                    </ul>
                </el-card>
                <el-button icon="">历史数据</el-button>
                <el-button @click="log">报警日志</el-button>
            </el-col>
            <el-col :md="15" :lg="17" :xl="19">
                <el-card shadow="hover">
                    <charts-a :dateTime="dateTime" :nowA="nowA" :nowAl="nowAl" ref="cA"></charts-a>
                </el-card>
                <el-card shadow="hover">
                    <charts-t :dateTime="dateTime" :nowT="nowT" ref="cT"></charts-t>
                </el-card>
                <el-card shadow="hover">
                    <charts-v :dateTime="dateTime" :nowV="nowV" ref="cV"></charts-v>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {getrealTimeData,gethistroyData} from "@/api/electricMeter/data";
    import {dateformats,deepClone,throttle,debounce} from "@/util/util";
    import chartsA from "./charts/chartsA";
    import chartsV from "./charts/chartsV";
    import chartsT from "./charts/chartsT";
    export default {
        name: "index",
        props: [],
        directives: {},
        components: {
            chartsA,
            chartsT,
            chartsV
        },
        data() {
            return {
                id:this.$route.params.id,
                item:deepClone(this.$route.query),
                time:null,
                list:null,
                dateTime:[],
                nowA:[],
                nowAl:[],
                nowV:[],
                nowT:[],
                realTimeData: {
                    AirConCurrent: {
                        unit: "A",
                        time: "",
                        value: "--"
                    },
                    AirConVolt: {
                        unit: "V",
                        value: "--"
                    },
                    CurrentTemperature: {
                        unit: "°",
                        value: "--"
                    },
                    LineLeakage: {
                        unit: "mA",
                        value: "--"
                    },
                    status: "OFFLINE"
                },
                listLoading:false
            }
        },
        beforeRouteUpdate (to, from, next) {
            clearTimeout(this.time);
            this.id = to.params.id;
            this.name = to.query.name;
            this.item = deepClone(to.query);
            this.getList();
            next()
        },
        created() {
            this.listLoading = true;
            this.getList();
        },
        destroyed () {
            clearTimeout(this.time);
            window.onresize=null;
        },
        mounted () {
            var that=this.$refs;
            var throttleAjax=debounce(function(){
                that.cA.resizeFun();
                that.cT.resizeFun();
                that.cV.resizeFun();
            },500);
            setTimeout(function(){
                window.onresize = function(){
                    throttleAjax();
                }
            },0)
        },
        methods: {
            getList () {
                getrealTimeData(this.item).then(response => {
                    if(response.data.success){
                        this.realTimeData= response.data.data;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.realTimeData={
                            AirConCurrent: {
                                unit: "A",
                                time: "--",
                                value: "--"
                            },
                            AirConVolt: {
                                unit: "V",
                                value: "--"
                            },
                            CurrentTemperature: {
                                unit: "°",
                                value: "--"
                            },
                            LineLeakage: {
                                unit: "mA",
                                value: "--"
                            },
                            status: "OFFLINE"
                        };
                    }
                    this.listLoading =false;
                });
                this.item.endTime = dateformats(Date.now());
                this.item.beginTime=dateformats(Date.now()-(1000*60*60*3));
                gethistroyData(this.item).then(response => {
                    if(response.data.success){
                        this.list=response.data.data;
                        this.dealData();
                    }else{
                        this.$message.error({message: response.data.message});
                    }
                    this.listLoading =false;
                });
                const that=this;
                this.time=setTimeout(function(){
                    that.getList();
                },60000)
            },
            dealData () {
                if(this.list.length){
                    for(let i=0;i<this.list.length;i++){
                        this.dateTime.push(this.list[i].createTime);
                        this.nowA.push(this.list[i].a);
                        this.nowAl.push(this.list[i].l);
                        this.nowV.push(this.list[i].v);
                        this.nowT.push(this.list[i].t);
                    }
                    this.$refs.cA.init();
                    this.$refs.cT.init();
                    this.$refs.cV.init();
                    this.delPush();
                }
            },
            delPush () {
                this.dateTime=[];
                this.nowA=[];
                this.nowAl=[];
                this.nowV=[];
                this.nowT=[];
            },
            breaks() {
                this.$router.$avueRouter.closeTag();
                this.$router.back();
            },
            log () {
                this.$router.push({ path:'/electricMeter/log/'+this.item.id,query:{
                        ...this.$route.query,
                        title:this.item.name,
                        name:'报警日志-'+this.item.name,
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-container{
        padding:5px 20px;
        .box-card{
            border-left:4px solid #168ED8;
        }
    }
    .l_right{
        width:100px;
        text-align: center;
    }
    .dbIcon{
        width:78px;
        height:78px;
        vertical-align: bottom;
    }
    .detialInfo{
        .el-form-item{
            margin-bottom:0;
        }
        .el-card{
            margin-bottom: 20px;
        }
    }
    .table_i{
        &:after{
            content:"";
            display: block;
            clear: both;
        }
        li{
            width:33.33333333%;
            float:left;
            text-align: center;
            padding:5px 0;
            &:nth-of-type(3n){
                border-left:1px solid #F5F2F2;
            }
        }
    }
</style>
<style lang="scss">
    .detialInfo{
        .el-card__header{
            padding:10px 20px
        }
    }
</style>