import request from '@/plugin/axios';

/*分页搜索职务列表*/
export function getJobPosition(obj) {
    return request({
        url: 'user-service/jobPosition/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/'+'{"name":"'+obj.searchParam.name+'"}',
        method: 'get',
    })
}
/*新增职务*/
export function addJobPosition(obj) {
    return request({
        url: 'user-service/jobPosition',
        method: 'post',
        data: {jobPositionInfo:JSON.stringify(obj)}
    })
}
/*修改职务信息*/
export function putJobPosition(obj) {
    return request({
        url: '/user-service/jobPosition/' + obj.id,
        method: 'put',
        data: {
            jobPositionInfo:JSON.stringify(obj)
        }
    })
}
/*删除职务*/

export function delJobPosition(obj) {
    return request({
        url: 'user-service/jobPosition/'+obj ,
        method: 'DELETE',
    })
}

/*查询职务用户*/
export function getJobPositionUser(obj) {
    return request({
        url: 'user-service/jobPosition/'+obj+'/user',
        method: 'get',
    })
}
/*删除职务用户*/
export function delJobPositionUser(obj) {
    return request({
        url: 'user-service/jobPosition/'+obj.id+'/user/'+obj.userId,
        method: 'DELETE',
    })
}
/*新增职务用户*/
export function addJobPositionUser(obj) {
    return request({
        url: 'user-service/jobPosition/user',
        method: 'post',
        data: {jobPositionUserInfo:JSON.stringify(obj)}
    })
}

/*查询职务权限*/
export function getJobPositionP(obj) {
    return request({
        url: 'user-service/jobPosition/'+obj+'/permission',
        method: 'get',
    })
}
/*删除职务权限*/
export function delJobPositionP(obj) {
    return request({
        url: 'user-service/jobPosition/'+obj.id+'/permission/'+obj.permissionId,
        method: 'DELETE',
    })
}
/*新增职务权限*/
export function addJobPositionP(obj) {
    return request({
        url: 'user-service/jobPosition/permission',
        method: 'post',
        data: {jobPositionPermissionInfo:JSON.stringify(obj)}
    })
}