import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd';

import CreateTodo from './CreateTodo.jsx'
import TodoList from './TodoList.jsx'

export default function Home() {

    const url = 'http://localhost:3000';
    const getAll = '/todo';
    const create = '/todo/create';

    const [visible, setVisible] = useState(false);
    const [singleTodo, setSingleTodo] = useState({ name: '', author: '' });
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        (async function fetchData() {
            const result = await fetch(`${url}${getAll}`)
                .then(res => res.json());
            setTodos(result.Items)
        })()
    }, []);


    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
        async function postData() {
            const { todo } = await fetch(`${url}${create}`, { method: 'POST', body: JSON.stringify(singleTodo) })
                .then(res => res.json())
            setTodos([...todos, todo]);
        }
        postData();
        setSingleTodo({ name: '', author: '' });
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
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
            <TodoList todos={todos} />
        </div>
    )
}
