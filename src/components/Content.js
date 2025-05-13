import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const WebContent = ({ children }) => {
    return (
        <Content
            style={{
                padding: 30,
                margin: 0,
                minHeight: 280,
                background: '#fff',
            }}
        >
            {children}
        </Content>
    );
};

export default WebContent;
