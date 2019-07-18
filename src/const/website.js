
export default {
    title: 'Bref',
    logo: 'Bref',
    indexTitle: 'Bref 微服务',
    author: '微服务快速开发框架',
    lockPage: '/lock',
    tokenTime: 6000,
    info: {
        title: 'Bref 微服务快速开发框架',
        list: [
            '是一个基于Spring Cloud、oAuth2.0开发基于Vue前后分离的开发平台',
            ' 是一个基于vue+vuex+vue-router快速后台管理系统，采用token交互验证方式。',
            '最大程度上帮助企业节省时间成本和费用开支。 ',
            '当前版本：v1.6.3'
        ]
    },
    wel: {
        title: 'Bref Microservice Architecture',
        list: [
            '一个基于Spring Cloud、oAuth2.0开发基于Vue前后分离的开发平台',
            ' 一个基于vue+vuex+vue-router快速后台管理系统，采用token交互验证方式。',
            '最大程度上帮助企业节省时间成本和费用开支。 ',
            '当前版本：v1.6.3'
        ]
    },
    //http的status默认放行不才用统一处理的,
    statusWhiteList: [400],
    //配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: "首页",
        value: "/wel/index",
        params: {},
        query: {},
        group: [],
        close: false
    },
    //配置菜单的属性
    menu: {
        props: {
            label: 'title',
            path: 'uri',
            icon: 'icon',
            children: 'children'
        }
    }
}