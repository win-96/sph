<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件的委派|事件的委托 -->
      <div @mouseleave="leaveIndex" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动 -->
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 利用事件委派+编程式导航实现路由的跳转与传递参数 -->
            <div class="all-sort-list2" @click="goSearch">
              <div class="item" v-for="(c1, index) in categoryList" :key="c1.categoryId">
                <h3 :class="{ cur: currentIndex == index }" @mouseenter="changeIndex(index)">
                  <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{ c1.categoryName }} </a>
                </h3>
                <!-- 二级、三级分类 -->
                <div class="item-list clearfix" :style="{ display: currentIndex == index ? 'block' : 'none' }">
                  <div class="subitem">
                    <dl class="fore" v-for="(c2, index) in c1.categoryChild" :key="c2.categoryId">
                      <dt>
                        <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{
                          c2.categoryName
                        }}</a>
                      </dt>
                      <dd>
                        <em v-for="(c3, index) in c2.categoryChild" :key="c3.categoryId">
                          <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{
                            c3.categoryName
                          }}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 这种引入方式：是把lodash全部功能函数引入
import throttle from 'lodash/throttle'

export default {
  name: 'TypeNav',
  data() {
    return {
      // 存储用户鼠标移上那一个一级分类
      currentIndex: -1,
      show: true
    }
  },
  // 发请求经常在mounted生命周期函数中进行
  // 组件挂载完毕：可以向服务器发请求
  mounted() {
    // 当组件挂载完毕,让show属性变为false
    // 如果不是home路由组件,将typeNav进行隐藏
    if (this.$route.path != '/home') {
      this.show = false
    }
  },
  computed: {
    ...mapState({
      // 右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
      // 注入一个参数state，其实即为大仓库中的数据
      categoryList: (state) => state.home.categoryList
    })
  },
  methods: {
    // 鼠标进入修改响应式数据currentIndex属性
    // throttle回调函数比别用箭头函数，可能会出现上下文this
    changeIndex: throttle(function (index) {
      // index：鼠标移上某一个一级分类的元素的索引值
      // 正常情况（用户慢慢的操作）：鼠标进入：每一个一级分类h3，都会触发鼠标进入事件
      // 非正常情况（用户操作很快）：本身全部的一级分类都应该触发鼠标进入事件，但是经过测试，只有部分h3触发了
      // 就是由于用户行为过快，导致浏览器反应不过来。如果当前回调函数中有一些大量的业务，有可能会出现卡顿现象。
      this.currentIndex = index
    }, 20),

    goSearch(event) {
      // 最好的解决方案：编程式导航 + 事件委派
      // 利用事件的委派存在一些问题：1.：点击一定是a链接 2：如何获取参数【1.2.3.级分类的产品的名字、id】
      // 存在一些问题：事件委派，是把全部的子节点【h3、dt、dl、em】的事件委派给父亲节点
      // 点击a标签的时候，才会进行路由跳转【怎么能确定点击的一定是a标签】
      // 存在另一个问题：即使你能确定点击的是a标签，如何区分是一级、二级、三级分类的标签
      let node = event.target
      // 获取到当前出发这个事件的节点【h3、a、dt、dl】,需要带有data-categoryname这样的节点【一定是a标签】
      // 节点有一个属性dataset属性，可以获取节点的自定义属性与属性值
      let { categoryname, category1id, category2id, category3id } = node.dataset
      // 如果标签身上拥有categoryname一定是a标签

      if (categoryname) {
        // 整理路由跳转的参数
        let loction = { name: 'search' }
        let query = { categoryName: categoryname }
        // 一级分类、二级分类、三级分类的a标签
        if (category1id) {
          query.category1Id = category1id
        } else if (category2id) {
          query.category2Id = category2id
        } else {
          query.category3Id = category3id
        }

        // 判断：如果路由跳转的时候，带有params参数，捎带脚传递过去
        if (this.$route.params) {
          loction.params = this.$route.params
          // 动态的给location配置对象添加query属性
          loction.query = query
          // 路由跳转
          this.$router.push(loction)
        }
      }
    },
    // 当鼠标移入的时候，让商品分类列表进行展示
    enterShow() {
      if (this.$route.path != '/home') {
        this.show = true
      }
    }, // 一级分类鼠标移除的事件回调
    leaveIndex() {
      this.currentIndex = -1
      // 鼠标移出currentIndex，变为-1
      // 判断如果是search路由组件的时候才会执行
      if (this.$route.path != '/home') {
        this.show = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 0.125rem solid #e1251b;

  .container {
    width: 75rem;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 13.125rem;
      height: 2.8125rem;
      background-color: #e1251b;
      line-height: 2.8125rem;
      text-align: center;
      color: #fff;
      font-size: 0.875rem;
      font-weight: bold;
    }

    .nav {
      a {
        height: 2.8125rem;
        margin: 0 1.375rem;
        line-height: 2.8125rem;
        font-size: 1rem;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 2.8125rem;
      width: 13.125rem;
      height: 28.8125rem;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 1.875rem;
            font-size: 0.875rem;
            font-weight: 400;
            overflow: hidden;
            padding: 0 1.25rem;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 45.875rem;
            min-height: 28.75rem;
            background: #f7f7f7;
            left: 13.125rem;
            border: 0.0625rem solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 40.625rem;
              padding: 0 0.25rem 0 0.5rem;

              dl {
                border-top: 0.0625rem solid #eee;
                padding: 0.375rem 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 3.375rem;
                  line-height: 1.375rem;
                  text-align: right;
                  padding: 0.1875rem 0.375rem 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 25.9375rem;
                  padding: 0.1875rem 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 0.875rem;
                    line-height: 0.875rem;
                    padding: 0 0.5rem;
                    margin-top: 0.3125rem;
                    border-left: 0.0625rem solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
    .sort-enter {
      height: 0;
      opacity: 0;
    }
    .sort-enter-to {
      height: 461px;
      opacity: 1;
    }
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>
