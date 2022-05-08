import Vue from 'vue'
import Vuex from 'vuex'
// 需要使用插件一次
Vue.use(Vuex)
// 引入小仓库
import home from './home'
import search from './search'
import detail from '@/store/detail/detail'
import shopCart from '@/store/shopCart/shopCart'
import user from '@/store/user/user'
import trade from '@/store/trade/trade'
// 对外暴露store类的一个实例
export default new Vuex.Store({
  //  实现Vuex仓库模块开发存储数据
  modules: {
    home,
    search,
    detail,
    shopCart,
    user,
    trade
  }
})
