import Layout from '@/page/index/'
export default [{
    path: '/crud',
    component: Layout,
    redirect: '/crud/index',
    children: [{
        path: 'index',
        name: 'crud实例',
        component: () =>
            import ( /* webpackChunkName: "page" */ '@/views/crud/index'),
    }]
}, {
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [{
        path: 'index',
        name: '首页',
        component: () =>
            import ( /* webpackChunkName: "views" */ '@/page/wel')
    }]
},
    {
        path: '/form',
        component: Layout,
        redirect: '/form/index',
        children: [{
            path: 'index',
            name: '表单设计器',
            meta: {
                keepAlive: true,
            },
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/form/index')
        }]
    },
   /* {
        path: '/info',
        component: Layout,
        redirect: '/info/index',
        children: [{
            path: 'index',
            name: '个人信息',
            component: () =>
                import ( /!* webpackChunkName: "page" *!/ '@/views/admin/user/infoOld'),
        }]

    },*/
    {
        path: '/listToken',
        component: Layout,
        redirect: '/listToken/index',
        children: [{
            path: 'index',
            name: '已登录用户',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/admin/user/listToken'),
        }]

    },
    {
        path: '/user/info',
        component: Layout,
        redirect: '/user/info',
        children: [{
            path: ':id',
            name: '用户信息',
            meta: {
                keepAlive: false,
            },
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/admin/user/info')
        }]
    },
    {
        path: '/corporationWork/info',
        component: Layout,
        redirect: '/corporationWork/info',
        children: [{
            path: ':id',
            name: '岗位信息',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/admin/corporationWork/info')
        }]
    },
    {
        path: '/jobPosition/info',
        component: Layout,
        redirect: '/jobPosition/info',
        children: [{
            path: ':id',
            name: '职务信息',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/admin/jobPosition/info')
        }]
    },
    {
        path: '/permission/info',
        component: Layout,
        redirect: '/permission/info',
        children: [{
            path: ':id',
            name: '权限信息',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/admin/permission/info')
        }]
    },
    {
        path: '/permission/dataScope/info',
        component: Layout,
        redirect: '/permission/dataScope/info',
        children: [{
            path: ':id',
            name: '数据权限-行信息',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/admin/permission/dataScope/info')
        }]
    },
    {
        path: '/permission/dataSchema/info',
        component: Layout,
        redirect: '/permission/dataSchema/info',
        children: [{
            path: ':id',
            name: '数据权限-列信息',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/admin/permission/dataSchema/info')
        }]
    },
    {
        path: '/electricMeter/info',
        component: Layout,
        redirect: '/electricMeter/info',
        children: [{
            path: ':id',
            name: '电表详情',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/electricMeter/detail/index')
        }]
    },
    {
        path: '/electricMeter/log',
        component: Layout,
        redirect: '/electricMeter/log',
        children: [{
            path: ':id',
            name: '报警日志',
            component: () =>
                import ( /* webpackChunkName: "page" */ '@/views/electricMeter/log/index'),
        }]

    },
]