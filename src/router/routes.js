import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          //cache: true,
          auth: true
        },
        component: _import('system/index')
      },
        {
            path: 'info',
            name: 'info',
            meta: {
                title: '个人资料',
                auth: true
            },
            component: _import('home/info')
        },
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理',
          auth: true
        },
        component: _import('home/user')
      },
        {
            path: 'user/info/:id',
            name: 'user_info',
            meta: {
                title: '用户信息',
                auth: true
            },
            component: _import('home/user/info')
        },
        {
            path: 'corporation',
            name: 'corporation',
            meta: {
                title: '组织机构',
                auth: true
            },
            component: _import('home/corporation')
        },
        {
            path: 'corporationWork',
            name: 'corporationWork',
            meta: {
                title: '岗位管理',
                auth: true
            },
            component: _import('home/corporationWork')
        },
        {
            path: 'corporationWork/info/:id',
            name: 'corporationWork_info',
            meta: {
                title: '岗位信息',
                auth: true
            },
            component: _import('home/corporationWork/info')
        },
        {
            path: 'jobPosition',
            name: 'jobPosition',
            meta: {
                title: '职务管理',
                auth: true
            },
            component: _import('home/jobPosition')
        },
        {
            path: 'jobPosition/info/:id',
            name: 'jobPosition_info',
            meta: {
                title: '职务信息',
                auth: true
            },
            component: _import('home/jobPosition/info')
        },
        {
            path: 'role',
            name: 'role',
            meta: {
                title: '权限',
                auth: true
            },
            component: _import('home/role')
        },
        {
            path: 'role/info/:id',
            name: 'role_info',
            meta: {
                title: '权限信息',
                auth: true
            },
            component: _import('home/role/info')
        },
        {
            path: 'roleLine',
            name: 'roleLine',
            meta: {
                title: '数据权限-行',
                auth: true
            },
            component: _import('home/roleLine')
        },
        {
            path: 'roleLine/info/:id',
            name: 'roleLine_info',
            meta: {
                title: '数据权限-行信息',
                auth: true
            },
            component: _import('home/roleLine/info')
        },
        {
            path: 'roleList',
            name: 'roleList',
            meta: {
                title: '数据权限-列',
                auth: true
            },
            component: _import('home/roleList')
        },
        {
            path: 'roleList/info/:id',
            name: 'roleList_info',
            meta: {
                title: '数据权限-列信息',
                auth: true
            },
            component: _import('home/roleList/info')
        },
      {
        path: 'moduleTree/index',
        name: 'module',
        meta: {
          title: '模块管理',
          auth: true
        },
        component: _import('home/module')
      },

      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  },
    {
        path: '/register',
        name: 'register',
        component: _import('system/register')
    }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
