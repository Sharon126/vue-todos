import Vue from 'vue'
import Router from 'vue-router'
import Layouts from '@/components/layouts'
import todo from '@/components/todo'

Vue.use(Router)    //全局注册Router组件，它会绑定到Vue实例

export default new Router({   //创建router实例，然后传 routes 配置
  routes: [
    {
      path: '/',
      name: 'Layouts',
      component: Layouts,     //访问的组件，即访问'/'，它会加载layout组件所有内容
      children:[{
        path:'/todo/:id',
        name:'todo',
        component:todo
      }]
    }
  ]
})
