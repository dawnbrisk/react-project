import React, { useEffect, useState } from 'react';
import { List, Card, Toast, NavBar, Button, SpinLoading } from 'antd-mobile';
import { request } from "../../../../util/request";
import  useAuthRedirect from "../../useAuthRedirect"

const PAGE_SIZE = 8;

const EmptyLocation = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const authenticated =useAuthRedirect();

    useEffect(() => {
        //if (!authenticated) return;

        const fetchData = async () => {
            try {
                const response = await request('/emptyLocationList',{method:'GET'});
                setData(response);
            } catch (error) {
                Toast.show('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pagedData = data.slice(startIndex, startIndex + PAGE_SIZE);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <Card>
            <NavBar
                back="Back"
                onBack={() => window.history.back()}
                style={{ backgroundColor: '#007bff', color: 'white' }}
                right={<span style={{ fontSize: 14, marginRight: 8 }}>Total: {data.length}</span>}
            >
                Empty Location List
            </NavBar>

            {loading ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 40,
                    }}
                >
                    <SpinLoading color="primary" style={{ fontSize: 24, marginBottom: 12 }} />
                    <div>loading...</div>
                </div>
            ) : (
                <>
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
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: 'red' }}>{item}</span>
                                </div>
                            </List.Item>
                        ))}
                    </List>

                    {/* 分页按钮 */}
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            style={{ marginRight: 8 }}
                            size="small"
                        >
                            Prev
                        </Button>
                        <span style={{ margin: '0 12px' }}>
              Page {currentPage} / {totalPages}
            </span>
                        <Button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            style={{ marginLeft: 8 }}
                            size="small"
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </Card>
    );
};

export default EmptyLocation;
