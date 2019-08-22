import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'antd';

import CreateTodo from './CreateTodo.jsx'
import TodoList from './TodoList.jsx'

const Home = () => {

    const url = 'http://localhost:3000';
    const getAll = '/todo';
    const create = '/todo/create';

    const [visible, setVisible] = useState(false);
    const [singleTodo, setSingleTodo] = useState({name: '', author: ''});
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        (async () => {
            await fetch(`${url}${getAll}`)
                .then(res => res.json())
                .then(res => setTodos(res.Items))
        })()
    }, []);


    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        (async () => {
            await fetch(`${url}${create}`, {method: 'POST', body: JSON.stringify(singleTodo)})
                .then(res => res.json())
                .then(todo => setTodos([...todos, todo]))
                .then(() => setSingleTodo({name: '', author: ''}))
                .then(() => setVisible(false));
        })();
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
            <TodoList todos={todos}/>
        </div>
    )
};
export default Home
