import React, { useEffect, useState } from 'react';
import { NavBar, List, CapsuleTabs } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { request } from '../../../../util/request';
import { Button } from 'antd-mobile';

const DoubleWeekCheckList = () => {
    const navigate = useNavigate();
    const [skuList, setSkuList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skuPage, setSkuPage] = useState(1);
    const [donePage, setDonePage] = useState(1);
    const pageSize = 10;

    const paginatedSkuList = skuList.slice((skuPage - 1) * pageSize, skuPage * pageSize);
    const paginatedDoneList = doneList.slice((donePage - 1) * pageSize, donePage * pageSize);

    useEffect(() => {
        // 获取待处理 SKU 列表
        request('/biweeklyList')
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
                Biweekly Check
            </NavBar>
            <CapsuleTabs>
                <CapsuleTabs.Tab title={`Todo List(${skuList.length})`} key="todo">
                    <List renderHeader={() => '待处理 SKU 列表'}>
                        {paginatedSkuList.map((item) => (
                            <List.Item
                                key={item.item_code + item.location_code}
                                onClick={() =>
                                    navigate(`/ToCheckList/${item.item_code}/todo`, {
                                        state: {
                                            pallet_qty_combined: item.pallet_qty_combined,
                                            location_code: item.location_code,
                                            item_code: item.item_code,
                                        },
                                    })
                                }
                            >
                                {`SKU: ${item.item_code}`}
                            </List.Item>
                        ))}
                    </List>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
                        <Button
                            size="small"
                            disabled={skuPage === 1}
                            onClick={() => setSkuPage(skuPage - 1)}
                        >
                            上一页
                        </Button>
                        <span>{`第 ${skuPage} 页，共 ${Math.ceil(skuList.length / pageSize)} 页`}</span>
                        <Button
                            size="small"
                            disabled={skuPage >= Math.ceil(skuList.length / pageSize)}
                            onClick={() => setSkuPage(skuPage + 1)}
                        >
                            下一页
                        </Button>
                    </div>
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab title={`History(${doneList.length})`} key="done">
                    <List renderHeader={() => '已完成 SKU 列表'}>
                        {paginatedDoneList.map((sku) => (
                            <List.Item key={sku} onClick={() => navigate(`/WorkDetail_MergeLocation/${sku}/done`)}>
                                {`SKU: ${sku}`}
                            </List.Item>
                        ))}
                    </List>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
                        <Button
                            size="small"
                            disabled={donePage === 1}
                            onClick={() => setDonePage(donePage - 1)}
                        >
                            上一页
                        </Button>
                        <span>{`第 ${donePage} 页，共 ${Math.ceil(doneList.length / pageSize)} 页`}</span>
                        <Button
                            size="small"
                            disabled={donePage >= Math.ceil(doneList.length / pageSize)}
                            onClick={() => setDonePage(donePage + 1)}
                        >
                            下一页
                        </Button>
                    </div>
                </CapsuleTabs.Tab>

            </CapsuleTabs>
        </div>
    );
};

export default DoubleWeekCheckList;
