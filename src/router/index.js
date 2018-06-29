import Vue from 'vue'
import Router from 'vue-router'
import antv from '@/components/antv/index.vue'
import echarts from '@/components/echarts/index.vue'
import echarts1 from '@/components/echarts/demo.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/antv',
      name: 'antv',
      component: antv
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: echarts
    },
    {
      path: '/echarts1',
      name: 'echarts1',
      component: echarts1
    }
  ]
})
