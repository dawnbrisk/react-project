import React, {useEffect, useState} from 'react';
import {NavBar, List, CapsuleTabs, Button} from 'antd-mobile';

import { useNavigate } from 'react-router-dom';

import { Spin} from "antd";
import {request} from "../../../../util/request";

const PalletList = () => {

    const navigate = useNavigate();  // Replace useHistory with useNavigate
    const [skuList, setSkuList] = useState([]);
    const [doneList, setDoneList] = useState([]);


    const handleTabChange = async (key) => {

        try {
            request("/areaList", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ selectedTab: key }),
            }).then(response=>{
                setSkuList(response);
            });

        } catch (error) {
            console.error("Error:", error);
        }
    };


    useEffect(() => {

        handleTabChange('A&C')

    }, []);


    const handleItemClick = (sku) => {

        navigate(`/WorkDetail_MergePallet/${sku}/${encodeURIComponent('todo')}`);
    };




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


                <CapsuleTabs.Tab title='A&C ' description='' key='A&C'>
                    <List renderHeader={() => 'AC列表'}>
                        {skuList?.map((sku) => (
                            <List.Item key={sku} onClick={() => handleItemClick(sku)}>
                                {`SKU: ${sku}`} {/* 显示 SKU */}
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab title='Z ' description='' key='Z'>
                    <List renderHeader={() => 'Z列表'}>
                        {skuList?.map((sku) => (
                            <List.Item key={sku} onClick={() => handleItemClick(sku)}>
                                {`SKU: ${sku}`} {/* 显示 SKU */}
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>


                <CapsuleTabs.Tab title='History' description='' key='B'>
                    <List renderHeader={() => 'B列表'}>
                        {skuList?.map((sku) => (
                            <List.Item key={sku} onClick={() =>  navigate(`/WorkDetail_MergePallet/${sku}/${encodeURIComponent('done')}`)}>

                                {`SKU: ${sku}`} {/* 显示 SKU */}
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>

            </CapsuleTabs>
        </div>
    );
};

export default PalletList;
