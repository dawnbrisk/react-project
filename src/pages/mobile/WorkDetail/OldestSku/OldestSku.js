import React, {useEffect, useState} from 'react';
import {NavBar, List, CapsuleTabs, Button} from 'antd-mobile';

import { useNavigate } from 'react-router-dom';

import { Spin} from "antd";
import {request} from "../../../../util/request";

const OldestSkuList = () => {

    const navigate = useNavigate();  // Replace useHistory with useNavigate
    const [skuList, setSkuList] = useState([]);


    const handleTabChange = async (key) => {

        try {
            request(`/getOldestSku?type=${encodeURIComponent(key)}`, {
                method: "GET",  // Changed to GET since it's a GetMapping
                headers: {
                    "Content-Type": "application/json",  // Optional, not required for GET requests
                },
            }).then(response=>{
                setSkuList(response);
            });

        } catch (error) {
            console.error("Error:", error);
        }
    };


    useEffect(() => {
        handleTabChange('P'); // 默认请求一次 P 类型的数据
    }, []); // 空依赖数组，确保只在组件挂载时执行一次


    return (
        <div>
            <NavBar
                back="Back"
                onBack={() => navigate(`/WorkList`)}

            >
                Merge Pallet
            </NavBar>
            {/* Tabs 横向导航栏 */}
            <CapsuleTabs onChange={(key) => handleTabChange(key)}>
                <CapsuleTabs.Tab title='P' description='' key='P'>
                    <List>
                        <List.Item>
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <span style={{fontWeight: 'bold', textAlign: 'left'}}>SKU</span>
                                <span style={{fontWeight: 'bold', textAlign: 'center'}}>In Stock Time</span>
                                <span style={{fontWeight: 'bold', textAlign: 'right'}}>Location</span>
                            </div>

                        </List.Item>
                    </List>

                    <List>
                        {skuList.map((item, index) => (
                            <List.Item
                                key={index}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#E8F5E9' : '#E3F2FD',// Alternating row colors
                                }}
                            >
                                <span style={{color: 'red'}}>{item.item_code} </span>
                                <span style={{color: 'green'}}>{item.in_stock_date} </span>
                                <span style={{color: 'blue', textAlign: 'right'}}>{item.location_code} </span>
                            </List.Item>
                        ))}
                    </List>

                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab title='ABC ' description='' key='ABC'>
                    <List>
                        <List.Item>
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <span style={{fontWeight: 'bold', textAlign: 'left'}}>SKU</span>
                                <span style={{fontWeight: 'bold', textAlign: 'center'}}>In Stock Time</span>
                                <span style={{fontWeight: 'bold', textAlign: 'right'}}>Location</span>
                            </div>

                        </List.Item>
                    </List>

                    <List>
                        {skuList.map((item, index) => (
                            <List.Item
                                key={index}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#E8F5E9' : '#E3F2FD',// Alternating row colors
                                }}
                            >
                                <span style={{color: 'red'}}>{item.item_code} </span>
                                <span style={{color: 'green'}}>{item.in_stock_date} </span>
                                <span style={{color: 'blue', textAlign: 'right'}}>{item.location_code} </span>
                            </List.Item>
                        ))}
                    </List>

                </CapsuleTabs.Tab>

            </CapsuleTabs>






        </div>
    );
};

export default OldestSkuList;
