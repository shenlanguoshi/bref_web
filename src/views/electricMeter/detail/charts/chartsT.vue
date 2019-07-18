<template>
    <v-chart v-loading="listLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-text="图表生成中..." style="width: 100%" :options="list" ref="echartsT"/>
</template>

<script>
    import echarts from "vue-echarts";
    export default {
        name: "chartsT",
        props: ['dateTime','nowT'],
        directives: {},
        components: {
            'v-chart': echarts
        },
        data() {
            return {
                dom:null,
                listLoading:false,
                list:{
                    title: {
                        text: '温度趋势变化图'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:['温度']
                    },
                    grid: {
                        left: '0%',
                        right: '0%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis :
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : []
                        }
                    ,
                    yAxis :
                        {
                            type: 'value',
                            name: '温度',
                            //min: 0,
                            //max:20,
                            //interval: 5,
                            axisLabel: {
                                formatter: '{value} °C'
                            }
                        },
                    dataZoom: [{
                        type: 'slider',
                        start: 70,
                        end: 100
                    }, {
                        type: 'inside',
                        start: 70,
                        end: 100
                    }],
                    series :
                        {
                            name:'温度',
                            type:'line',
                            data:[]
                        }

                }
            }
        },
        created() {
            this.listLoading=true;
        },
        mounted () {
        },
        methods: {
            init () {
                this.list.xAxis.data=this.dateTime;
                this.list.series.data=this.nowT;
                this.listLoading=false;
            },
            resizeFun () {
                this.$refs.echartsT.resize();
            }
        }
    }
</script>

<style scoped lang="scss">

</style>