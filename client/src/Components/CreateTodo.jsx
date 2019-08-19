import React from "react";
import { Form, Input } from 'antd';

export default function CreateTodo(props) {

    const { todo, setTodo } = props;

    const updateField = e => {
        setTodo({
            ...todo,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Form>
            <Form.Item>
                Name:
            <Input
                    name="name"
                    type="text"
                    value={todo.name}
                    onChange={updateField}
                />
            </Form.Item>
            <Form.Item>
                Author:
            <Input
                    name="author"
                    type="text"
                    value={todo.author}
                    onChange={updateField}
                />
            </Form.Item>
        </Form>
    );

}
