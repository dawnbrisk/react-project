import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Layout, Row, Col, Typography, message } from 'antd';
import backgroundImage from './background.jpg';
import { useNavigate } from 'react-router-dom';
import { request } from "../../../util/request";
import './LoginPage.css';
const { Title } = Typography;
const { Content } = Layout;

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const data = await request("/login", {
            method: "POST",
            body: JSON.stringify(values),
        });

        localStorage.setItem("token", data);
        navigate('/up-down-move');

    };

    return (
        <Layout className="login-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Content>
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                        <Card className="login-card" bodyStyle={{ padding: '32px 24px' }}>
                            <div className="login-title">
                                <Title level={3}>Warehouse NW </Title>
                            </div>

                            <Form form={form} name="auth" onFinish={onFinish} scrollToFirstError>
                                <Form.Item name="username" rules={[{ required: true, message: 'please enter account' }]}>
                                    <Input prefix={<UserOutlined />} placeholder="User Name" size="large" />
                                </Form.Item>

                                <Form.Item name="password" rules={[{ required: true, message: 'please enter password' }]}>
                                    <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" block style={{ borderRadius: 24 }}>
                                        Sign In
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
