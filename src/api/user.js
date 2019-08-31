import request from '@/plugin/axios'

export function fetchList(query) {
  return request({
    url: '/user-service/user/{"pageNo":"'+query.pageNo+'","pageSize":"'+query.pageSize+'"}/{"username":"'+(query.searchParam.username || "")+'"}',
    method: 'get',
  })
}

export function registerUser(state){
    return request({
        url: '/user-service/user',
        method: 'post',
        data: {
            userInfo:JSON.stringify({
                username: state.username,
                password:state.password,
            })
        }
    })
}

export function addObj(obj) {
  return request({
    url: '/admin/user/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/user-service/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/user-service/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/user-service/user/' + obj.id,
    method: 'put',
    data: {
        userInfo:JSON.stringify({
            password:obj.password
        })
    }
  })
}

/*用户的组织机构*/
export function corporation(obj) {
    return request({
        url: 'user-service/user/'+obj+'/corporation',
        method: 'get',
    })
}
/*删除用户的组织机构*/
export function delCorporation(obj) {
    return request({
        url: 'user-service/user/'+obj.userId+'/corporation/'+obj.corporationId,
        method: 'DELETE',
    })
}
/*添加用户的组织机构*/
export function addCorporation(obj) {
    return request({
        url: 'user-service/user/corporation',
        method: 'POST',
        data: obj
    })
}


/*用户的岗位*/
export function quarters(obj) {
    return request({
        url: 'user-service/user/'+obj+'/corporationWork',
        method: 'get',
    })
}
/*删除用户的岗位*/
export function delQuarters(obj) {
    return request({
        url: 'user-service/user/'+obj.userId+'/corporationWork/'+obj.corporationWorkId,
        method: 'DELETE',
    })
}
/*添加用户的岗位*/
export function addQuarters(obj) {
    return request({
        url: 'user-service/user/corporationWork',
        method: 'POST',
        data: obj
    })
}

/*查询用户的职务*/
export function job(obj) {
    return request({
        url: 'user-service/user/'+obj+'/jobPosition',
        method: 'get',
    })
}
/*删除用户的职务*/
export function delJob(obj) {
    return request({
        url: 'user-service/user/'+obj.userId+'/jobPosition/'+obj.jobPositionId,
        method: 'DELETE',
    })
}
/*新增用户的职务*/
export function addJob(obj) {
    return request({
        url: 'user-service/user/jobPosition',
        method: 'POST',
        data: obj
    })
}

/*查询用户的权限*/
export function authority(obj) {
    return request({
        url: 'user-service/user/'+obj+'/permission',
        method: 'get',
    })
}
/*删除用户的权限*/
export function delAuthority(obj) {
    return request({
        url: 'user-service/user/'+obj.userId+'/permission/'+obj.permissionId,
        method: 'DELETE',
    })
}
/*新增用户的权限*/
export function addAuthority(obj) {
    return request({
        url: 'user-service/user/permission',
        method: 'POST',
        data: obj
    })
}

/*查询已登录用户
*/
export function getListToken(obj) {
    return request({
        url: 'auth/listToken',
        method: 'get',
    })
}