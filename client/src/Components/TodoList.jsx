import React, {useEffect} from 'react'
import {List} from 'antd';

const TodoList = (props) => {

    useEffect(() => {
        console.log(props.todos)
    }, []);

    const {todos} = props;

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

export default TodoList
