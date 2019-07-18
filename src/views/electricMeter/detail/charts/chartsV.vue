<template>
    <v-chart v-loading="listLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-text="图表生成中..." style="width: 100%" :options="list" ref="echartsV"/>
</template>

<script>
    import echarts from "vue-echarts";
    export default {
        name: "chartsV",
        props: ['dateTime','nowV'],
        components: {
            'v-chart': echarts
        },
        data() {
            return {
                dom:null,
                listLoading:false,
                list:{
                    title: {
                        text: '电压趋势变化图'
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
                        data:['电压']
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
                            name: '电压',
                            //min: 0,
                            //max:20,
                            //interval: 5,
                            axisLabel: {
                                formatter: '{value} V'
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
                            name:'电压',
                            type:'line',
                            itemStyle:{
                                color:'#FCFA29',
                            },
                            lineStyle:{
                                color:'#FCFA29',
                            },
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
                this.list.series.data=this.nowV;
                this.listLoading=false;
            },
            resizeFun () {
                this.$refs.echartsV.resize();
            }
        }
    }
</script>

<style scoped lang="scss">

</style>