
import {
    setToken,
    removeToken
} from '@/util/auth'
import {
    setStore,
    getStore
} from '@/util/store'
import {
    validatenull
} from '@/util/validate'

import {
    loginByUsername,
    loginBySocial,
    getUserInfo,
    refeshToken,
    logout
} from '@/api/login'
import {
    GetMenu
} from '@/api/menu'
import { encryption ,sortModule} from '@/util/util'

function addPath(ele) {
    if(!ele.children){
        ele.children=[]
    }
    ele.children.forEach(child => {
        const isChild = ele.children.length !== 0;
        if (isChild) {
            //path
            if (!child.uri.includes('http') && !child.uri.includes('https')) {
                child.uri = `${ele.uri}/${child.uri?child.uri:'index'}`
            }
            addPath(child);
        }
    })
}
function convert(ele,st) {
   for(let i=0;i<ele.length;i++){
       if(ele[i].menu){
           if(st){
               if (!ele[i].uri.includes('http') && !ele[i].uri.includes('https')) {
                   ele[i].uri = `${st}/${ele[i].uri?ele[i].uri:'index'}`
               }
           }
           if(!ele[i].children){
               ele[i].children=[];
           }else if(ele[i].children.length){
               ele[i].children=convert(ele[i].children,ele[i].uri);
           }
       }else{
           ele.splice(i,1);
           i--;
       }
   };
   return ele;
}
const user = {
    state: {
        userInfo: getStore({
            name: 'userInfo'
        }) || {},
        permissions: getStore({
            name: 'permissions'
        }) || {},
        roles: getStore({
            name: 'roles'
        }) || [],
        menu: getStore({
            name: 'menu'
        }) || [],
        isInitMenu: getStore({
            name: 'isInitMenu'
        }) || false,
        access_token: getStore({
            name: 'access_token'
        }) || '',
        refresh_token: getStore({
            name: 'refresh_token'
        }) || ''
    },
    actions: {
        // 根据用户名登录
        LoginByUsername({
            commit,
            state,
            dispatch
        }, userInfo) {
            return new Promise((resolve, reject) => {
                const user = encryption({
                    data: userInfo,
                    key: 'pigxpigxpigxpigx',
                    param: ['password']
                });
                loginByUsername(user.username, userInfo.password, user.code, user.randomStr).then(response => {
                    const data = response.data;
                    setToken(data.token_type+' '+data.access_token);
                    commit('SET_ACCESS_TOKEN', data.token_type+' '+data.access_token);
                    commit('SET_REFRESH_TOKEN', data.refresh_token);
                    commit('CLEAR_LOCK');
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据OpenId登录
        LoginBySocial({ commit, state, dispatch }, param) {
            return new Promise((resolve, reject) => {
                loginBySocial(param.state, param.code).then(response => {
                    const data = response.data
                    setToken(data.access_token)
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetUserInfo({
            commit,
            state,
            dispatch
        }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(response => {
                    const data = response.data.data
                    /*commit('SET_ROLES', data.roles)
                    commit('SET_USER_INFO', data.sysUser)
                    commit('SET_PERMISSIONS', data.permissions)*/
                    let menu = sortModule(data.menu);
                    if(menu){
                        menu=convert(menu);
                        commit('SET_MENU', menu); //菜单
                    }

                    commit('SET_ROLES', ["ROLE_ADMIN"]); //角色
                    commit('SET_USER_INFO',{username:data.username,id:data.id});  //信息
                    commit('SET_PERMISSIONS', ["sys_client_edit"]);  //按钮权限
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 刷新token
        RefeshToken ({ commit }) {
            return new Promise((resolve, reject) => {
                refeshToken().then(() => {
                    commit('SET_TOKEN', new Date().getTime())
                    setToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    // 清除菜单
                    commit('SET_MENU', []);
                        // 清除权限
                    commit('SET_PERMISSIONS', []);
                        // 清除用户信息
                    commit('SET_USER_INFO', {});
                    commit('SET_ACCESS_TOKEN', '');
                    commit('SET_REFRESH_TOKEN', '');
                    commit('SET_ROLES', []);
                    commit('DEL_ALL_TAG');
                    removeToken();
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 注销session
        FedLogOut({
            commit
        }) {
            return new Promise(resolve => {
                // 清除菜单
                commit('SET_MENU', [])
                    // 清除权限
                commit('SET_PERMISSIONS', [])
                    // 清除用户信息
                commit('SET_USER_INFO', {})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                removeToken()
                resolve()
            })
        },
        // 获取系统菜单
        GetMenu({
            commit
        }) {
            return new Promise(resolve => {
                GetMenu().then((res) => {
                    let data = sortModule(res.data.data.menu);
                    data=convert(data);
                   /* data.forEach(ele => {
                        addPath(ele);
                    });*/
                    commit('SET_MENU', data);
                    resolve(data)
                })
            })
        }
    },
    mutations: {
        SET_ACCESS_TOKEN: (state, access_token) => {
            state.access_token = access_token;
            setStore({
                name: 'access_token',
                content: state.access_token,
                type: 'session'
            })
        },
        SET_MENU: (state, menu) => {
            state.menu = menu
            setStore({
                name: 'menu',
                content: state.menu,
                type: 'session'
            })
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
            setStore({
                name: 'userInfo',
                content: state.userInfo,
                type: 'session'
            })
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            setStore({
                name: 'refresh_token',
                content: state.refresh_token,
                type: 'session'
            })
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
            setStore({
                name: 'roles',
                content: state.roles,
                type: 'session'
            })
        },
        SET_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i]] = true
            }
            state.permissions = list
            setStore({
                name: 'permissions',
                content: state.permissions,
                type: 'session'
            })
        }
    }
}
export default user