import React from 'react';
import {Layout} from 'antd';
import Header from "../../Components/Header/Header";

const {Footer, Content} = Layout;

const Home = (props) => {
    return (
        <Layout>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    )
};

export default Home;