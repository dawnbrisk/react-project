// src/components/UserManagement.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    getUsers,
    addUser,
    editUser,
    toggleUserStatus
} from './userService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [hoveredRow, setHoveredRow] = useState(null);
    const [loading, setLoading] = useState(false);

    // 初始化加载用户数据
    useEffect(() => {
        fetchUsers();
    }, []);


    

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            const usersWithIndex = data.map((user, index) => ({
                ...user,
                originalIndex: index
            }));
            setUsers(usersWithIndex);
            setFilteredUsers(usersWithIndex);
            setPagination(prev => ({
                ...prev,
                total: data.length
            }));
        } catch (error) {
            message.error('加载用户数据失败');
        } finally {
            setLoading(false);
        }
    };

    // 处理搜索
    useEffect(() => {

        const filtered = users.filter(user =>

            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.id.toString().includes(searchText)
        );
        setFilteredUsers(filtered);
        setPagination(prev => ({
            ...prev,
            current: 1,
            total: filtered.length
        }));
    }, [searchText, users]);

    // 获取当前页数据
    const getCurrentPageData = () => {
        const { current, pageSize } = pagination;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        return filteredUsers
            .sort((a, b) => b.id - a.id)
            .slice(start, end);
    };

    const togglePasswordVisibility = (id) => {
        setPasswordVisible(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // 添加用户
    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            const newUser = {
                username: values.username,
                password: values.password
            };
            await addUser(newUser);

            message.success('用户添加成功');
            setIsModalVisible(false);
            form.resetFields();
            await fetchUsers();
        } catch (error) {
            console.error('添加用户失败:', error);
            if (error.response && error.response.data) {
                message.error(error.response.data.message || '添加用户失败');
            }
        }
    };

    // 编辑用户
    const handleEdit = async () => {
        try {
            const values = await form.validateFields();

            await editUser(currentUser.id, {
                username: values.username,
                password: values.password
            });
            message.success('用户信息更新成功');
            setIsModalVisible(false);
            form.resetFields();
            await fetchUsers();
        } catch (error) {
            console.error('编辑用户失败:', error);
            if (error.response && error.response.data) {
                message.error(error.response.data.message || '编辑用户失败');
            }
        }
    };

    // 废弃/恢复用户
    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            message.success('用户状态更新成功');
            await fetchUsers();
        } catch (error) {
            console.error('更新用户状态失败:', error);
            if (error.response && error.response.data) {
                message.error(error.response.data.message || '更新用户状态失败');
            }
        }
    };

    // 打开添加模态框
    const showAddModal = () => {
        setCurrentUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // 打开编辑模态框
    const showEditModal = (user) => {
        setCurrentUser(user);
        form.setFieldsValue({
            username: user.name,
            password: user.password
        });
        setIsModalVisible(true);
    };

    // 处理模态框确认
    const handleModalOk = () => {
        if (currentUser) {
            handleEdit();
        } else {
            handleAdd();
        }
    };

    // 处理分页变化
    const handlePageChange = (page, pageSize) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize
        });
    };

    // 处理搜索输入
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    // 表格列配置
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'descend',
        },
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <span style={{ textDecoration:  record.status ==="1" ? 'line-through' : 'none' }}>
          {text}
        </span>
            ),
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
            render: (text, record) => (
                <Space>
          <span style={{ textDecoration: record.status ==="1" ? 'line-through' : 'none' }}>
            {passwordVisible[record.id] ? text : text.replace(/./g, '*')}
          </span>
                    <Button
                        type="text"
                        icon={passwordVisible[record.id] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => togglePasswordVisibility(record.id)}
                    />
                </Space>
            ),
        },
        {
            title: 'Create Time',
            dataIndex: 'insert_time',
            key: 'createdAt',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Edit',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" style={{ visibility: hoveredRow === record.id ? 'visible' : 'hidden' }}>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        disabled={record.disabled}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleToggleStatus(record.id)}
                    >
                        {record.disabled ? 'Deprecated ' : 'Abandon '}
                    </Button>
                </Space>
            ),
        },
    ];

    // 行颜色配置
    const rowProps = (record) => ({
        onMouseEnter: () => setHoveredRow(record.id),
        onMouseLeave: () => setHoveredRow(null),
        style: {
            backgroundColor: record.disabled ? '#fff0f0' : (record.originalIndex % 2 === 0 ? '#f9f9f9' : '#ffffff'),
            cursor: 'pointer'
        }
    });

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>


                <Input
                    placeholder="Search User Name"
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={handleSearchChange}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                    loading={loading}
                >
                    添加用户
                </Button>

            </div>

            <Table
                columns={columns}
                dataSource={getCurrentPageData()}
                rowKey="id"
                pagination={false}
                onRow={rowProps}
                loading={loading}
            />

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={total => ` Total: ${total}`}
                    pageSizeOptions={['10', '20', '50']}
                />
            </div>

            <Modal
                title={currentUser ? 'Edit' : 'Add user'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="username"
                        label="user name"
                        rules={[
                            { required: true, message: 'Please enter user name' },
                            { min: 4, message: 'min 4 chars' },
                            { max: 20, message: 'max 20 chars' }
                        ]}
                    >
                        <Input placeholder="Please enter user name" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="password"
                        rules={[
                            { required: true, message: 'please enter password' },
                            { min: 6, message: 'min 6 chars' },
                            { max: 20, message: 'max 20 chars' }
                        ]}
                    >
                        <Input.Password placeholder="please enter password" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;