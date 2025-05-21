import React, { useEffect, useState } from 'react';
import { Button, CapsuleTabs, List, NavBar, Selector, Toast } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Radio, Space } from 'antd';
import { request } from '../../../../util/request';



import {AddCircleOutline,DeleteOutline } from "antd-mobile-icons";
const LocationPage = () => {
    const { sku, key } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({ steps: [], expectedLocation: [], currentLocation: [] });
    const [selectedValues, setSelectedValues] = useState({});
    const [loading, setLoading] = useState(false);

    const [reasonMap, setReasonMap] = useState({}); // id -> reason index
    const [reasonModal, setReasonModal] = useState({ open: false, targetId: null, targetType: null });
    const [selectedReasonIndex, setSelectedReasonIndex] = useState(null);
    const [customReasons, setCustomReasons] = useState([
        { index: 1, label: "Big Pallet, they are next to each other" },
        { index: 2, label: "Nothing found" },
        { index: 3, label: "No space" },
    ]);

    const [newReasonInput, setNewReasonInput] = useState('');
    const [showReasonInput, setShowReasonInput] = useState(false);


    const handleSelectorChange = (id, value, type) => {
        if (value === 'N') {
            setReasonModal({ open: true, targetId: id, targetType: type });
        } else {
            setSelectedValues(prev => ({
                ...prev,
                [type]: {
                    ...(prev[type] || {}),
                    [id]: 'Y',
                }
            }));
            setReasonMap(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        }
    };

    const renderSelector = (id, type, defaultValue) => {
        const value = selectedValues?.[type]?.[id] || defaultValue;
        const reasonIndex = reasonMap?.[id];

        return (
            <Selector
                columns={2}
                options={[
                    { label: 'Y', value: 'Y' },
                    { label: reasonIndex ? <span style={{ color: 'red' }}>{reasonIndex}</span> : 'N', value: 'N' }
                ]}
                value={[value]}
                onChange={val => handleSelectorChange(id, val[0], type)}
            />
        );
    };

    const handleAddReason = () => {
        if (!newReasonInput.trim()) return;
        const newIndex = (customReasons[customReasons.length - 1]?.index || 0) + 1;
        setCustomReasons(prev => [...prev, { index: newIndex, label: newReasonInput.trim() }]);
        setNewReasonInput('');
    };

    const handleDeleteReason = (indexToDelete) => {
        const updated = customReasons.filter(r => r.index !== indexToDelete).map((r, i) => ({
            index: i + 1,
            label: r.label
        }));
        setCustomReasons(updated);
    };


    const handleReasonConfirm = () => {
        const { targetId, targetType } = reasonModal;
        if (!selectedReasonIndex) {
            Toast.show({ content: 'Please select a reason' });
            return;
        }

        setSelectedValues(prev => ({
            ...prev,
            [targetType]: {
                ...(prev[targetType] || {}),
                [targetId]: 'N',
            }
        }));
        setReasonMap(prev => ({
            ...prev,
            [targetId]: selectedReasonIndex,
        }));

        setReasonModal({ open: false, targetId: null, targetType: null });
        setSelectedReasonIndex(null);
    };

    const handleSubmit = async () => {
        try {
            const userStr = localStorage.getItem('user');
            const userInfo = JSON.parse(userStr);
            const requestData = {
                ...selectedValues,
                user: { username: userInfo.username },
                reasons: reasonMap,
            };

            await request("/updateFinish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            Toast.show({ content: "success" });
            setSelectedValues({});
            setReasonMap({});

            const result = await request("/getNext");
            navigate(`/WorkDetail_MergeLocation/${result.sku}`);
        } catch (error) {
            console.log(error);
            Toast.show({ content: 'Error!' });
        }
    };

    const handleNextClick = () => {
        Modal.confirm({
            title: '',
            content: 'Is it finished？',
            confirmText: 'Yes',
            cancelText: 'No',
            onCancel: () => console.log('否'),
            onOk: async () => await handleSubmit(),
        });
    };

    useEffect(() => {
        if (sku) {
            setLoading(true);
            request(`/skuDetail/${encodeURIComponent(sku)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then((response) => {
                setData({
                    steps: response.steps || [],
                    expectedLocation: response.expectedLocation || [],
                    currentLocation: response.currentLocation || []
                });
            }).catch(() => {
                Toast.show('Error fetching data');
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [sku]);

    const handleSkipReasonConfirm = (reason) => {
        request("/skip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reasonType: reason, sku }),
        }).then(async () => {
            const result = await request("/getNext");
            navigate(`/WorkDetail_MergeLocation/${result.sku}`);
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSkipReason, setSelectedSkipReason] = useState(null);

    const handleSkipOk = () => {
        if (!selectedSkipReason) {
            Modal.warning({
                title: "Please select a reason",
                content: "You need to select a reason before skipping.",
            });
            return;
        }
        handleSkipReasonConfirm(selectedSkipReason);
        setIsModalOpen(false);
        setSelectedSkipReason(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <NavBar back="Back" onBack={() => navigate(`/WorkDetail_MergeLocation_list`)} style={{ backgroundColor: '#007bff', color: 'white' }}>
                {sku}
            </NavBar>

            {/* steps and current locations */}
            <CapsuleTabs>
                <CapsuleTabs.Tab title='Moving Steps' key='steps'>
                    <List>
                        {data?.steps.map((step, index) => (
                            <List.Item key={index} extra={renderSelector(step.id, "steps", step.isFinish)}>
                                <p>
                                    Move <span style={{ color: 'red' }}>{step.pallet_count}</span> pallets <br />
                                    from <span style={{ color: 'red' }}>{step.from_location}</span> to
                                    <span style={{ color: 'blue' }}> {step.to_location}</span>
                                </p>
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>

                <CapsuleTabs.Tab title='Current Location' key='current'>
                    <List>
                        {data?.currentLocation?.map((item, index) => (
                            <List.Item key={index}>{item.location}：{item.pallet_qty} pallets</List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
            </CapsuleTabs>


            {/*<! 预期库位 >*/}
            <CapsuleTabs>
                <CapsuleTabs.Tab title='Expected Location' key='expected'>
                    <List>
                        {data?.expectedLocation.map((item, index) => (
                            <List.Item
                                key={index}
                                extra={item?.pallet_qty === 0
                                    ? renderSelector(item.id, "expectedLocation", item.isFinish)
                                    : null}
                            >
                                {item.location}：{item.pallet_qty} pallets
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
            </CapsuleTabs>

            {key !== 'done' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 10px' }}>
                    <Button color="success" onClick={() => window.history.back()}>Last</Button>
                    <Button color="warning" onClick={() => setIsModalOpen(true)}>Skip</Button>
                    <Button color="primary" onClick={handleNextClick}>Next</Button>
                </div>
            )}

            {/* 跳过 SKU 的原因弹窗 */}
            <Modal
                title="Why skip?"
                open={isModalOpen}
                onOk={handleSkipOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Radio.Group onChange={(e) => setSelectedSkipReason(e.target.value)}>
                    <Space direction="vertical">
                        {customReasons.map(r => (
                            <Radio key={r.index} value={r.index}>{r.index}. {r.label}</Radio>
                        ))}
                    </Space>
                </Radio.Group>
            </Modal>

            {/* 选择 N 的原因弹窗 */}
            <Modal
                title="Why Click 'N' "
                open={reasonModal.open}
                onOk={handleReasonConfirm}
                onCancel={() => {
                    setReasonModal({ open: false, targetId: null, targetType: null });
                    setSelectedReasonIndex(null);
                    setShowReasonInput(false);
                }}
            >
                <Radio.Group
                    onChange={(e) => setSelectedReasonIndex(e.target.value)}
                    value={selectedReasonIndex}
                    style={{ width: '100%' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {customReasons.map(reason => (
                            <div
                                key={reason.index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                }}
                            >
                                <Radio value={reason.index}>
                                    {reason.index}. {reason.label}
                                </Radio>

                                <span
                                    style={{
                                        color: 'red',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        padding: '0 4px'
                                    }}
                                    onClick={() => handleDeleteReason(reason.index)}
                                >
                    <DeleteOutline />️
                </span>
                            </div>
                        ))}
                    </Space>
                </Radio.Group>



                {/* 添加新原因 */}
                <div style={{ marginTop: 12 }}>
                    {!showReasonInput ? (
                        <AddCircleOutline
                            style={{ fontSize: 16, cursor: 'pointer' }}
                            onClick={() => setShowReasonInput(true)}
                        />

                    ) : (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <input
                                value={newReasonInput}
                                onChange={e => setNewReasonInput(e.target.value)}
                                placeholder="New reason"
                                style={{ flex: 1, padding: 4 }}
                            />
                            <AddCircleOutline
                                style={{ fontSize: 16, color: 'green', cursor: 'pointer' }}
                                onClick={handleAddReason}
                            />
                        </div>
                    )}
                </div>
            </Modal>


        </div>
    );
};

export default LocationPage;
