import request from '@/router/axios';
import {filterParams} from "@/util/util";
/*分页搜索数据权限-行列表*/
export function getDataScope(obj) {
    return request({
        url: 'user-service/dataScope/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/' +JSON.stringify(filterParams({
            entry:obj.entry,
            priority:obj.priority,
            name:obj.name,
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
export function addDataScope(entry,priority,name,corporationId) {
    return request({
        url: 'user-service/dataScope',
        method: 'post',
        data: {dataScopeInfo:JSON.stringify({
                entry,
                priority,
                name,
                corporationId
            })}
    })
}
/*修改数据权限-行信息*/
export function putDataScope(id,entry,priority,name,corporationId) {
    return request({
        url: '/user-service/dataScope/' + id,
        method: 'put',
        data: { dataScopeInfo:JSON.stringify({
                entry,
                priority,
                name,
                corporationId
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
        url: 'user-service/dataScopeItem/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/' +JSON.stringify(filterParams({
            entry:obj.entry,
            priority:obj.priority,
            dataScopeId:obj.dataScopeId,
            name:obj.name,
        })),
        method: 'get',
    })
}
/*修改数据权限-行项目信息*/
export function putDataScopeItem(id,dataScopeId,columnName,operator,dataScope) {
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