// 配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
//
import routes from '@/router/routes'
// 使用插件
Vue.use(VueRouter)
// 引入store
import store from '@/store/index'

// 先把VueRouter原型对象的push，先保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

// 重写push|replace
// 第一个参数：告诉原来的push方法，你往哪里跳转（传递那些参数）
// 第二个参数: 成功回调
// 第三个参数: 失败的回调
// call || apply区别
// 相同点：都可以调用函数一次， 都可以篡改函数的上下文一次
// 不同点： call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && resolve) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}
// 配置路由
let router = new VueRouter({
  // 配置路由
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 返回的这个y等于0，代表的滚动条在最上方
    return { y: 0 }
  }
})
// 全局守卫:前置守卫(在路由跳转之前进行判断)
router.beforeEach(async (to, from, next) => {
  // to:可以获取到你要跳转到那个路由信息
  // from:可以获取到你从那个路由而来的信息
  // next:放行函数 next()放行 next(path)放行到指定路径 next(false)
  // next()
  // 用户登陆了,才会有token,未登录一定不会有token
  let token = store.state.user.token
  // 用户信息
  let name = store.state.user.userInfo.name
  // 用户已经登录了
  if (token) {
    // 用户登录了还想去login休想
    if (to.path == '/login' || to.path == '/register') {
      next('/home')
    } else {
      // 登录,去的不是login[home|search|detail|shopcart]
      // 如果用户名已有
      if (name) {
        next()
      } else {
        // 没有用户信息,派发action仓库储存用户信息在跳转
        try {
          // 获取用户信息成功
          await store.dispatch('getUserInfo')
          // 放行
          next()
        } catch (error) {
          // token失效了获取不到用户信息,从新登录
          // 清除token
          await store.dispatch('userLogout')
          next('/login')
        }
      }
    }
  } else {
    // 未登录:不能去交易相关,不能去支付相关[pay|paysuccess],不能去个人中心
    // 未登录去上面这些路由-----登录
    let toPath = to.path
    if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
      next('/login?redirect=' + toPath)
    } else {
      // 去的不是上面这些路由(home|search|shopCart)---放行
      next()
    }
  }
})

export default router
