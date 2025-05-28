import React, { useEffect, useState } from 'react';
import { Layout, notification } from 'antd';
import {request} from '../../util/request'

const { Content } = Layout;

const Home = () => {
    const [lastDate, setLastDate] = useState(null);

    useEffect(() => {
        // 获取后端数据
        request('/getDate',{method:'GET'})
            .then(data => {
                const backendDateStr = data.date; // "2025-05-21 14:55:30"
                const backendDate = new Date(backendDateStr);
                const today = new Date();

                // 清零时间部分，仅比较日期
                backendDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                if (backendDate < today) {
                    // 触发非阻断式提示框
                    notification.warning({
                        message: '数据更新提醒',
                        description: '您的数据不是最新的，请尽快上传最新数据。',
                        duration: 5,
                    });
                }

                setLastDate(backendDateStr);
            })
            .catch(error => {
                console.error('获取日期失败:', error);
            });
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Content style={{ padding: '24px', background: '#fff' }}>
                    <h1>Home Page</h1>
                    {lastDate && (
                        <p style={{ marginTop: '16px' }}>最近上传数据时间：{lastDate}</p>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
