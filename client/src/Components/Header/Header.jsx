import React from 'react'
import './header.css'
import {Layout, Menu} from 'antd';
import {Link} from "react-router-dom";
import {logout} from "../../Utils/Login";

const Header = (props) => {
    return (
        <Layout.Header className="header">
            <Menu
                theme="light"
                mode="horizontal"
            >
                <Menu.Item key="1"><Link to="/home">Home</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/todo">Todo</Link></Menu.Item>
                <Menu.Item key="3" onClick={logout}>Logout</Menu.Item>
            </Menu>
        </Layout.Header>
    )
};

const AuthHeader = ({isLoggedIn}) => {
    if (isLoggedIn) {
        return (<Header/>);
    }
    return (<div/>);
};

export default AuthHeader