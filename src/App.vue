<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 在 Home Search 显示的, 在登录,注册隐藏 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
// 引入
import Header from '@/components/Header/index'
import Footer from '@/components/Footer/index'
export default {
  name: 'App',

  components: {
    Header,
    Footer
  },
  mounted() {
    // 派发action
    // 通知Vuex发请求，获取数据，存储与仓库当中
    // 派发一个action||获取商品分类的三级列表的数据
    this.$store.dispatch('categoryList')
  }
}
</script>

<style></style>
