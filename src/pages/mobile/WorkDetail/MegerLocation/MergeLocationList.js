import React, {useEffect, useState} from 'react';
import {NavBar, List, CapsuleTabs} from 'antd-mobile';

import { useNavigate } from 'react-router-dom';

import {Spin} from "antd";
import {request} from "../../../../util/request";

const LocationList = () => {

    const navigate = useNavigate();  // Replace useHistory with useNavigate
    const [skuList, setSkuList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch SKU data from the backend
        request('/locationList')
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                <CapsuleTabs.Tab title={`Todo List(${skuList.length})`}  description='' key='todo'>
                    <List renderHeader={() => 'SKU列表'}>
                        {skuList?.map((sku) => (
                            <List.Item key={sku} onClick={() => navigate(`/WorkDetail_MergeLocation/${sku}/${encodeURIComponent('todo')}`)}>
                                {`SKU: ${sku}`}  {/* 显示 SKU */}
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
                <CapsuleTabs.Tab title={`Today History(${doneList.length})`} description='' key='done'>
                    <List renderHeader={() => 'History'}>
                        {doneList?.map((sku) => (
                            <List.Item key={sku} onClick={() => navigate(`/WorkDetail_MergeLocation/${sku}/${encodeURIComponent('done')}`)}>
                                {`SKU: ${sku}`}
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
            </CapsuleTabs>

        </div>
    );
};

export default LocationList;
