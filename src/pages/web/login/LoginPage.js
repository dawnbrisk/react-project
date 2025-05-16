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
            message.success('Success');
        } else {
            message.error('Error');
        }
    };

    return (
        <form autoComplete="off">
            <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
            <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

            <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
            />
            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
            />
            <Button onClick={handleLogin}>Sign In</Button>
        </form>

    );
};

export default LoginPage;
