<template>
  <div>
    <!-- 三级联动全局组件，三级联动已经注册为全局组件，因此不需要在引入 -->
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <!-- Floor这个组件：自己在组件内部是没有发请求的，数据是父组件给的 -->
    <Floor v-for="(floor, index) in floorList" :key="floor.id" :list="floor"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
// 引入其余的组件
import ListContainer from '@/pages/Home/ListContainer/index.vue'
import Recommend from '@/pages/Home/Recommend/index'
import Rank from '@/pages/Home/Rank/index'
import Like from '@/pages/Home/Like/index'
import Floor from '@/pages/Home/Floor/index'
import Brand from '@/pages/Home/Brand/index'

import { mapState } from 'vuex'
export default {
  name: '',
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  mounted() {
    // 派发action，获取floor组件的数据
    this.$store.dispatch('getFloorList')
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList
    })
  }
}
</script>

<style scoped lang="less"></style>
