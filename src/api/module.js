import request from '@/router/axios'
import {filterParams} from "@/util/util";

/*分页搜索模块列表*/
export function getModulen(obj) {
    return request({
        url: 'user-service/module/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/'+JSON.stringify(filterParams(obj)),
        method: 'get',
    })
}

/*查询模块树*/
export function getModulenTree(obj) {
    return request({
        url: 'user-service/module',
        method: 'get',
    })
}
/*修改模块*/
export function putModulen(id,title,parentId,uri,icon,sort,menu,controls) {
    return request({
        url: '/user-service/module/' + id,
        method: 'put',
        data: {
            moduleInfo:JSON.stringify(filterParams({
                title,
                parentId,
                uri,
                icon,
                sort,
                menu,
                controls
            }))
        }
    })
}
/*新增模块*/
export function addModulen(title,parentId,uri,icon,sort,menu,controls) {
    return request({
        url: 'user-service/module',
        method: 'post',
        data: {moduleInfo:JSON.stringify(filterParams({
                title,
                parentId,
                uri,
                icon,
                sort,
                menu,
                controls
            }))}
    })
}
/*删除模块*/
export function delModulen(obj) {
    return request({
        url: 'user-service/module/'+obj ,
        method: 'DELETE',
    })
}


/*查询模块-权限*/
export function getModulenPermission(obj) {
    return request({
        url: 'user-service/module/'+obj+'/permission',
        method: 'get',
    })
}

/*删除模块-权限*/
export function delModulenPermission(moduleId,permissionId) {
    return request({
        url: 'user-service/module/'+moduleId+'/permission/'+permissionId ,
        method: 'DELETE',
    })
}

/*新增模块-权限*/
export function addModulenPermission(moduleId,permissionId,) {
    return request({
        url: 'user-service/module/permission',
        method: 'post',
        data: {modulePermissionInfo:JSON.stringify({
                moduleId,
                permissionId,
            })}
    })
}