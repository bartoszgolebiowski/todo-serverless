import React from "react";
import {Form, Input, Modal, notification} from 'antd';
import globalAxios from "../../globalAxios";
import {CREATE_TODO} from "../../endpoints";

const CreateTodo = (props) => {

    const {visible, setVisible, todos, setTodos} = props;
    const {getFieldDecorator} = props.form;

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOk = () => {
        props.form.validateFields((err, values) => {
            if (!err) {
                globalAxios.post(CREATE_TODO, {...values})
                    .then(res => {
                        setTodos([...todos, res.data.entity]);
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
            title="Create todo"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form>
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: 'Please input name!'}],
                    })(
                        <Input
                            name='name'
                            type="text"
                            placeholder="name"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('author', {
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

const CreateTodoForm = Form.create({name: 'create_todo_form'})(CreateTodo);

export default CreateTodoForm;
