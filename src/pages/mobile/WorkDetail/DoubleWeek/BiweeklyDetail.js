import React, { useState } from 'react';
import { NavBar, List } from 'antd-mobile';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ToCheckList = () => {
    const { item_code } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { pallet_qty_combined = '', location_code = '' } = location.state || {};
    const palletList = pallet_qty_combined.split('+').map((entry, index) => {
        const [palletInfo, qty] = entry.split(':');
        return {
            id: index,
            palletInfo,
            qty,
        };
    });

    // 用于记录每个 pallet 的输入值（按 index 作为 key）
    const [inputValues, setInputValues] = useState({});

    const handleInputChange = (index, value) => {
        setInputValues((prev) => ({
            ...prev,
            [index]: value,
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

            <p style={{ textAlign: 'center', marginTop: '12px', fontWeight: 'bold' }}>
                {location_code}
            </p>

            <List
                header={
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                        Current Location & Qty
                    </div>
                }
            >
                {palletList.map((pallet, index) => (
                    <List.Item key={index}>
                        <div style={{ marginBottom: '8px' }}>
                            {pallet.palletInfo} : {pallet.qty} pcs
                        </div>
                        <input
                            type="text"
                            placeholder="请输入备注或数量"
                            value={inputValues[index] || ''}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '6px 8px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </List.Item>
                ))}
            </List>
        </div>
    );
};

export default ToCheckList;
