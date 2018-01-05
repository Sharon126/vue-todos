<template>
  <div class='page lists-show'> <!-- 最外层容器 -->
      <nav>  <!-- 容器上半部分 -->
        <!-- 当用户浏览窗口尺寸小于40em时，显示手机端的菜单图标 -->
          <div class='nav-group'>  <!-- 移动端的菜单图标 -->
              <a class='nav-item'>
                  <span class='icon-list-unordered'></span>
              </a>
          </div>
          <!-- 显示标题和数字模块 -->
          <h1 class='title-page'>
              <span class='title-wrapper'>{{todo.title}}</span>  <!-- 标题 -->
              <span class='count-list'>{{todo.count}}</span>  <!-- 数目 -->
          </h1>
          <!-- 右边的删除，锁定图标容器 -->
          <div class='nav-group right'>  
              <div class='options-web'>
                  <a class='nav-item'>  <!-- 锁定图标 -->
                      <span class='icon-lock' v-if='todo.locked'></span>
                      <span class='icon-unlock' v-else></span>
                  </a>
                  <a class='nav-item'>  <!-- 删除图标 -->
                      <span class='icon-trash'></span>
                  </a>
              </div>
          </div>

          <!-- 用户新增代办事项的input模块 -->
          <div class='form todo-new input-symbol'>
              <!-- 绑定disabled值，当todo.locked为绑定的时候，禁止input输入;双向绑定text，监听input的回车事件 -->
              <input type='text' v-model='text' placeholder="请输入" @keyup.enter='onAdd' :disabled='todo.locked' />
              <span class='icon-add'></span>
          </div>
      </nav>
      
      <!-- 列表的主体模块 -->
      <div class='content-scrollable list-items'>
          <!-- 容器下半部分 -->
          <div v-for='item in items' v-bind:key='item.id'>
              <item :item='item'></item>
          </div>
      </div>
  </div>
</template>

<script>
    import {getTodo, addRecord} from '../api/api';
    import item from './item';
    export default {
        data() {
            return {
                todo:{
                    title:'星期一',
                    count: 12,
                    locked: false
                },
                items:[
                    {checked: false, text: '新的一天', isDelete: false},
                    {checked: false, text: '新的一天', isDelete: false},
                    {checked: false, text: '新的一天', isDelete: false}
                ],
                text:''      // 用户输入单项绑定的输入
            }
        },
        methods:{
            onAdd(){
                /* this.items.push({
                    checked:false, text:this.text, isDelete:false
                }); */
                // 当用户输入文字，并且回车时调用此方法
                const ID = this.$route.params.id;
                addRecord( {id:ID, text:this.text }).then( res => {
                    this.text = '';
                    this.init();
                    // 请求成功后初始化
                })
            },
            init() {
                // 获取到$route下params下的id，即我们在menus.vue组件处传入的数据
                const ID = this.$route.params.id;
                getTodo( { id:ID }).then(res => {
                    let { id,title,count,isDelete,locked,record } = res.data.todo;
                    //请求成功，拿到res.data.todo;再将record赋值到代办单项列表，其他数据赋值到todo对象
                    this.items = record;
                    this.todo = {
                        id:id,
                        title:title,
                        count:count,
                        locked:locked,
                        isDelete:isDelete
                    };
                });
            }
        },
        components:{
            item
        },
        watch: {
            '$route.params.id'() {
                //监听$router.params.id的变化，如果这个id（代表用户点击了其他代办项）需要重新请求数据
                this.init();
            }
        },
        created() {
            // created生命周期，在实例已经创建完成，页面还没有渲染时调用init方法
            this.init();
        }
    };
</script>

<style lang='less'>
@import '../common/style/nav.less';
@import '../common/style/form.less';
@import '../common/style/todo.less';
</style>


