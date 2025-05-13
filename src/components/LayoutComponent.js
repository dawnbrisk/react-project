import React from 'react';
import { Layout } from 'antd';
import HeaderComponent from './Header';
import SidebarComponent from './SideMenu';
import ContentComponent from './Content';
import './LayoutComponent.css';  // 引入CSS文件
import { Outlet } from 'react-router-dom';
const LayoutComponent = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HeaderComponent />
            <Layout>
                <SidebarComponent />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <ContentComponent style={{ padding: '50px' }}>
                        <Outlet />  {/* 这里自动渲染子页面 */}
                    </ContentComponent>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;
