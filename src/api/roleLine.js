import request from '@/plugin/axios';
import util from "@/libs/util";
/*分页搜索数据权限-行列表*/
export function getDataScope(obj) {
    return request({
        url: 'user-service/dataScope/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/' +JSON.stringify(util.filterParams({
            entry:obj.searchParam.entry,
            priority:obj.searchParam.priority,
            name:obj.searchParam.name,
        })),
        method: 'get',
    })
}


/*获取标识*/
export function getDataScopeJson(obj) {
    return request({
        url: 'user-service/dataScope/Json',
        method: 'get',
    })
}
/*新增数据权限-行*/
export function addDataScope(obj) {
    return request({
        url: 'user-service/dataScope',
        method: 'post',
        data: {dataScopeInfo:JSON.stringify({
                entry:obj.entry,
                priority:obj.priority,
                name:obj.name,
                corporationId:obj.corporationId
            })}
    })
}
/*修改数据权限-行信息*/
export function putDataScope(obj) {
    return request({
        url: '/user-service/dataScope/' + obj.id,
        method: 'put',
        data: { dataScopeInfo:JSON.stringify({
                entry:obj.entry,
                priority:obj.priority,
                name:obj.name,
                corporationId:obj.corporationId
            })
        }
    })
}
/*删除数据权限-行*/
export function delDataScope(obj) {
    return request({
        url: 'user-service/dataScope/'+obj ,
        method: 'DELETE',
    })
}
/*分页搜索数据权限-行项目列表*/
export function getDataScopeItem(obj) {
    return request({
        url: 'user-service/dataScopeItem/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/' +JSON.stringify(util.filterParams({
            entry:obj.searchParam.entry,
            priority:obj.searchParam.priority,
            dataScopeId:obj.searchParam.dataScopeId,
            name:obj.searchParam.name,
        })),
        method: 'get',
    })
}
/*修改数据权限-行项目信息*/
export function putDataScopeItem(dataScopeId,columnName,operator,dataScope,id) {
    return request({
        url: '/user-service/dataScopeItem/' + id,
        method: 'put',
        data: { dataScopeItemInfo:JSON.stringify({
                dataScopeId,
                columnName,
                operator,
                dataScope
            })
        }
    })
}
/*删除数据权限-行项目*/
export function delDataScopeItem(obj) {
    return request({
        url: 'user-service/dataScopeItem/'+obj ,
        method: 'DELETE',
    })
}
/*新增数据权限-行项目*/
export function addDataScopeItem(dataScopeId,columnName,operator,dataScope) {
    return request({
        url: 'user-service/dataScopeItem',
        method: 'post',
        data: {dataScopeItemInfo:JSON.stringify({
                dataScopeId,
                columnName,
                operator,
                dataScope
            })}
    })
}
/*查询数据权限-行-权限*/
export function getDataScopePermission(dataScopeId) {
    return request({
        url: 'user-service/dataScope/'+dataScopeId+'/permission',
        method: 'get',
    })
}
/*删除数据权限-行-权限*/
export function delDataScopePermission(dataScopeId,permissionId) {
    return request({
        url: 'user-service/dataScope/'+dataScopeId+'/permission/'+permissionId,
        method: 'DELETE',
    })
}
/*新增数据权限-行-权限*/
export function addDataScopePermission(dataScopeId,permissionId) {
    return request({
        url: 'user-service/dataScope/permission',
        method: 'post',
        data: {dataScopePermissionInfo:JSON.stringify({
                dataScopeId,
                permissionId
            })}
    })
}