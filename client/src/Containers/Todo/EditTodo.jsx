import React from "react";
import {Form, Input, Modal, notification} from 'antd';
import globalAxios from "../../globalAxios";
import {UPDATE_TODO} from "../../endpoints";

const EditTodo = (props) => {

    const {visible, setVisible, todos, setTodos, selectedTodo} = props;
    const {getFieldDecorator} = props.form;

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOk = () => {
        props.form.validateFields((err, values) => {
            if (!err) {
                globalAxios.patch(UPDATE_TODO, {"todo_id": selectedTodo.todo_id, ...values})
                    .then(res => {
                        const {todo_id} = selectedTodo;
                        const index = todos.findIndex(o1 => o1.todo_id === todo_id);
                        setTodos([...todos.slice(0, index), {todo_id, ...values}, ...todos.slice(index + 1)]);
                        notification.open({message: res.data.message});
                    })
                    .catch(err => notification.open({
                        message: err.response.data.message,
                        description: err.response.data.error
                    }))
                    .finally(() => setVisible(false))
                    .finally(() => props.form.resetFields())
            }
        })
    };

    return (
        <Modal
            title="Edit todo"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form>
                <Form.Item>
                    {getFieldDecorator('name', {
                        initialValue: selectedTodo.name,
                        rules: [{required: true, message: 'Please input name!'}],
                    })(
                        <Input
                            disabled
                            name='name'
                            type="text"
                            placeholder="name"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('author', {
                        initialValue: selectedTodo.author,
                        rules: [{required: true, message: 'Please input author!'}],
                    })(
                        <Input
                            name='author'
                            type="text"
                            placeholder="author"
                        />
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};

const EditTodoForm = Form.create({name: 'edit_todo_form'})(EditTodo);

export default EditTodoForm;
