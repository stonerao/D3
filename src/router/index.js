import Vue from 'vue'
import Router from 'vue-router'
import antv from '@/components/antv/index.vue'
import echarts from '@/components/echarts/index.vue'
import echarts1 from '@/components/echarts/demo.vue'
import d3 from '@/components/d3/index.vue'
import force from '@/components/force/index.vue'

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
    },{
      path: '/d3',
      name: 'd3',
      component: d3
    },{
      path: '/force',
      name: 'force',
      component: force
    }
  ]
})
