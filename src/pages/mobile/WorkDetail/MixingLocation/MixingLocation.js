import React, { useEffect, useState } from 'react';
import { List, Card, Skeleton, Toast, NavBar, Button } from 'antd-mobile';
import { request } from "../../../../util/request";

const PAGE_SIZE = 10; // 每页数量

const MixingLocation = () => {
    const [data, setData] = useState([]);
    const [pagedData, setPagedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await request('/mixingLocation',{method:'GET'});
                setData(res);
                setPagedData(res.slice(0, PAGE_SIZE));
            } catch (error) {
                Toast.show('Failed to fetch data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const loadMore = () => {
        const nextPage = currentPage + 1;
        const nextData = data.slice(0, nextPage * PAGE_SIZE);
        setPagedData(nextData);
        setCurrentPage(nextPage);
    };

    return (
        <Card>
            {loading ? (
                <Skeleton.Paragraph lineCount={3} active />
            ) : (
                <>
                    <NavBar
                        back="Back"
                        onBack={() => window.history.back()}
                        style={{ backgroundColor: '#007bff', color: 'white' }}
                        right={<span style={{ fontSize: 14, marginRight: 8 }}>Total: {data.length}</span>}
                    >
                        Mixing List
                    </NavBar>


                    <List>
                        <List.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ fontWeight: 'bold' }}>Location</span>
                                <span style={{ fontWeight: 'bold' }}>Count</span>
                                <span style={{ fontWeight: 'bold' }}>SKU</span>
                            </div>
                        </List.Item>
                    </List>

                    <List>
                        {pagedData.map((item, index) => (
                            <List.Item
                                key={index}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
                                    borderRadius: 4,
                                    marginBottom: 2,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <input type="checkbox" />
                                    <span style={{ color: 'red' }}>{item.Location_Code}</span>
                                    <span style={{ color: 'green' }}>{item.uniqueSkuCount}</span>
                                    <div style={{
                                        color: '#6D4C41',
                                        textAlign: 'right',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        {item.sku.split(',').map((skuItem, i) => (
                                            <span key={i}>{skuItem.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </List.Item>
                        ))}
                    </List>

                    {pagedData.length < data.length && (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <Button onClick={loadMore} size="small" color="primary">Load More</Button>
                        </div>
                    )}
                </>
            )}
        </Card>
    );
};

export default MixingLocation;
