import React, {useState, useEffect} from 'react'
import {Layout, Button, List, notification, Icon} from 'antd';
import './todo.css'

import globalAxios from "../../globalAxios";
import {GET_ALL_TODOS, DELETE_TODO} from "../../endpoints";

import CreateTodo from './CreateTodo.jsx'
import EditTodo from './EditTodo.jsx'

const {Content, Footer} = Layout;

const Todo = () => {
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState({"todo_id": "", "name": "", "author": ""});

    const showModal = () => {
        setVisibleCreate(true);
    };

    const edit = (item) => {
        setSelectedTodo(item);
        setVisibleEdit(true);
    };

    const remove = (todo_id) => {
        globalAxios.delete(DELETE_TODO, {data: {todo_id}})
            .then(res => {
                const index = todos.findIndex(o1 => o1.todo_id === todo_id);
                setTodos([...todos.slice(0, index), ...todos.slice(index + 1)]);
                notification.open({message: res.data.message});
            })
            .catch(err => notification.open({
                message: err.response.data.message,
                description: err.response.data.error
            }))
    };

    const getAllTodos = () => {
        globalAxios.get(GET_ALL_TODOS)
            .then(res => setTodos(res.data.Items))
            .catch(err => notification.open({
                message: err.response.data.message,
                description: err.response.data.error
            }));
    };

    useEffect(() => {
        getAllTodos();
    }, []);

    const showTodos = (todos) => {
        return (
            <div className="todo-list">
                <List
                    header={<div className="text-center">Todo list</div>}
                    bordered
                    dataSource={todos}
                    renderItem={item => (
                        <List.Item>
                            <div>
                                <List.Item.Meta
                                    title={item.name}
                                    description={item.author}
                                />
                            </div>
                            <div className="todo-modification">
                                <Icon className="todo-icon" type="edit" onClick={() => edit(item)}/>
                                <Icon className="todo-icon" type="delete" onClick={() => remove(item.todo_id)}/>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    };

    return (
        <Layout className="layout todo-content">
            <Content>
                <div className="todo-buttons-container">
                    <Button className="todo-button" type="primary" onClick={showModal}>
                        Create todo
                    </Button>
                    <Button className="todo-button" type="secondary" onClick={getAllTodos}>
                        Refresh
                    </Button>
                </div>
                <CreateTodo
                    visible={visibleCreate}
                    setVisible={setVisibleCreate}
                    todos={todos}
                    setTodos={setTodos}
                />
                <EditTodo
                    visible={visibleEdit}
                    setVisible={setVisibleEdit}
                    todos={todos}
                    setTodos={setTodos}
                    selectedTodo={selectedTodo}
                />
                {showTodos(todos)}
            </Content>
            <Footer className="text-center">Serverless & React app</Footer>
        </Layout>
    )
};
export default Todo
