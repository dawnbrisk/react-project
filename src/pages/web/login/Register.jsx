import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Layout, Row, Col, Typography, message } from 'antd';
import backgroundImage from './background.png';
import { useNavigate } from 'react-router-dom';
import { request } from '../../../util/request';

const { Title } = Typography;
const { Content } = Layout;

const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await request('/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            });

            message.success('注册成功，请登录');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            message.error('注册失败，请重试');
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
                                <Title level={3} style={{ color: '#52c41a' }}>
                                    注册账号
                                </Title>
                            </div>

                            <Form
                                form={form}
                                name="register"
                                onFinish={onFinish}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户名' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="用户名"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="密码"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        block
                                        style={{ borderRadius: 24 }}
                                    >
                                        注册
                                    </Button>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="link" block onClick={() => navigate('/login')}>
                                        已有账号？返回登录
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

export default RegisterPage;
