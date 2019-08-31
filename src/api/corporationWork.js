import request from '@/plugin/axios';
/*分页搜索岗位列表*/
export function getCorporationWork(obj) {
    return request({
        url: 'user-service/corporationWork/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/' +
            '{"name":"'+obj.searchParam.name+'"'+(obj.corporationId?(',"corporationId":"'+obj.corporationId+'"'):'')+'}',
        method: 'get',
    })
}

/*新增岗位*/
export function addCorporationWork(obj) {
    return request({
        url: 'user-service/corporationWork',
        method: 'post',
        data: {corporationWorkInfo:JSON.stringify(obj)}
    })
}
/*修改岗位信息*/
export function putCorporationWork(obj) {
    return request({
        url: '/user-service/corporationWork/' + obj.id,
        method: 'put',
        data: {
            corporationWorkInfo:JSON.stringify(obj)
        }
    })
}
/*删除岗位*/
export function delCorporationWork(obj) {
    return request({
        url: 'user-service/corporationWork/'+obj ,
        method: 'DELETE',
    })
}

/*查询岗位用户*/
export function getCorporationWorkUser(obj) {
    return request({
        url: 'user-service/corporationWork/'+obj+'/user',
        method: 'get',
    })
}

/*删除岗位用户*/
export function delCorporationWorkUser(obj) {
    return request({
        url: 'user-service/corporationWork/'+obj.id+'/user/'+obj.userId ,
        method: 'DELETE',
    })
}
/*新增岗位用户*/
export function addCorporationWorkUser(obj) {
    return request({
        url: 'user-service/corporationWork/user',
        method: 'post',
        data: {corporationWorkUserInfo:JSON.stringify(obj)}
    })
}
/*查询岗位权限*/
export function getCorporationWorkP(obj) {
    return request({
        url: 'user-service/corporationWork/'+obj+'/permission',
        method: 'get',
    })
}
/*删除岗位权限*/
export function delCorporationWorkP(obj) {
    return request({
        url: 'user-service/corporationWork/'+obj.id+'/permission/'+obj.permissionId ,
        method: 'DELETE',
    })
}
/*新增岗位权限*/
export function addCorporationWorkP(obj) {
    return request({
        url: 'user-service/corporationWork/permission',
        method: 'post',
        data: {corporationWorkPermissionInfo:JSON.stringify(obj)}
    })
}