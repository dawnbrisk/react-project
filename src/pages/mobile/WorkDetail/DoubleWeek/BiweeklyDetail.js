import React, { useState ,useEffect} from 'react';
import { NavBar, List, Toast, Button } from 'antd-mobile';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { request } from '../../../../util/request';
import { Dialog } from 'antd-mobile';


const ToCheckList = () => {
    const { item_code } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({});

    const { pallet_qty_combined = '', location_code = '', nextSkuList = [] } = location.state || {};
    const palletList = pallet_qty_combined.split('+').map((entry, index) => {
        const [palletInfo, qty] = entry.split(':');
        return {
            id: index,
            palletInfo,
            qty,
        };
    });

    useEffect(() => {
        // 每次 item_code 变化时，清空输入框状态
        setInputValues({});
    }, [item_code, location.key]);




    const handleSaveAndNext = async () => {
        const confirmed = await Dialog.confirm({
            content: 'Save & next?',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
        });
        if (!confirmed) return;


        // 构造要发送的数据
        const dataToSend = palletList.map((pallet, index) => ({
            item_code,
            pallet: pallet.palletInfo,
            input_value: inputValues[index] || '',
        }));

        try {
            await request('/update-pallets', {
                body: JSON.stringify(dataToSend),
            });

            Toast.show({ content: 'Saved successfully', duration: 1000 });

            // 跳转到下一个 SKU，如果有的话
            await goToNextSku(item_code);
        } catch (error) {
            Toast.show({ content: 'Error saving data', duration: 1500 });
            console.error('Error:', error);
        }
    };


    const goToNextSku = async (currentItemCode) => {
        const response = await request('/biweeklyList');
        const skuList = response || [];

        const next = skuList[0];

        if (next) {
            navigate(`/ToCheckList/${next.item_code}/todo`, {
                state: {
                    item_code: next.item_code,
                    pallet_qty_combined: next.pallet_qty_combined,
                    location_code: next.location_code,
                    nextSkuList: skuList,
                },
            });
        } else {
            Toast.show({ content: 'No more SKUs', duration: 1000 });
            navigate('/double_week_check');
        }
    };


    const handleInputChange = (index, value) => {
        setInputValues(prev => ({
            ...prev,
            [index]: value
        }));
    };


    return (
        <div>
            <NavBar
                back="Back"
                onBack={() => navigate(`/double_week_check`)}
                style={{ backgroundColor: '#007bff', color: 'white' }}
            >
                {item_code}
            </NavBar>

            <p style={{ textAlign: 'center', marginTop: '12px', fontWeight: 'bold' ,fontSize: '16px',}}>
                {location_code}
            </p>

            <List
                header={
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#333' }}>
                        Current Location & Qty
                    </div>
                }
            >
                {palletList.map((pallet, index) => (
                    <List.Item key={index}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ whiteSpace: 'nowrap' }}>
                                {pallet.palletInfo.length > 8
                                    ? '*' + pallet.palletInfo.slice(8)
                                    : '*'}
                                : {pallet.qty} pcs
                            </div>

                            <input
                                type="text"
                                value={inputValues[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                style={{
                                    width: '2cm',
                                    padding: '2px 2px',
                                    fontSize: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    textAlign: 'center',
                                }}
                            />
                        </div>
                    </List.Item>
                ))}

            </List>

            <div style={{ marginTop: '24px', padding: '0 16px' }}>
                <Button block color="primary" onClick={handleSaveAndNext}>
                    Save & Next
                </Button>
            </div>
        </div>
    );
};

export default ToCheckList;
