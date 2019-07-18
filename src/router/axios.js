/**
 * 全站http配置
 *
 * header参数说明
 * serialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/'
import router from '@/router/router'
import { serialize } from '@/util/util'
import { getToken } from '@/util/auth'
import { Message } from 'element-ui'
import website from '@/const/website';
import errorCode from '@/const/errorCode'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    /*config.headers['Content-Type'] =  'application/x-www-form-urlencoded;charset=UTF-8';
    config.transformRequest=[function (data, headers) {
        let q = new URLSearchParams();
        for(let i in data){
            q.append(i, data[i]);
        }
        return q.toString();
    }];*/

    const isToken = config.headers.isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] =getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    } else {
        delete config.headers.isToken;
    }
    //headers中配置serialize为true开启序列化
    if (['put','post'].includes(config.method)) {
        config.data = serialize(config.data);
    }
    return config
}, error => {
    return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
    NProgress.done();
    const status = Number(res.status) || 200
    const message = res.data.msg || errorCode[status] || errorCode['default']
    if (res.data.code === 1) {
        Message({
            message: message,
            type: 'error'
        })
        return Promise.reject(new Error(message))
    }

    if (status === 401) {
        store.dispatch('FedLogOut').then(() => {
            router.push({
                path: '/login'
            })
        })
        return
    }

    if (status !== 200) {
        Message({
            message: message,
            type: 'error'
        })
        return Promise.reject(new Error(message))
    }

    return res
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '错误请求';
                break;
            case 401:
                error.message = '未授权，请重新登录';
                break;
            case 403:
                error.message = '拒绝访问';
                break;
            case 404:
                error.message = `请求地址出错: ${error.response.config.url}`;
                break;
            case 405:
                error.message = '请求方法未允许';
                break;
            case 408:
                error.message = '请求超时';
                break;
            case 500:
                error.message = '服务器端出错';
                break;
            case 501:
                error.message = '网络未实现';
                break;
            case 502:
                error.message = '网络错误';
                break;
            case 503:
                error.message = '服务不可用';
                break;
            case 504:
                error.message = '网络超时';
                break;
            case 505:
                error.message = 'http版本不支持该请求';
                break;
            default:
                error.message = `连接错误${error.response.status}`
        }
    } else {
        error.message = "连接到服务器失败"
    }
    Message.error({message: error.message })
    NProgress.done();
    return Promise.reject(new Error(error));
})
export default axios;