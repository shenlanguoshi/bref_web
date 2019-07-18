import request from '@/router/axios'
import {filterParams} from "@/util/util";

/*查询区域树*/
export function getIndustryCategory(obj) {
    return request({
        url: 'user-service/industryCategory',
        method: 'get',
    })
}


/*新增区域*/
export function addIndustryCategory(name,parentId,parentIds) {
    return request({
        url: 'user-service/industryCategory',
        method: 'post',
        data: {industryCategoryInfo:JSON.stringify({
                name,
                parentId,
                parentIds
            })}
    })
}
/*修改区域信息*/
export function putIndustryCategory(id,name,parentId) {
    return request({
        url: 'user-service/industryCategory/' + id,
        method: 'put',
        data: {
            industryCategoryInfo:JSON.stringify({
                name,
                parentId
            })
        }
    })
}
/*删除区域*/

export function delIndustryCategory(id) {
    return request({
        url: 'user-service/industryCategory/'+id ,
        method: 'DELETE',
    })
}