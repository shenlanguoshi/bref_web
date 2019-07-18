import request from '@/router/axios'
import {filterParams} from "@/util/util";

/*查询区域树*/
export function getRegion(obj) {
    return request({
        url: 'user-service/region',
        method: 'get',
    })
}


/*新增区域*/
export function addRegion(name,parentId,parentIds) {
    return request({
        url: 'user-service/region',
        method: 'post',
        data: {regionInfo:JSON.stringify({
                name,
                parentId,
                parentIds
            })}
    })
}
/*修改区域信息*/
export function putRegion(id,name,parentId) {
    return request({
        url: 'user-service/region/' + id,
        method: 'put',
        data: {
            regionInfo:JSON.stringify({
                name,
                parentId
            })
        }
    })
}
/*删除区域*/

export function delRegion(id) {
    return request({
        url: 'user-service/region/'+id ,
        method: 'DELETE',
    })
}