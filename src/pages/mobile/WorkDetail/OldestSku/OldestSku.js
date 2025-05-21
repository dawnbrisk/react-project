import React, { useEffect, useState } from 'react';
import { NavBar, List, CapsuleTabs, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { request } from '../../../../util/request';

const PAGE_SIZE = 10;

const OldestSkuList = () => {
    const navigate = useNavigate();
    const [skuList, setSkuList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabKey, setTabKey] = useState('P');
    const [page, setPage] = useState(1);

    const handleTabChange = async (key) => {
        setTabKey(key);
        setPage(1); // 切换 Tab 时回到第一页
        setLoading(true);
        try {
            const response = await request(`/getOldestSku?type=${encodeURIComponent(key)}`);
            setSkuList(response || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleTabChange('P');
    }, []);

    const totalPages = Math.ceil(skuList.length / PAGE_SIZE);
    const pagedList = skuList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const renderHeaderRow = () => (
        <List.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontWeight: 'bold', textAlign: 'left' }}>SKU</span>
                <span style={{ fontWeight: 'bold', textAlign: 'center' }}>In Stock Time</span>
                <span style={{ fontWeight: 'bold', textAlign: 'right' }}>Location</span>
            </div>
        </List.Item>
    );

    const renderListRows = () =>
        pagedList.map((item, index) => (
            <List.Item
                key={index}
                style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                    borderRadius: 4,
                    marginBottom: 2,
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ color: '#d32f2f', fontWeight: 500 }}>{item.item_code}</span>
                    <span style={{ color: '#388e3c', fontWeight: 500 }}>{item.in_stock_date}</span>
                    <span style={{ color: '#1976d2', fontWeight: 500 }}>{item.location_code}</span>
                </div>
            </List.Item>
        ));

    return (
        <div>
            <NavBar back="Back" onBack={() => navigate(`/WorkList`)}>
                Eldest SKU
            </NavBar>

            <CapsuleTabs onChange={handleTabChange} defaultActiveKey="P">
                {['P', 'ABC'].map((type) => (
                    <CapsuleTabs.Tab title={type} key={type}>
                        {loading ? (
                            <Spin />
                        ) : (
                            <>
                                <List>{renderHeaderRow()}</List>
                                <List>{renderListRows()}</List>

                                {/* 分页控制 */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px 16px',
                                    }}
                                >
                                    <Button
                                        size="small"
                                        disabled={page === 1}
                                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    >
                                        上一页
                                    </Button>
                                    <span>第 {page} / {totalPages} 页</span>
                                    <Button
                                        size="small"
                                        disabled={page === totalPages}
                                        onClick={() =>
                                            setPage((prev) =>
                                                Math.min(totalPages, prev + 1)
                                            )
                                        }
                                    >
                                        下一页
                                    </Button>
                                </div>
                            </>
                        )}
                    </CapsuleTabs.Tab>
                ))}
            </CapsuleTabs>
        </div>
    );
};

export default OldestSkuList;
