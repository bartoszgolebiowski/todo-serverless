import React from 'react';
import {Layout} from 'antd';

const {Header, Footer, Sider, Content} = Layout;

const Home = (props) => {
    return (
        <Layout>
            <Header>Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    )
};

export default Home;