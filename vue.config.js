//const url = 'http://192.168.0.118:9999';
//const url = 'http://101.132.128.189:9999';
//const url = 'http://47.101.190.74:9999';
const url = 'http://192.168.0.126:9999';
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
    },
    transpileDependencies: ['avue-plugin-transfer', 'avue-plugin-ueditor'],
    //配置转发代理
    devServer: {
        proxy: {
            '/auth': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/auth': '/auth'
                }
            },
            '/user-service': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/user-service': '/user-service'
                }
            },
            '/electricmeter-service': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/electricmeter-service': '/electricmeter-service'
                }
            },
            '/gen': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/gen': '/gen'
                }
            },
            '/daemon': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/daemon': '/daemon'
                }
            },
            '/tx': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/tx': '/tx'
                }
            },
            '/act': {
                target: url,
                ws: true,
                pathRewrite: {
                    '^/act': '/act'
                }
            },
        }
    }
}