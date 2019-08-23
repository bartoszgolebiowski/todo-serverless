import React, {useState} from 'react';
import {Icon, Button, Input, Form, Layout} from 'antd';
import './login.css'

import Axios from '../../globalAxios'
import {LOGIN} from '../../endpoints'
import {login} from '../../Utils/Login/index'

const Login = (props) => {

    const onSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                const {username, password} = values;
                Axios.post(LOGIN, {username, password})
                    .then(o1 => login(o1.token))
            }
        });
    };
    const {getFieldDecorator} = props.form;
    return (
        <div className="login-container">
            <Layout.Header className="login-header">Login</Layout.Header>
            <Form className="login-form" onSubmit={onSubmit}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please input your username!'}],
                    })(
                        <Input
                            name='username'
                            prefix={<Icon type="user"/>}
                            placeholder="Username"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Please input your password!'}],
                    })(
                        <Input
                            name='password'
                            prefix={<Icon type="lock"/>}
                            type="password"
                            placeholder="Password"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    <a>Register</a>
                </Form.Item>
            </Form>
        </div>
    )
};
const LoginForm = Form.create({name: 'normal_login'})(Login);

export default LoginForm;