import React, { useEffect, useState } from 'react';
import { NavBar, List, CapsuleTabs, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { request } from '../../../../util/request';
import  useAuthRedirect from "../../useAuthRedirect"

const PAGE_SIZE = 10;  // 每页显示数量

const PalletList = () => {
    const authenticated =useAuthRedirect();

    const navigate = useNavigate();
    const [skuList, setSkuList] = useState([]);
    const [currentTab, setCurrentTab] = useState('A&C');
    const [currentPage, setCurrentPage] = useState(1);

    const handleTabChange = async (key) => {
        setCurrentTab(key);
        setCurrentPage(1); // 切换 tab 时重置页码
        try {
            const response = await request('/areaList', {
                method: 'POST',

                body: JSON.stringify({ selectedTab: key }),
            });
            setSkuList(response || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        //if (!authenticated) return;
        handleTabChange('A&C');
    }, []);

    const handleItemClick = (sku, status = 'todo') => {
        navigate(`/WorkDetail_MergePallet/${sku}/${encodeURIComponent(status)}`);
    };

    // 当前分页数据
    const pagedList = skuList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const totalPages = Math.ceil(skuList.length / PAGE_SIZE);

    return (
        <div>
            <NavBar back="Back" onBack={() => navigate('/WorkList')}>
                Merge Pallet
            </NavBar>

            <CapsuleTabs onChange={handleTabChange} defaultActiveKey="A&C">
                {['A&C', 'Z', 'History'].map((key) => (
                    <CapsuleTabs.Tab key={key} title={key} description="">
                        <List renderHeader={() => `${key} 列表`}>
                            {pagedList.map((sku) => (
                                <List.Item
                                    key={sku}
                                    onClick={() =>
                                        handleItemClick(sku, key === 'B' ? 'done' : 'todo')
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
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Last Page
                            </Button>
                            <span style={{ alignSelf: 'center' }}>
                                Page {currentPage} / {totalPages}
                            </span>
                            <Button
                                size="small"
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next Page
                            </Button>
                        </div>
                    </CapsuleTabs.Tab>
                ))}
            </CapsuleTabs>
        </div>
    );
};

export default PalletList;
