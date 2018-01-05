<template>
    <!-- 绑定点击事件goList，并且判断当TodoId等于item.id时，文字高亮 -->
    <div class='list-todos'> <!-- 菜单容器 -->
        <!-- 绑定class，当items循环的id等于设置的todoId时，就会加上active这个class样式 -->
        <a @click='goList(item.id)' class='list-todo activeListClass list' :class='{"active": item.id===todoId}' v-for='item in items' v-bind:key='item.id'> <!-- 单个菜单容器 -->
            <span class='icon-lock' v-if='item.locked'></span>  <!-- 锁的图标 -->
            <span class='count-list' v-if='item.count>0'>{{item.count}}</span>  <!-- 数字 -->
            {{item.title}}  <!-- 菜单内容 -->
        </a>
        <a class='link-list-new' @click='addTodoList'> <!-- 新增菜单 -->
            <span class='icon-plus'></span>
            新增
        </a>
    </div>
</template>

<script>
    import {getTodoList, addTodo} from '../api/api';   //引入封装好的两个接口函数
    export default {
        data() {
            return {
                items:[{title:'星期一', count:1, locked:true},
                       {title:'星期二', count:2, locked:true},
                       {title:'星期三', count:3, locked:false}
                ],
                todoId:''     // 默认选中id
            };
        },
        created() {    // 调用请求菜单列表数据的接口
            getTodoList({}).then(res => {
                const TODOS = res.data.todos;    // 数据都会返回在res.data里面
                this.items = TODOS;              // 再把菜单数据赋值给定义的items
                this.todoId = TODOS[0].id;       // 把菜单数据的默认第一个对象的id赋值给默认选中的id
            });
        },
        methods:{
            goList(id) {         // 点击菜单时，替换选中的id
                this.todoId = id;
            },
            addTodoList() {      // 点击新增按钮时，调用新增菜单的接口，在接口调用成功后请求数据
                addTodo({}).then(data => {
                    getTodoList({}).then(res => {
                        const TODOS = res.data.todos;
                        this.todoId = TODOS[TODOS.length-1].id;
                        this.items = TODOS;
                    });
                });
            }
        },
        watch:{
            'todoId'(id) {
                this.$router.push({ name:'todo', params:{id:id} });   // 路径为： /todo/id
                // 监听到用户的点击todoId的变化再跳转路由
            }
        }
    };
</script>

<style lang='less'>
@import '../common/style/menu.less';
</style>









