<template>
    <div>
        <el-tooltip v-for="item in list"  :content="item" placement="top">
            <el-button @click="getC(item)" :icon="item" circle></el-button>
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: "icon",
        props: [],
        directives: {},
        components: {},
        data() {
            return {
                radio9:null,
                list:[
                    'icon-msnui-supervise',
                    'icon-luyou',
                    'icon-wendang',
                    'icon-lishiguiji',
                    'icon-luyou1',
                    'icon-weibiaoti13',
                    'icon-luyou2',
                    'icon-weibiaoti46',
                    'icon-xitongguanli',
                    'icon-qingjia',
                    'icon-denglvlingpai',
                    'icon-shouji',
                    'icon-online',
                    'icon-liucheng',
                    'icon-quanxianguanli',
                    'icon-jiaoseguanli',
                    'icon-web-icon-',
                    'icon-line',
                    'icon-pyramidlinkur',
                    'icon-miyue',
                    'icon-renwu',
                    'icon-rizhiguanli',
                    'icon-navicon-zdgl',
                    'icon-yonghuguanli',
                    'icon-xitongguanli1',
                    'icon-caidanguanli',
                    'icon-guiji',
                    'icon-kuaisugongzuoliu_o',
                    'icon-guanwang',
                    'icon-qingchuhuancun',
                    'icon-gtsquanjushiwufuwuGTS',
                    'icon-huanyingye',
                    'icon-shujuzhanshi2',
                    'icon-cuowutishitubiao',
                    'icon-iconset0216',
                    'icon-iconset0265',
                    'icon-iframe',
                    'icon-wxbgongju',
                    'icon-biaodan',
                    'icon-qq',
                    'icon-msnui-360',
                    'icon-tuichu',
                    'icon-souhu',
                    'icon-weixin',
                    'icon-changyonglogo27',
                    'icon-yanzhengma',
                    'icon-tubiao',
                    'icon-dongtai',
                    'icon-navicon',
                    'icon-liuliangyunpingtaitubiao08',
                    'icon-cuowu',
                    'icon-rizhi',
                    'icon-daohanglanmoshi02',
                    'icon-yuan',
                    'icon-quanxian',
                    'icon-baidu1',
                    'icon-debug',
                    'icon-shuaxin',
                    'icon-caidanguanli',
                    'icon-biaoge',
                    'icon-bofangqi-suoping',
                    'icon-yonghuguanli',
                    'icon-yonghu',
                    'icon-mima',
                    'icon-shouji',
                    'icon-jiaoseguanli',
                    'icon-canshu',
                    'icon-huanyingye',
                    'icon-shujuzhanshi2',
                    'icon-weixin1',
                    'icon-cuowutishitubiao',
                    'icon-iconset0216',
                    'icon-iconset0265',
                    'icon-quanping',
                    'icon-tuichuquanping',
                    'icon-iframe',
                    'icon-wxbgongju',
                    'icon-biaodan',
                    'icon-msnui-360',
                    'icon-tuichu',
                    'icon-souhu',
                    'icon-qq1',
                    'icon-bug',
                    'icon-iconset0119',
                    'icon-wendangdocument72',
                    'icon-kehuduanzutaigongju',
                    'icon-ecs-status',
                    'icon-bangzhushouji',
                    'icon-iconbmgl',
                    'icon-zygl',
                    'icon-jiankong',
                ]
            }
        },
        created() {

        },
        methods: {
            getC (data) {
                this.$emit('change-click',data);
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-button{
        margin:5px ;
    }
</style>