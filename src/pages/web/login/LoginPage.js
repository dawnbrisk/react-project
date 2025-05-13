// LoginPage.js
import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { useAuth } from './AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = () => {
        if (username === 'user' && password === 'password') {
            login();  // 用户名密码正确，调用 login 方法
            message.success('登录成功');
        } else {
            message.error('用户名或密码错误');
        }
    };

    return (
        <div>
            <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>登录</Button>
        </div>
    );
};

export default LoginPage;
