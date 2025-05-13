import React from 'react';
import { Layout } from 'antd';


const { Content, Sider } = Layout;

const Home = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Layout>
                <Content style={{ padding: '24px', background: '#fff' }}>
                    <h1>Home Page</h1>
                    {/* 这里可以放置主页的内容 */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;