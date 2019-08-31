import request from '@/plugin/axios';
import util from "@/libs/util";

/*分页搜索数据权限-列列表*/
export function getDataSchema(obj) {
    return request({
        url: 'user-service/dataSchema/{"pageNo":"'+obj.pageNo+'","pageSize":"'+obj.pageSize+'"}/' +JSON.stringify(util.filterParams({
            entry:obj.searchParam.entry,
            priority:obj.searchParam.priority,
            name:obj.searchParam.name,
        })),
        method: 'get',
    })
}

/*新增数据权限-列*/
export function addDataSchema(obj) {
    return request({
        url: 'user-service/dataSchema',
        method: 'post',
        data: {dataSchemaInfo:JSON.stringify({
                entry:obj.entry,
                priority:obj.priority,
                name:obj.name,
                dataSchema:obj.dataSchema
            })}
    })
}
/*修改数据权限-列信息*/
export function putDataSchema(obj) {
    return request({
        url: '/user-service/dataSchema/' + obj.id,
        method: 'put',
        data: {dataSchemaInfo:JSON.stringify({
                entry:obj.entry,
                priority:obj.priority,
                name:obj.name,
                dataSchema:obj.dataSchema
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