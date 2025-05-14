// src/services/userService.js

import { request } from "../../../util/request"; // Your API request utility


// 获取所有用户
export const getUsers = async () => {
    try {
        const response = await request(`/users`);
        return response.data;
    } catch (error) {
        console.error('获取用户列表失败:', error);
        throw error;
    }
};

// 添加用户
export const addUser = async (userData) => {
    try {
        const response = await request(`/users`, userData);
        return response.data;
    } catch (error) {
        console.error('添加用户失败:', error);
        throw error;
    }
};

// 编辑用户
export const editUser = async (userId, userData) => {
    try {
        const response = await request(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('编辑用户失败:', error);
        throw error;
    }
};

// 废弃/恢复用户
export const toggleUserStatus = async (userId) => {
    try {
        const response = await request(`/users/${userId}/toggle-status`);
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