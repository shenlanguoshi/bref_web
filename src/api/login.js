
import request from '@/router/axios'
export const loginByUsername = (username, password, code, randomStr) => {
    var grant_type = 'password';
    var scope = 'server';
    var client_id='test';
    var client_secret='test';

    /*return new Promise((resolve, reject) => {
        resolve({data:{ access_token: "3f6d149c-29b8-407c-9d44-2e7633f6c3f2",
                expires_in: 23587,
                license: "made by pigx",
                refresh_token: "21bd488e-d6dd-47ba-b1eb-1eab8c37c155",
                scope: "server",
                token_type: "bearer"}});
    })*/
    return request({
        url: '/auth/oauth/token',
        method: 'post',
        data: { username, password, grant_type, scope ,client_id,client_secret}
    })
}

export const loginBySocial = (state, code) => {
    var grant_type = 'mobile'
    return request({
        url: '/auth/mobile/token',
        headers: {
            'Authorization': 'Basic cGlnOnBpZw=='
        },
        method: 'post',
        data: { mobile: state + '@' + code, grant_type }
    })
}

//httpspig.avue.top#welindex

export const getUserInfo = () => {
    return request({
        url: '/user-service/me',
        method: 'get'
    })
    /*return new Promise((resolve, reject) => {
        resolve({ data:{
                sysUser:{
                    avatar: null,
                    createTime: "2018-04-20 07:15:18",
                    delFlag: "0",
                    deptId: 1,
                    password: "$2a$10$RpFJjxYiXdEsAGnWp/8fsOetMuOON96Ntk/Ym2M/RKRyU0GZseaDC",
                    phone: "17034642888",
                    qqOpenid: null,
                    updateTime: "2018-09-01 15:57:21",
                    userId: 1,
                    username: "test",
                    wxOpenid: "o_0FT0uyg_H1vVy2H0JpSwlVGhWQ"
                },
                roles:["ROLE_ADMIN"],
                permissions:[
                    "sys_client_edit",
                    "sys_dept_del",
                    "sys_user_edit",
                    "sys_dict_edit",
                    "sys_menu_del",
                    "sys_role_edit",
                    "sys_token_del",
                    "sys_dept_add",
                    "sys_role_del",
                    "generator_syssocialdetails_edit",
                    "sys_dict_del",
                    "sys_dict_add",
                    "sys_user_del",
                    "sys_menu_add",
                    "sys_role_add",
                    "generator_syssocialdetails_add",
                    "sys_client_add",
                    "sys_dept_edit",
                    "daemon_statustracelog_del",
                    "sys_menu_edit",
                    "sys_role_perm",
                    "sys_user_add",
                    "sys_log_del",
                    "generator_syssocialdetails_del",
                    "sys_client_del"
                ]
            } });
    })*/
}

export const logout = () => {
    return request({
        url: '/auth/removeToken',
        method: 'get'
    })
    /*return new Promise((resolve, reject) => {
        resolve({
                code: 0,
                data: true,
                msg: "success",
            });
    })*/
}

export function refeshToken(grant_type,refresh_token,client_id,client_secret) {
    return request({
        url: 'oauth/token',
        method: 'post',
        data: {
                grant_type,
                refresh_token,
                client_id,
                client_secret
            }
    })
}