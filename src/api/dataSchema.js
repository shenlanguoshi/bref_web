import request from '@/router/axios';
import {filterParams} from "@/util/util";

/*分页搜索数据权限-列列表*/
export function getDataSchema(obj) {
    return request({
        url: 'user-service/dataSchema/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/' +JSON.stringify(filterParams({
            entry:obj.entry,
            priority:obj.priority,
            name:obj.name,
        })),
        method: 'get',
    })
}

/*新增数据权限-列*/
export function addDataSchema(entry,priority,name,dataSchema) {
    return request({
        url: 'user-service/dataSchema',
        method: 'post',
        data: {dataSchemaInfo:JSON.stringify({
                entry,
                priority,
                name,
                dataSchema
            })}
    })
}
/*修改数据权限-列信息*/
export function putDataSchema(id,entry,priority,name,dataSchema) {
    return request({
        url: '/user-service/dataSchema/' + id,
        method: 'put',
        data: {dataSchemaInfo:JSON.stringify({
                entry,
                priority,
                name,
                dataSchema
            })
        }
    })
}
/*删除数据权限-列*/
export function delDataSchema(obj) {
    return request({
        url: 'user-service/dataSchema/'+obj ,
        method: 'DELETE',
    })
}

/*查询数据权限-列-权限*/
export function getDataSchemaPermission(dataSchemaId) {
    return request({
        url: 'user-service/dataSchema/'+dataSchemaId+'/permission',
        method: 'get',
    })
}
/*删除数据权限-列-权限*/
export function delDataSchemaPermission(dataSchemaId,permissionId) {
    return request({
        url: 'user-service/dataSchema/'+dataSchemaId+'/permission/'+permissionId,
        method: 'DELETE',
    })
}
/*新增数据权限-列-权限*/
export function addDataSchemaPermission(dataSchemaId,permissionId) {
    return request({
        url: 'user-service/dataSchema/permission',
        method: 'post',
        data: {dataSchemaPermissionInfo:JSON.stringify({
                dataSchemaId,
                permissionId
            })}
    })
}