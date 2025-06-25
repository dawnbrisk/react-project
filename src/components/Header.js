import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={{ padding: 0 }}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
                <Menu.Item key="home">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="download">
                    <Link to="/download">Download</Link>
                </Menu.Item>
                <Menu.Item key="logout" style={{ marginLeft: 'auto' }}>
                    <Link to="/">Logout</Link>
                </Menu.Item>
            </Menu>


        </header>
    );
};

export default Header;
