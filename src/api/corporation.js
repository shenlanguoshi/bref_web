import request from '@/plugin/axios'

/*查询组织机构树*/
export function getCorporation(obj) {
    return request({
        url: 'user-service/corporation',
        method: 'get'
    })
}

/*删除组织机构*/
export function delCorporation(obj) {
    return request({
        url: 'user-service/corporation/'+obj,
        method: 'DELETE'
    })
}

/*新增组织机构*/
export function addCorporation(obj) {
    return request({
        url: 'user-service/corporation',
        method: 'post',
        data: {corporationInfo:JSON.stringify(obj)}
    })
}

/*修改组织机构信息*/
export function putCorporation(obj) {
    return request({
        url: '/user-service/corporation/' + obj.id,
        method: 'put',
        data: {
            corporationInfo:JSON.stringify(obj)
        }
    })
}

/*查询组织机构用户*/
export function getCorporationUser(id) {
    return request({
        url: '/user-service/corporation/'+id+'/user',
        method: 'get'
    })
}

/*删除组织机构用户*/
export function delCorporationUser(obj) {
    return request({
        url: 'user-service/corporation/'+obj.id+'/user/'+obj.userId,
        method: 'DELETE'
    })
}
/*新增组织机构用户*/
export function addCorporationUser(obj) {
    return request({
        url: 'user-service/corporation/user',
        method: 'post',
        data: {corporationUserInfo:JSON.stringify(obj)}
    })
}

/*查询组织机构权限*/
export function getCorporationPermission(id) {
    return request({
        url: '/user-service/corporation/'+id+'/permission',
        method: 'get'
    })
}
/*删除组织机构权限*/
export function delCorporationPermission(obj) {
    return request({
        url: 'user-service/corporation/'+obj.corporationId+'/permission/'+obj.permission,
        method: 'DELETE'
    })
}
/*新增组织机构权限*/
export function addCorporationPermission(obj) {
    return request({
        url: 'user-service/corporation/permission',
        method: 'post',
        data: {corporationPermissionInfo:JSON.stringify(obj)}
    })
}