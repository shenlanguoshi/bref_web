import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    data
  })
}


export function Getusermenu () {
    return request({
        url: '/user-service/me',
        method: 'get',
    })
}

