import request from '@/router/axios'
import {filterParams} from "@/util/util";

/*分页查询区域电表*/
export function getData(obj) {
    return request({
        url: '/electricmeter-service/electricmeter/region/'+obj.id,
        method: 'get',
        params: {
            pageParam:JSON.stringify({
                pageNo: obj.pageNo,
                pageSize: obj.pageSize
            })
        }
    })
}

/*查询电表实时数据*/
export function getrealTimeData(obj) {
    return request({
        url: '/electricmeter-service/electricmeter/productKey/'+obj.productKey+'/deviceName/'+obj.deviceName+'/realTimeData',
        method: 'get',
    })
}

/*查询某个电表详情*/
export function getrealOne(obj) {
    return request({
        url: '/electricmeter-service/electricmeter/productKey/'+obj.productKey+'/deviceName/'+obj.deviceName,
        method: 'get',
    })
}

/*查询电表历史数据*/
export function gethistroyData(obj) {
    return request({
        url: '/electricmeter-service/electricmeter/productKey/'+obj.productKey+'/deviceName/'+obj.deviceName+'/historyData',
        method: 'get',
        params: {
            queryParam:JSON.stringify({
                beginTime: obj.beginTime,
                endTime: obj.endTime
            })
        }
    })
}
/*查询电表漏电告警数据*/
export function getLog(obj) {
    return request({
        url: '/electricmeter-service/electricmeter/productKey/'+obj.productKey+'/deviceName/'+obj.deviceName+"/notificationData/l",
        method: 'get',
        params: {
            pageParam:JSON.stringify({
                pageNo: obj.pageNo,
                pageSize: obj.pageSize
            }),
            queryParam:JSON.stringify({
                beginTime: obj.beginTime,
                endTime: obj.endTime
            })
        }
    })
}