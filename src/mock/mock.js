/* 利用mockjs模拟2个接口，一个菜单列表数据，一个新增菜单 */
/* 由于开发时，后端还没有写好接口，前端只能写静态模拟数据。
   Mockjs可以根据数据模板生成模拟数据，模拟ajax请求、 html模板 */

/* 这里的作用是模拟ajax请求的接口，生成并返回模拟数据 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import {Todos} from './data/todoList';   //导入Todos数据

export default {
    /* mock start */
    start() {    //初始化函数
        let mock = new MockAdapter(axios);    //创建MockAdapter的实例
        //获取TODO列表
        mock.onGet('/todo/list').reply( config => {   //config 指前台传过来的值
            let mockTodo = Todos.map( todo => {       // 重组Todos数组，变成我们想要的数据
                return {
                    id: todo.id,
                    title: todo.title,
                    count: todo.record.filter( (data)=> {
                        if(data.checked === false) return true;
                        return false;
                    }).length,             // 过滤掉 record里面‘checked’为true的数据，因为他们已经被完成了
                    locked: todo.locked,
                    isDelete: todo.isDelete
                };
            }).filter( todo=> {
                if(todo.isDelete === true) return false;   // 过滤掉‘isDelete’为true，因为已经被删除了
                return true;
            });
            return new Promise( (resolve,reject)=> {
                setTimeout( ()=> {
                    resolve([200,{
                        todos:mockTodo    // 返回状态为200，并且返回todos数据
                    }]);
                },200);
            });
        });

        mock.onGet('/todo/listId').reply( config => {
            let { id } = config.params;          // id是传进来的值
            let todo = Todos.find(todo => {      // todo是根据id和现有的Todos数据匹配，找出id相等的数据，在进行返回
                return id && todo.id === id;
            });
            // todo.count（等待完成数目）等于todo.record(待办事项列表下面未被选择的数据)
            todo ? todo.count = todo ? todo.record.filter((data) => {
                return data.checked === false;
            }).length : null : false;
            return new Promise((resolve, reject) => {
                setTimeout( ()=>{
                    resolve([200,{
                        todo:todo
                    }]);
                },200);
            });
        });

        //新增一条todo
        mock.onPost('/todo/addTodo').reply( config=> {
            Todos.push({
                id: Mock.Random.guid(),
                title: 'newList',
                isDelete: false,
                locked: false,
                record: []
            });
            return new Promise( (resolve,reject)=> {
                setTimeout( ()=> {
                    resolve([200]);
                },200);
            });
        });

        // 新增一条代办事项
        mock.onPost('/todo/addRecord').reply( config => {
            // id是传进来的唯一待办事项， text是用户新增输入的数据
            let { id, text } = JSON.parse(config.data);
            Todos.some( (t,index) => {
                if(t.id === id){
                    t.record.push({
                        text:text,
                        isDelete: false,
                        checked: false
                    });
                    return true;
                }
            });
            return new Promise( (resolve,reject) => {
                setTimeout( ()=>{
                    resolve([200]);
                },200);
            });
        });
    }
};