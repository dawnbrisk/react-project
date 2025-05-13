import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Layout, Row, Col, Typography, message } from 'antd';
import backgroundImage from './background.jpg';
import { useNavigate } from 'react-router-dom';
import { request } from "../../../util/request";

const { Title } = Typography;
const { Content } = Layout;

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);

    const onFinish = async (values) => {
        try {

            const res = await request('/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            });
            message.success(isRegister ? '注册成功，请登录' : '登录成功');

            if (isRegister) {
                setIsRegister(false);
                form.resetFields();
            } else {
                navigate('/up-down-move');
            }
        } catch (err) {
            message.error(isRegister ? '注册失败，请重试' : '登录失败，请检查用户名和密码');
        }
    };

    return (
        <Layout style={{
            minHeight: '100vh',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <Content>
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                        <Card
                            style={{
                                borderRadius: 24,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.55)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                            bodyStyle={{ padding: '32px 24px' }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <Title level={3} style={{ color: isRegister ? '#52c41a' : '#1890ff' }}>
                                    {isRegister ? '注册账号' : 'Warehouse NW 登录'}
                                </Title>
                            </div>

                            <Form
                                form={form}
                                name="auth"
                                onFinish={onFinish}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户名' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        block
                                        style={{ borderRadius: 24 }}
                                    >
                                        {isRegister ? '注册' : '登录'}
                                    </Button>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="link"
                                        block
                                        onClick={() => {
                                            setIsRegister(!isRegister);
                                            form.resetFields();
                                        }}
                                    >
                                        {isRegister ? '已有账号？去登录' : '没有账号？点击注册'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default LoginPage;
