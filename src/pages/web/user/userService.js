// src/services/userService.js

import {request} from "../../../util/request"; // Your API request utility


// 获取所有用户
export const getUsers = async () => {
    try {

        return await request(`/users`, {method: 'GET'});
    } catch (error) {
        console.error('获取用户列表失败:', error);
        throw error;
    }
};

// 添加用户
export const addUser = async (userData) => {
    try {
        return await request(`/addUser`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    } catch (error) {
        console.error('Failed to add the user:', error);
        throw error;
    }
};

// 编辑用户
export const editUser = async (userId, userData) => {
    try {

        const response = await request(`/users/${encodeURIComponent(userId)}`, {
            body: JSON.stringify(userData), // 注意：不是 body / bodyData，而是 data
        });
        return response.data;
    } catch (error) {
        console.error('编辑用户失败:', error);
        throw error;
    }
};

// 废弃/恢复用户
export const toggleUserStatus = async (userId) => {
    try {
        const response = await request(`/status/${userId}`,{method:'GET'});
        return response.data;
    } catch (error) {
        console.error('更新用户状态失败:', error);
        throw error;
    }
};

// 获取单个用户详情
export const getUserById = async (userId) => {
    try {
        const response = await request(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('获取用户详情失败:', error);
        throw error;
    }
};