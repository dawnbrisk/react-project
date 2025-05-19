import React, { useEffect, useState } from 'react';
import { NavBar, List, CapsuleTabs, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { request } from '../../../../util/request';

const PAGE_SIZE = 10;

const LocationList = () => {
    const navigate = useNavigate();
    const [skuList, setSkuList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [todoPage, setTodoPage] = useState(1);
    const [donePage, setDonePage] = useState(1);

    useEffect(() => {
        request('/locationList')
            .then(response => {
                setSkuList(response || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching SKU data:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const userInfo = JSON.parse(userStr);

        request('/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: userInfo.username }),
        })
            .then(response => {
                setDoneList(response || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching SKU data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <Spin />;

    const todoTotalPages = Math.ceil(skuList.length / PAGE_SIZE);
    const doneTotalPages = Math.ceil(doneList.length / PAGE_SIZE);

    const getPagedData = (list, page) =>
        list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <NavBar back="Back" onBack={() => navigate(`/WorkList`)}>
                Work Detail
            </NavBar>

            <CapsuleTabs>
                <CapsuleTabs.Tab
                    title={`Todo List(${skuList.length})`}
                    key="todo"
                >
                    <List renderHeader={() => 'SKU列表'}>
                        {getPagedData(skuList, todoPage).map((sku) => (
                            <List.Item
                                key={sku}
                                onClick={() =>
                                    navigate(
                                        `/WorkDetail_MergeLocation/${sku}/${encodeURIComponent('todo')}`
                                    )
                                }
                            >
                                {`SKU: ${sku}`}
                            </List.Item>
                        ))}
                    </List>

                    {/* 分页按钮 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px' }}>
                        <Button
                            size="small"
                            onClick={() => setTodoPage((prev) => Math.max(1, prev - 1))}
                            disabled={todoPage === 1}
                        >
                            上一页
                        </Button>
                        <span style={{ alignSelf: 'center' }}>
                            第 {todoPage} / {todoTotalPages} 页
                        </span>
                        <Button
                            size="small"
                            onClick={() =>
                                setTodoPage((prev) =>
                                    Math.min(todoTotalPages, prev + 1)
                                )
                            }
                            disabled={todoPage === todoTotalPages}
                        >
                            下一页
                        </Button>
                    </div>
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab
                    title={`Today History(${doneList.length})`}
                    key="done"
                >
                    <List renderHeader={() => 'History'}>
                        {getPagedData(doneList, donePage).map((sku) => (
                            <List.Item
                                key={sku}
                                onClick={() =>
                                    navigate(
                                        `/WorkDetail_MergeLocation/${sku}/${encodeURIComponent('done')}`
                                    )
                                }
                            >
                                {`SKU: ${sku}`}
                            </List.Item>
                        ))}
                    </List>

                    {/* 分页按钮 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px' }}>
                        <Button
                            size="small"
                            onClick={() => setDonePage((prev) => Math.max(1, prev - 1))}
                            disabled={donePage === 1}
                        >
                            上一页
                        </Button>
                        <span style={{ alignSelf: 'center' }}>
                            第 {donePage} / {doneTotalPages} 页
                        </span>
                        <Button
                            size="small"
                            onClick={() =>
                                setDonePage((prev) =>
                                    Math.min(doneTotalPages, prev + 1)
                                )
                            }
                            disabled={donePage === doneTotalPages}
                        >
                            下一页
                        </Button>
                    </div>
                </CapsuleTabs.Tab>
            </CapsuleTabs>
        </div>
    );
};

export default LocationList;
