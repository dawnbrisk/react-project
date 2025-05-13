// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // 引入自定义的 AuthContext

const PrivateRoute = ({ element, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            {...rest}
            element={isAuthenticated ? element : <Navigate to="/" />}  // 未登录则跳转到登录页面
        />
    );
};

export default PrivateRoute;
