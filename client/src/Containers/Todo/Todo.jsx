import React, {useState, useEffect} from 'react'
import {Layout, Modal, Button, List} from 'antd';

import globalAxios from "../../globalAxios";
import {GET_ALL_TODOS, CREATE_TODO} from "../../endpoints";

import CreateTodo from './CreateTodo.jsx'
const { Header, Content, Footer } = Layout;

const Todo = () => {
    const [visible, setVisible] = useState(false);
    const [singleTodo, setSingleTodo] = useState({name: '', author: ''});
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        globalAxios.get(GET_ALL_TODOS)
            .then(res => setTodos(res.Items))
    }, []);


    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOk = () => {
        globalAxios.post(CREATE_TODO, {singleTodo})
            .then(o1 => setTodos([...todos, o1.todo]))
            .then(() => setVisible(false))
            .then(() => setSingleTodo({name: '', author: ''}))
    };

    const showTodos = (todos) => {
        return (
            <List
                header={<div>Todo list</div>}
                bordered
                dataSource={todos}
                renderItem={item => (
                    <List.Item>
                        {item.name}
                    </List.Item>
                )}
            />
        )
    };

    return (
        <Layout className="layout">
            <Header>Header</Header>
            <Content>
                <Button type="primary" onClick={showModal}>
                    Create todo
                </Button>
                <Modal
                    title="Create todo"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <CreateTodo
                        todo={singleTodo}
                        setTodo={setSingleTodo}
                    />
                </Modal>
                {showTodos(todos)}
            </Content>
            <Footer>Footer</Footer>
        </Layout>
    )
};
export default Todo
