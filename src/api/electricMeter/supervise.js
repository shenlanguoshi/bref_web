import request from '@/router/axios'
import {filterParams} from "@/util/util";

/*删除电表*/
export function delSupervise(obj) {
    return request({
        url: 'electricmeter-service/electricmeter/'+obj,
        method: 'DELETE',
    })
}

/*注册电表（新增电表）*/
export function addSupervise(obj) {
    return request({
        url: 'electricmeter-service/electricmeter',
        method: 'post',
        data: {
            electricMeterInfo:JSON.stringify({
                productKey: obj.productKey,
                deviceName: obj.deviceName,
                deviceSecret: obj.deviceSecret,
                name: obj.name,
                regionId: obj.regionId,
                corporationId: obj.corporationId,
                industryCategoryIds: obj.industryCategoryIds
            })
        }
    })
}

/*修改电表信息*/
export function putSupervise(obj) {
    return request({
        url: '/electricmeter-service/electricmeter/' + obj.id,
        method: 'put',
        data: {
            electricMeterInfo:JSON.stringify({
                name:obj.name
            })
        }
    })
}
