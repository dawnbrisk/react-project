import React, {useEffect, useState} from 'react';
import {NavBar, List, CapsuleTabs} from 'antd-mobile';
import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import {Spin} from "antd";
import {request} from "../../../../util/request";

const LocationList = () => {

    const navigate = useNavigate();  // Replace useHistory with useNavigate
    const [skuList, setSkuList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skuPage, setSkuPage] = useState(1);
    const [donePage, setDonePage] = useState(1);
    const pageSize = 10;
    const paginatedSkuList = skuList.slice((skuPage - 1) * pageSize, skuPage * pageSize);
    const paginatedDoneList = doneList.slice((donePage - 1) * pageSize, donePage * pageSize);



    useEffect(() => {
        // Fetch SKU data from the backend
        request('/locationList',{method:'GET'})
            .then(response => {
                setSkuList(response);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching SKU data:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Fetch SKU data from the backend
        const userStr = localStorage.getItem('user');
        const userInfo = JSON.parse(userStr);

        request('/history',{

                body: JSON.stringify({
                    username: userInfo.username
                }),
            }
        )  // Replace with your actual API endpoint
            .then(response => {
                setDoneList(response);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching SKU data:', error);
                setLoading(false);
            });
    }, []);


    if (loading) {
        return <Spin />;
    }

    return (
        <div>
            <NavBar back="Back" onBack={() => navigate(`/WorkList`)}>
                Work Detail
            </NavBar>
            {/* Tabs 横向导航栏 */}
            <CapsuleTabs>
                <CapsuleTabs.Tab title={`Todo List(${skuList.length})`} key="todo">
                    <List renderHeader={() => 'SKU列表'}>
                        {paginatedSkuList.map((sku) => (
                            <List.Item
                                key={sku}
                                onClick={() => {
                                    console.log('点击了 SKU：', sku);
                                    navigate(`/WorkDetail_MergeLocation/${sku}/${encodeURIComponent('todo')}`);
                                }}
                            >
                                {`SKU: ${sku}`}
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
                        <span>{`第 ${skuPage} 页 / 共 ${Math.ceil(skuList.length / pageSize)} 页`}</span>
                        <Button
                            size="small"
                            disabled={skuPage >= Math.ceil(skuList.length / pageSize)}
                            onClick={() => setSkuPage(skuPage + 1)}
                        >
                            下一页
                        </Button>
                    </div>
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab title={`Today History(${doneList.length})`} key="done">
                    <List renderHeader={() => 'History'}>
                        {paginatedDoneList.map((sku) => (
                            <List.Item
                                key={sku}
                                onClick={() =>
                                    navigate(`/WorkDetail_MergeLocation/${sku}/${encodeURIComponent('done')}`)
                                }
                            >
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
                        <span>{`第 ${donePage} 页 / 共 ${Math.ceil(doneList.length / pageSize)} 页`}</span>
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

export default LocationList;
