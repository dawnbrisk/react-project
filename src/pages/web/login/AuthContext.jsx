// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // 默认未登录
    const navigate = useNavigate();

    const login = () => {
        setIsAuthenticated(true);  // 模拟登录
        navigate('/up-down-move');  // 登录后跳转到目标页面
    };

    const logout = () => {
        setIsAuthenticated(false);  // 模拟登出
        navigate('/');  // 登出后跳转到登录页
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
