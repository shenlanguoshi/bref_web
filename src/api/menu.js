import request from '@/router/axios'
export function GetMenu() {
  return request({
    url: '/user-service/me',
    method: 'get'
  });
   /* return new Promise((resolve, reject) => {
        resolve({ data:
                [
                    {
                        "id":1,
                        "parentId":-1,
                        "keepAlive": "0",
                        "children":[
                              {
                                  "id":2,
                                  "parentId":1,
                                  "children":[],
                                  "icon":"icon-yonghuguanli",
                                  "name":"用户管理",
                                  "spread":false,
                                  "keepAlive": "0",
                                  "path":"user",
                                  "component":"views/admin/user/index",
                                  "authority":null,
                                  "redirect":null,
                                  "code":null,
                                  "type":"0",
                                  "label":"用户管理",
                                  "sort":2},
                              {"id":3,"parentId":1,"children":[],"icon":"icon-caidanguanli","name":"组织机构","spread":false,"keepAlive": "0","path":"corporation","component":"views/admin/corporation/index","authority":null,"redirect":null,"code":null,"type":"0","label":"组织机构","sort":3},
                              {"id":4,"parentId":1,"children":[],"icon":"icon-zygl","name":"岗位","spread":false,"keepAlive": "0","path":"corporationWork","component":"views/admin/corporationWork/index","authority":null,"redirect":null,"code":null,"type":"0","label":"岗位","sort":4},
                              {"id":5,"parentId":1,"children":[],"icon":"icon-rizhiguanli","name":"职务","spread":false,"keepAlive": "0","path":"jobPosition","component":"views/admin/jobPosition/index","authority":null,"redirect":null,"code":null,"type":"0","label":"职务","sort":5},
                            //{"id":4,"parentId":1,"children":[],"icon":"icon-jiaoseguanli","name":"角色管理","spread":false,"path":"role","component":"views/admin/role/index","authority":null,"redirect":null,"code":null,"type":"0","label":"角色管理","sort":4},
                             /!* {"id":5,"parentId":1,"children":[],"icon":"icon-rizhiguanli","name":"日志管理","spread":false,"path":"log","component":"views/admin/log/index","authority":null,"redirect":null,"code":null,"type":"0","label":"日志管理","sort":5},
                              {"id":6,"parentId":1,"children":[],"icon":"icon-zygl","name":"字典管理","spread":false,"path":"dict","component":"views/admin/dict/index","authority":null,"redirect":null,"code":null,"type":"0","label":"字典管理","sort":6},
                              {"id":7,"parentId":1,"children":[],"icon":"icon-iconbmgl","name":"部门管理","spread":false,"path":"dept","component":"views/admin/dept/index","authority":null,"redirect":null,"code":null,"type":"0","label":"部门管理","sort":7},
                              {"id":9,"parentId":1,"children":[],"icon":"icon-weibiaoti46","name":"代码生成","spread":false,"path":"gen","component":"views/admin/gen/index","authority":null,"redirect":null,"code":null,"type":"0","label":"代码生成","sort":8},
                              {"id":8,"parentId":1,"children":[],"icon":"icon-bangzhushouji","name":"终端管理","spread":false,"path":"client","component":"views/admin/client/index","authority":null,"redirect":null,"code":null,"type":"0","label":"终端管理","sort":9},
                              {"id":10,"parentId":1,"children":[],"icon":"icon-miyue","name":"密钥管理","spread":false,"path":"social","component":"views/admin/social/index","authority":null,"redirect":null,"code":null,"type":"0","label":"密钥管理","sort":10},
                              {"id":14,"parentId":1,"children":[],"icon":"icon-denglvlingpai","name":"令牌管理","spread":false,"path":"token","component":"views/admin/token/index","authority":null,"redirect":null,"code":null,"type":"0","label":"令牌管理","sort":11}*!/
                            ],
                        "icon":"icon-xitongguanli",
                        "name":"系统管理",
                        "spread":false,
                        "path":"/admin",
                        "component":"Layout",
                        "authority":null,
                        "redirect":null,
                        "code":null,
                        "type":"0",
                        "label":"系统管理",
                        "sort":1
                    },
                    {"id":70,"parentId":-1,"children":[
                            {"id":71,"parentId":70,"children":[],"icon":"icon-rizhiguanli","name":"权限","spread":false,"keepAlive": "0","path":"index","component":"views/admin/permission/index","authority":null,"redirect":null,"code":null,"type":"0","label":"权限","sort":71},
                            {"id":72,"parentId":70,"children":[],"icon":"icon-weibiaoti13","name":"模块","spread":false,"keepAlive": "0","path":"module","component":"views/admin/permission/module/index","authority":null,"redirect":null,"code":null,"type":"0","label":"模块","sort":72},
                            {"id":73,"parentId":70,"children":[],"icon":"icon-web-icon-","name":"模块树","spread":false,"keepAlive": "0","path":"moduleTree","component":"views/admin/permission/module/treeIndex","authority":null,"redirect":null,"code":null,"type":"0","label":"模块树","sort":73},
                            {"id":74,"parentId":70,"children":[],"icon":"icon-rizhiguanli","name":"数据权限-行","spread":false,"keepAlive": "0","path":"dataScope","component":"views/admin/permission/dataScope/index","authority":null,"redirect":null,"code":null,"type":"0","label":"数据权限-行","sort":74},
                            {"id":75,"parentId":70,"children":[],"icon":"icon-rizhiguanli","name":"数据权限-列","spread":false,"keepAlive": "0","path":"dataSchema","component":"views/admin/permission/dataSchema/index","authority":null,"redirect":null,"code":null,"type":"0","label":"数据权限-列","sort":75},
                        ],"icon":"icon-denglvlingpai","name":"权限管理","spread":false,"path":"/permission","component":"Layout","keepAlive": "0","authority":null,"redirect":null,"code":null,"type":"0","label":"权限管理","sort":4},
                  /!*{"id":80,"parentId":-1,"children":[],
                        "icon":"icon-iconset0216","name":"表单设计器","spread":false,
                        "path":"/form","component":"views/form/index",
                        "keepAlive": "0","authority":null,
                        "redirect":null,"code":null,"type":"0","label":"表单设计器","sort":5
                    }*!/
                    /!*{"id":100,"parentId":-1,
                        "children":[
                            {"id":101,"parentId":100,"children":[],"icon":"icon-jiankong","name":"服务监控","spread":false,"path":"http://139.224.200.249:15001","component":null,"authority":null,"redirect":null,"code":null,"type":"0","label":"服务监控","sort":0},
                            {"id":102,"parentId":100,"children":[],"icon":"icon-wendangdocument72","name":"接口文档","spread":false,"path":"http://139.224.200.249:19999/swagger-ui.html","component":null,"authority":null,"redirect":null,"code":null,"type":"0","label":"接口文档","sort":1},
                            {"id":105,"parentId":100,"children":[],"icon":"icon-gtsquanjushiwufuwuGTS","name":"事务监控","spread":false,"path":"tx","component":"views/admin/tx/index","authority":null,"redirect":null,"code":null,"type":"0","label":"事务监控","sort":5},
                            {"id":106,"parentId":100,"children":[],"icon":"icon-online","name":"在线事务","spread":false,"path":"model","component":"views/admin/tx/model","authority":null,"redirect":null,"code":null,"type":"0","label":"在线事务","sort":6},
                            {"id":103,"parentId":100,"children":[],"icon":"icon-msnui-supervise","name":"任务监控","spread":false,"path":"http://139.224.200.249:8899","component":null,"authority":null,"redirect":null,"code":null,"type":"0","label":"任务监控","sort":7},
                            {"id":110,"parentId":100,"children":[],"icon":"icon-guiji","name":"任务轨迹","spread":false,"path":"statustracelog","component":"views/daemon/statustracelog/index","authority":null,"redirect":null,"code":null,"type":"0","label":"任务轨迹","sort":8},
                            {"id":112,"parentId":100,"children":[],"icon":"icon-xiazaihuancun","name":"调用拓扑","spread":false,"path":"http://139.224.200.249:8081","component":null,"authority":null,"redirect":null,"code":null,"type":"0","label":"调用拓扑","sort":10},
                            {"id":113,"parentId":100,"children":[],"icon":"icon-ecs-status","name":"缓存状态","spread":false,"path":"http://139.224.200.249:8585","component":null,"authority":null,"redirect":null,"code":null,"type":"0","label":"缓存状态","sort":12}
                            ],"icon":"icon-iconbmgl","name":"系统监控","spread":false,"path":"/daemon","component":"Layout","authority":null,"redirect":null,"code":null,"type":"0","label":"系统监控","sort":2},
                    {"id":20,"parentId":-1,
                        "children":[
                            {"id":21,"parentId":20,
                                "children":[
                                    {"id":40,"parentId":21,"children":[],"icon":"icon-caidanguanli","name":"二级菜单","spread":false,"path":"index","component":"views/crud/index","authority":null,"redirect":null,"code":null,"type":"0","label":"二级菜单","sort":1}
                                ],"icon":"icon-caidanguanli","name":"一级菜单","spread":false,"path":"index","component":"Layout","authority":null,"redirect":null,"code":null,"type":"0","label":"一级菜单","sort":1}
                        ],"icon":"icon-caidanguanli","name":"多级菜单","spread":false,"path":"/crud","component":"Layout","authority":null,"redirect":null,"code":null,"type":"0","label":"多级菜单","sort":3}
                        *!/
                ]
             });
    })*/
}
export function fetchTree(query) {
  return request({
    url: '/admin/menu/allTree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/menu/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/menu/',
    method: 'put',
    data: obj
  })
}
