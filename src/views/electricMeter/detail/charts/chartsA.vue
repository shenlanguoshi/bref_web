<template>
    <v-chart v-loading="listLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-text="图表生成中..." style="width: 100%" :options="list" ref="echartsA"/>
</template>

<script>
    import echarts from "vue-echarts";
    export default {
        name: "chartsA",
        props: ['dateTime','nowA','nowAl'],
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
                        text: '电流趋势变化图'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                    },
                    /*toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },*/
                    legend: {
                        data:['实时电流','漏电电流']
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
                    yAxis :  [
                        {
                            type: 'value',
                            name: '实时电流',
                            //min: 0,
                            //interval: 2,
                            axisLabel: {
                                formatter: '{value} A'
                            }
                        },
                        {
                            type: 'value',
                            name: '漏电电流',
                            //min: 0,
                            //interval: 5,
                            axisLabel: {
                                formatter: '{value} mA'
                            }
                        }
                    ],
                    dataZoom: [{
                        type: 'slider',
                        start: 70,
                        end: 100
                    }, {
                        type: 'inside',
                        start: 70,
                        end: 100
                    }],
                    series : [
                        {
                            name:'实时电流',
                            type:'line',
                            itemStyle:{
                                color:'#3FAE70',
                            },
                            lineStyle:{
                                color:'#3FAE70',
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#3FAE70' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#B9FAD6' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            },
                            data:[]
                        },
                        {
                            name:'漏电电流',
                            type:'line',
                            yAxisIndex: 1,
                            itemStyle:{
                                color:'#2796DB',
                            },
                            lineStyle:{
                                color:'#2796DB',
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#2796DB' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#85C9E5' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            },
                            data:[]
                        }
                    ]
                }
            }
        },
        created() {
            //this.init();
            this.listLoading=true;
        },
        mounted () {
        },
        methods: {
            init () {
                this.list.xAxis.data=this.dateTime;
                this.list.series[0].data=this.nowA;
                this.list.series[1].data=this.nowAl;
                this.listLoading=false;
            },
            resizeFun () {
                this.$refs.echartsA.resize();
            }
        }
    }
</script>

<style scoped lang="scss">

</style>