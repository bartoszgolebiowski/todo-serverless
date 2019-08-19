import React from 'react'
import { List } from 'antd';

export default function TodoList(props) {

    const { todos } = props;

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
}
