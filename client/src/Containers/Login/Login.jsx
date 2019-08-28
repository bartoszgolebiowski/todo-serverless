import React, {useState} from 'react';
import {Icon, Button, Input, Form, Layout, notification} from 'antd';
import './login.css'

import Axios from '../../globalAxios'
import {LOGIN} from '../../endpoints'
import {login} from '../../Utils/Login/index'

const Login = (props) => {

    const [submitStatus, setSubmitStatus] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                setSubmitStatus(true);
                Axios.post(LOGIN, {...values})
                    .then(res => {
                        login(res.data.token);
                        setSubmitStatus(false);
                        props.history.push('/home');
                        notification.open({message: res.data.message});
                    })
                    .catch(err => {
                        console.log(err.response);
                        notification.open({
                            message: err.response.data.message,
                            description: err.response.data.error
                        });
                        setSubmitStatus(false)
                    })
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
                    <Button type="primary" htmlType="submit" className="login-form-button" disabled={submitStatus}>
                        Log in
                    </Button>
                    <div className="registration-container">
                        Not registered? <a>Create an account</a>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
};
const LoginForm = Form.create({name: 'login_form'})(Login);

export default LoginForm;