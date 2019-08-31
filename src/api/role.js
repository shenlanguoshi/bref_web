import request from '@/plugin/axios'
/*分页搜索权限列表*/
export function getPermission(obj) {
    return request({
        url: 'user-service/permission/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/'+'{"name":"'+obj.searchParam.name+'"}',
        method: 'get',
    })
}
/*修改权限信息*/
export function putPermission(obj) {
    return request({
        url: '/user-service/permission/' + obj.id,
        method: 'put',
        data: {
            permissionInfo:JSON.stringify(obj)
        }
    })
}
/*新增权限*/
export function addPermission(obj) {
    return request({
        url: 'user-service/permission',
        method: 'post',
        data: {permissionInfo:JSON.stringify(obj)}
    })
}
/*删除权限*/
export function delPermission(obj) {
    return request({
        url: 'user-service/permission/'+obj ,
        method: 'DELETE',
    })
}

/*查询权限-用户*/
export function getPermissionUser(obj) {
    return request({
        url: 'user-service/permission/'+obj+'/user',
        method: 'get',
    })
}
/*删除权限-用户*/
export function delPermissionUser(obj) {
    return request({
        url: 'user-service/permission/'+obj.id +'/user/'+obj.userId,
        method: 'DELETE',
    })
}
/*新增权限-用户*/
export function addPermissionUser(obj) {
    return request({
        url: 'user-service/permission/user',
        method: 'post',
        data: {permissionUserInfo:JSON.stringify(obj)}
    })
}
/*查询权限-组织机构*/
export function getPermissionCor(obj) {
    return request({
        url: 'user-service/permission/'+obj+'/corporation',
        method: 'get',
    })
}
/*删除权限-组织机构*/
export function delPermissionCor(obj) {
    return request({
        url: 'user-service/permission/'+obj.id +'/corporation/'+obj.userId,
        method: 'DELETE',
    })
}
/*新增权限-组织机构*/
export function addPermissionCor(obj) {
    return request({
        url: 'user-service/permission/corporation',
        method: 'post',
        data: {permissionCorporationInfo:JSON.stringify(obj)}
    })
}

/*查询权限-岗位*/
export function getPermissionCorWork(obj) {
    return request({
        url: 'user-service/permission/'+obj+'/corporationWork',
        method: 'get',
    })
}
/*删除权限-岗位*/
export function delPermissionCorWork(permissionId,corporationWorkId) {
    return request({
        url: 'user-service/permission/'+permissionId +'/corporationWork/'+corporationWorkId,
        method: 'DELETE',
    })
}

/*新增权限-岗位*/
export function addPermissionCorWork(permissionId,corporationWorkId) {
    return request({
        url: 'user-service/permission/corporationWork',
        method: 'post',
        data: {permissionCorporationWorkInfo:JSON.stringify({
                permissionId,
                corporationWorkId
            })}
    })
}

/*查询权限-职务*/
export function getPermissionJobPosition(obj) {
    return request({
        url: 'user-service/permission/'+obj+'/jobPosition',
        method: 'get',
    })
}
/*删除权限-职务*/
export function delPermissionJobPosition(permissionId,jobPositionId) {
    return request({
        url: 'user-service/permission/'+permissionId +'/jobPosition/'+jobPositionId,
        method: 'DELETE',
    })
}
/*新增权限-职务*/
export function addPermissionJobPosition(permissionId,jobPositionId) {
    return request({
        url: 'user-service/permission/jobPosition',
        method: 'post',
        data: {permissionJobPositionInfo:JSON.stringify({
                permissionId,
                jobPositionId
            })}
    })
}

/*查询权限-模块*/
export function getPermissionModule(obj) {
    return request({
        url: 'user-service/permission/'+obj+'/module',
        method: 'get',
    })
}

/*删除权限-模块*/
export function delPermissionModule(permissionId,moduleId) {
    return request({
        url: 'user-service/permission/'+permissionId +'/module/'+moduleId,
        method: 'DELETE',
    })
}
/*新增权限-模块*/
export function addPermissionModule(permissionId,moduleId) {
    return request({
        url: 'user-service/permission/module',
        method: 'post',
        data: {permissionModuleInfo:JSON.stringify({
                permissionId,
                moduleId
            })}
    })
}

/*查询权限-数据权限-行*/
export function getPermissionDataScope(permissionId) {
    return request({
        url: 'user-service/permission/'+permissionId+'/dataScope',
        method: 'get',
    })
}

/*删除权限-数据权限-行*/
export function delPermissionDataScope(permissionId,dataScopeId) {
    return request({
        url: 'user-service/permission/'+permissionId +'/dataScope/'+dataScopeId,
        method: 'DELETE',
    })
}
/*新增权限-数据权限-行*/
export function addPermissionDataScope(permissionId,dataScopeId) {
    return request({
        url: 'user-service/permission/dataScope',
        method: 'post',
        data: {permissionDataScopeInfo:JSON.stringify({
                permissionId,
                dataScopeId
            })}
    })
}

/*查询权限-数据权限-列*/
export function getPermissionDataSchema(permissionId) {
    return request({
        url: 'user-service/permission/'+permissionId+'/dataSchema',
        method: 'get',
    })
}

/*删除权限-数据权限-列*/
export function delPermissionDataSchema(permissionId,dataSchemaId) {
    return request({
        url: 'user-service/permission/'+permissionId +'/dataSchema/'+dataSchemaId,
        method: 'DELETE',
    })
}
/*新增权限-数据权限-列*/
export function addPermissionDataSchema(permissionId,dataSchemaId) {
    return request({
        url: 'user-service/permission/dataSchema',
        method: 'post',
        data: {permissionDataSchemaInfo:JSON.stringify({
                permissionId,
                dataSchemaId
            })}
    })
}