import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { AccountLogin ,Getusermenu} from '@api/sys.login'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({ dispatch }, {
      username = '',
      password = ''
    } = {}) {
      return new Promise((resolve, reject) => {
          // 开始请求登录接口

         /* util.cookies.set('uuid', "admin")
          util.cookies.set('token', "bearer 5b183565-70d7-4c88-89d0-c8d6660fb2a6")
           dispatch('load')
          // 结束
          resolve()
          return*/
          AccountLogin({
              username,
              password,
              grant_type: "password",
              scope: "server",
              client_id: "test",
              client_secret: "test",
          })
              .then(async res => {
                  // 设置 cookie 一定要存 uuid 和 token 两个 cookie
                  // 整个系统依赖这两个数据进行校验和存储
                  // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
                  // token 代表用户当前登录状态 建议在网络请求中携带 token
                  // 如有必要 token 需要定时更新，默认保存一天
                  util.cookies.set('uuid', username)
                  util.cookies.set('token', res.token_type +" "+ res.access_token)
                  // 设置 vuex 用户信息
                  await dispatch('d2admin/user/set', {
                      username: username
                  }, { root: true })
                  // 用户登录后从持久化数据加载一系列的设置
                  await dispatch('load')
                  // 结束
                  resolve()
              })
              .catch(err => {
                  reject(err)
              })
      })
    },
        /*
        * 获取用户菜单信息
        *
        * */
      getusermenu ({ state, dispatch }) {

          //[{"icon":"icon-iframe","component":"views/admin/user/infoOld","title":"个人资料","path":"/info"},{"icon":"icon-quanxianguanli","component":"views/admin/user/index","title":"用户管理","path":"/user","children":[]},{"icon":"icon-caidanguanli","component":"views/admin/corporation/index","title":"组织机构管理","path":"/corporation","children":[]},{"icon":"icon-qingchuhuancun","component":"views/admin/corporationWork/index","title":"岗位管理","path":"/corporationWork","children":[]},{"icon":"icon-gtsquanjushiwufuwuGTS","component":"views/admin/jobPosition/index","title":"职务管理","path":"/jobPosition","children":[]},{"icon":"icon-denglvlingpai","component":"Layout","title":"权限管理","path":"/permission","children":[{"icon":"icon-wxbgongju","component":"views/admin/permission/index","title":"权限","path":"index"},{"icon":"icon-web-icon-","component":"views/admin/permission/module/treeIndex","title":"模块管理","path":"moduleTree/index","children":[]},{"icon":"icon-yanzhengma","component":"views/admin/permission/dataScope/index","title":"数据权限-行","path":"dataScope","children":[]},{"icon":"icon-tubiao","component":"views/admin/permission/dataSchema/index","title":"数据权限-列","path":"dataSchema","children":[]}]}]

          return new Promise((resolve, reject) => {
              Getusermenu().then(async res => {
                  let info={
                      enabled:res.data.enabled,
                      id:res.data.id,
                      username:res.data.username,
                  };
                  state.info = info;
                  // 持久化
                  await dispatch('d2admin/user/set',info , { root: true })

                  await dispatch('d2admin/menu/asideSet',res.data.menu , { root: true })
                  // end
                  resolve(res)
              }).catch(err => {
                  reject(err)
              })


          })
      },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true });
        //菜单
        await dispatch('d2admin/menu/asideSet', [], { root: true });

        //选项卡
       // await dispatch('d2admin/page/closeAllOut');

        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '取消注销操作'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
