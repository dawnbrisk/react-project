import React, { useEffect, useState } from 'react';
import { NavBar, List, CapsuleTabs } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { request } from '../../../../util/request';

const DoubleWeekCheckList = () => {
    const navigate = useNavigate();
    const [skuList, setSkuList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 获取待处理 SKU 列表
        request('/api/doubleWeekCheck',{
            method:'post',headers: {'Content-Type': 'application/json'}
        })
            .then((response) => {
                setSkuList(response);
                setLoading(false);
            })
            .catch((error) => {
                console.error('获取待处理 SKU 列表失败:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // 获取已完成 SKU 列表
        const userStr = localStorage.getItem('user');
        const userInfo = userStr ? JSON.parse(userStr) : null;

        if (userInfo) {
            request('/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userInfo.username,
                }),
            })
                .then((response) => {
                    setDoneList(response);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('获取已完成 SKU 列表失败:', error);
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return <Spin />;
    }

    return (
        <div>
            <NavBar back="返回" onBack={() => navigate('/WorkList')}>
                双周检查
            </NavBar>
            <CapsuleTabs>
                <CapsuleTabs.Tab title={`待处理列表(${skuList.length})`} key="todo">
                    <List renderHeader={() => '待处理 SKU 列表'}>
                        {skuList.map((sku) => (
                            <List.Item key={sku} onClick={() => navigate(`/WorkDetail_MergeLocation/${sku}/todo`)}>
                                {`SKU: ${sku}`}
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
                <CapsuleTabs.Tab title={`已完成列表(${doneList.length})`} key="done">
                    <List renderHeader={() => '已完成 SKU 列表'}>
                        {doneList.map((sku) => (
                            <List.Item key={sku} onClick={() => navigate(`/WorkDetail_MergeLocation/${sku}/done`)}>
                                {`SKU: ${sku}`}
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
            </CapsuleTabs>
        </div>
    );
};

export default DoubleWeekCheckList;
