import React, {useEffect, useState} from 'react';
import {Button, CapsuleTabs, List, NavBar, Selector, Toast} from 'antd-mobile';
import { useNavigate, useParams} from 'react-router-dom';
import {Modal, Radio, Space} from "antd";
import {request} from "../../../../util/request";


const LocationPage = () => {

    const {sku,key} = useParams();  // 获取动态路由中的 sku 参数
    const navigate = useNavigate();  // Replace useHistory with useNavigate
    // 存储从后端获取的数据
    const [data, setData] = useState({ steps: [], expectedLocation: [] ,currentLocation:[]});
    // 存储用户选择的值（key: id, value: 选择内容）
    const [selectedValues, setSelectedValues] = useState({});

    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);


    // 用户选择时更新状态
    const handleSelectorChange = (id, value, type) => {
        setSelectedValues(prev => {
            return {
                ...prev,
                [type]: {
                    ...(prev[type] || {}),  // Ensure that previous data for the `type` is not lost
                    [id]: value,            // Update the current selected item
                }
            };
        });
    };



    // 提交数据到后端
    const handleSubmit = async () => {
        try {


            const userStr = localStorage.getItem('user');
            const userInfo = JSON.parse(userStr);
            const requestData = {
                ...selectedValues,
                user: {
                    username: userInfo.username
                }
            };


             request("/updateFinish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            }).then(response=>{
                Toast.show({content: "success"});
                 setSelectedValues({});
                //跳转到下一个sku
                 request("/getNext").then(result=>{
                     navigate(`/WorkDetail_MergeLocation/${result.sku}`);
                 })
            });
        } catch (error) {
            console.log(error);
            Toast.show({content: 'Error!'});
        }
    };

    // 点击 Next 按钮时将数据传递给后端
    const handleNextClick = async () => {

        // 发送请求到后端
        Modal.confirm({
            title: '',
            content: 'Is it finished？',
            confirmText: 'Yes',
            cancelText: 'No',
            onCancel: () => console.log('否'),
            onOk: async () => {
                await handleSubmit(selectedValues); // Only call handleNext when onOk is confirmed
            },
        })
    };

    // 使用 useEffect 在组件加载时请求数据
    useEffect(() => {
        if (sku) {
            setLoading(true);

            request(`/skuDetail/${encodeURIComponent(sku)}`, {
                method: 'GET',  // 使用 GET 请求
                headers: {
                    'Content-Type': 'application/json',  // 可选，根据后端需求设置
                },
            }).then((response) => {
                    // 初始化数据
                    setData({
                        steps: response.steps || [],
                        expectedLocation: response.expectedLocation || [],
                        currentLocation: response.currentLocation || []
                    });
                })
                .catch((error) => {
                    Toast.show('Error fetching data');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [sku]); // 依赖 sku，sku 变化时重新请求

    if (loading) {
        return <div >Loading...</div>;
    }

    const selectorOptions = [
        {label: 'Y', value: 'Y'},
        {label: 'N', value: 'N'},
    ];


    const handleOk = () => {
        if (selectedReason === null) {
            Modal.warning({
                title: "Please select a reason",
                content: "You need to select a reason before skipping.",
            });
            return;
        }

        //skip
        request("/skip",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({reasonType: selectedReason,sku:sku}),
        }).then(()=>{
            setSelectedReason(null);
            request("/getNext").then(result=>{
                navigate(`/WorkDetail_MergeLocation/${result.sku}`);
            })
        })

        setIsModalOpen(false);
        // update sku

    };


    return (
        <div>
            <NavBar back="Back" onBack={() => navigate(`/WorkDetail_MergeLocation_list`)}
                    style={{backgroundColor: '#007bff', color: 'white'}}>
                {sku}
            </NavBar>


            <CapsuleTabs>
                {/* moving steps */}
                <CapsuleTabs.Tab title='Moving Steps' description='' key='vegetables'>
                    <List>
                        {data?.steps.map((step, index) => (
                            <List.Item key={index} extra={
                                <Selector
                                    columns={2}
                                    options={selectorOptions}
                                    value={selectedValues?.[step.id]} // 绑定当前 step.id 的选择值
                                    defaultValue={[step.isFinish]}
                                    onChange={value => handleSelectorChange(step.id, value[0],"steps")} // 监听变化
                                />
                            }>
                                <p>
                                    Move <span style={{ color: 'red' }}>{step.pallet_count}</span> pallets <br/> from
                                    <span style={{ color: 'red' }}> {step.from_location} </span> to
                                    <span style={{ color: 'blue' }}> {step.to_location} </span>
                                </p>

                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>

                {/*Current Location */}
                <CapsuleTabs.Tab title='Current Location' description='' key='fruits'>
                    <List>
                        {(data?.currentLocation?? []).map((item, index) => (
                            <List.Item key={index}>{item.location}：{item.pallet_qty} pallets</List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
            </CapsuleTabs>


            {/*<! 预期库位 >*/}
            <CapsuleTabs>
                <CapsuleTabs.Tab title='Expected Location' description='' key='fruits'>
                    <List>
                        {data?.expectedLocation.map((item, index) => (
                            <List.Item
                                key={index}
                                extra={
                                    item?.pallet_qty === 0 ? (
                                        <Selector
                                            columns={2}
                                            options={selectorOptions}
                                            value={selectedValues?.[item.id]} // 绑定当前项的选择值
                                            defaultValue={[item.isFinish]}
                                            onChange={value => handleSelectorChange(item.id, value[0], "expectedLocation")} // 监听选择变化
                                        />
                                    ) : null
                                }
                            >
                                {item.location}：{item.pallet_qty} pallets
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>

            </CapsuleTabs>

            {key !== 'done' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Button color="success" onClick={() => window.history.back()}>
                        Last
                    </Button>
                    <Button color="success" onClick={()=>{setIsModalOpen(true);}}>
                        Skip
                    </Button>
                    <Button color="success" onClick={handleNextClick}>
                        Next
                    </Button>


                    <Modal
                        title="Why do you want to skip?"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={()=>{setIsModalOpen(false);}}
                    >
                        <Radio.Group onChange={(e) => setSelectedReason(e.target.value)}>
                            <Space direction="vertical">
                                <Radio value="1">Big Pallet, they are next to each other </Radio>
                                <Radio value="2">Nothing found, including on the location code</Radio>
                                <Radio value="3">Nothing found, except on the location code</Radio>
                                <Radio value="4">other</Radio>
                            </Space>
                        </Radio.Group>
                    </Modal>

                </div>
            )}

        </div>
    );
};

export default LocationPage;
