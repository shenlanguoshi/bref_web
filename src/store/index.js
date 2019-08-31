import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        loading:false, // 加载状态
    },
  modules: {
    d2admin
  }
})
