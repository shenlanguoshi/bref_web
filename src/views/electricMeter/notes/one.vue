<template>
    <el-card class="box-card" shadow="hover">
        <div slot="header" class="top_header">
            <el-row :gutter="10">
                <el-col :span="6" class="no_b l">正常</el-col>
                <el-col :span="12" class="no_b c">{{item.name}}</el-col>
                <el-col :span="6" class="no_b r"><i class="el-icon-setting"></i></el-col>
            </el-row>
        </div>
        <el-row :gutter="5">
            <el-col :span="12" class="no_b c">
                <img src="/img/data/biao.png"/>
            </el-col>
            <el-col :span="12" class="no_b c"
                    v-loading="listLoading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据获取中...">
                <el-row>
                    <el-col :span="12" class="no_b c b_L b_b"><!-- class="c_r"-->
                        实时电流 <p>{{realTimeData.AirConCurrent.value}}{{realTimeData.AirConCurrent.unit}}</p>
                    </el-col>
                    <el-col :span="12" class="no_b c b_b">
                        实时电压 <p>{{realTimeData.AirConVolt.value}}{{realTimeData.AirConVolt.unit}}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" class="no_b c b_L">
                        剩余电流 <p>{{realTimeData.LineLeakage.value}}{{realTimeData.LineLeakage.unit}}</p>
                    </el-col>
                    <el-col :span="12" class="no_b c">
                        温度 <p>{{realTimeData.CurrentTemperature.value}}°C</p>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="12" class="no_b c">
                <el-button size="mini" type="text">历史数据</el-button>
                <el-button size="mini" type="text" >报警数据</el-button>
            </el-col>
            <el-col :span="12" class="no_b c">
                <el-button size="mini" type="primary">查看详情</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import {getrealTimeData} from "@/api/electricMeter/data";
    export default {
        name: "one",
        props: ['msg'],
        directives: {},
        components: {},
        data() {
            return {
                item:this.msg,
                realTimeData: {
                    AirConCurrent: {
                        unit: "A",
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
                    }
                },
                time:null,
                listLoading:false
            }
        },
        created() {
            this.listLoading = true;
            this.getList();
        },
        destroyed () {
            clearTimeout(this.time);
        },
        methods: {
            getList () {
                getrealTimeData(this.item).then(response => {
                    if(response.data.success){
                        this.realTimeData= response.data.data;
                        const that=this;
                        this.time=setTimeout(function(){
                            that.getList();
                        },10000)
                    }else{
                        this.$message.error({message: response.data.message});
                        this.realTimeData={
                            AirConCurrent: {
                                unit: "A",
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
                            }
                        };
                    }
                    this.listLoading =false;
                });
            },
        }
    }
</script>

<style scoped>

</style>