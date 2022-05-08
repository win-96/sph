/* 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。
如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
 */
// 路由配置信息
export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/center',
    component: () => import('@/pages/Center/index'),
    meta: {
      show: true
    },
    // 二级路由组件
    children: [
      {
        path: 'myOrder',
        component: () => import('@/pages/Center/myOrder/index')
      },
      {
        path: 'groupOrder',
        component: () => import('@/pages/Center/groupOrder/index')
      },
      {
        path: '/center',
        redirect: '/center/myorder'
      }
    ]
  },
  {
    path: '/paysuccess',
    component: () => import('@/pages/PaySuccess/index'),
    meta: {
      show: true
    }
  },
  {
    path: '/pay',
    component: () => import('@/pages/Pay/index'),
    meta: {
      show: true
    },
    beforeEnter: (to, from, next) => {
      if (from.path == '/trade') {
        next()
      } else {
        next(false)
      }
    }
  },
  {
    path: '/trade',
    component: () => import('@/pages/Trade/index'),
    meta: {
      show: true
    },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      // 去交易页面,必须是从购物车而来
      if (from.path == '/shopcart') {
        next()
      } else {
        // 其他的路由组件而来,停留在当前
        next(false)
      }
    }
  },
  {
    path: '/shopcart',
    component: () => import('@/pages/ShopCart/index'),
    meta: {
      show: true
    }
  },
  {
    path: '/addcartsuccess',
    name: 'addcartsuccess',
    component: () => import('@/pages/AddCartSuccess/index'),
    meta: {
      show: true
    }
  },
  {
    path: '/detail/:skuid?',
    component: () => import('@/pages/Detail/index'),
    meta: {
      show: true
    }
  },
  {
    path: '/home',
    component: () => import('@/pages/Home/index'),
    meta: {
      show: true
    }
  },
  {
    name: 'search',
    path: '/search/:keyword?',
    component: () => import('@/pages/Search/index'),
    meta: {
      show: true
    },

    // 路由组件能不能传递props数据？
    // 布尔值写法：params
    // props: true,
    // 对象写法：额外的给路由组件传递一些props
    // props: { a: 1, b: 2 },
    // 函数写法：可以params参数、query参数，通过props传递给路由组件
    props: (route) => ({ keyword3: route.params.keyword })
  },
  {
    path: '/login',
    component: () => import('@/pages/Login/index'),
    meta: {
      show: false
    }
  },
  {
    path: '/register',
    component: () => import('@/pages/Register/index'),
    meta: {
      show: false
    }
  },
  {
    path: '/communication',
    redirect: '/communication/event',
    component: () => import('@/pages/Communication/Communication'),
    children: [
      {
        path: 'event',
        component: () => import('@/pages/Communication/EventTest/EventTest'),
        meta: {
          isHideFooter: true
        }
      },
      {
        path: 'model',
        component: () => import('@/pages/Communication/ModelTest/ModelTest'),
        meta: {
          isHideFooter: true
        }
      },
      {
        path: 'sync',
        component: () => import('@/pages/Communication/SyncTest/SyncTest'),
        meta: {
          isHideFooter: true
        }
      },
      {
        path: 'attrs-listeners',
        component: () => import('@/pages/Communication/AttrsListenersTest/AttrsListenersTest'),
        meta: {
          isHideFooter: true
        }
      },
      {
        path: 'children-parent',
        component: () => import('@/pages/Communication/ChildrenParentTest/ChildrenParentTest'),
        meta: {
          isHideFooter: true
        }
      },
      {
        path: 'scope-slot',
        component: () => import('@/pages/Communication/ScopeSlotTest/ScopeSlotTest'),
        meta: {
          isHideFooter: true
        }
      }
    ]
  }
]
