import React, {useEffect, useRef, useState} from 'react';
import {Button, CapsuleTabs, List, NavBar, Selector, Toast} from 'antd-mobile';
import {useNavigate, useParams} from 'react-router-dom';
import {Modal} from "antd";
import {request} from "../../../../util/request";
import  useAuthRedirect from "../../useAuthRedirect"


const PalletPage = () => {
    const authenticated =useAuthRedirect();
    const {sku,key} = useParams();  // 获取动态路由中的 sku 参数
    const navigate = useNavigate();  // Replace useHistory with useNavigate
    // 存储从后端获取的数据
    const [data, setData] = useState({ steps: [], expectedPallet: [] ,currentPallet:[]});
    // 存储用户选择的值（key: id, value: 选择内容）
    const [selectedValues, setSelectedValues] = useState({});

    const [loading, setLoading] = useState(false);

    // 用户选择时更新状态
    const handleSelectorChange = (id, value, type) => {
        const userStr = localStorage.getItem('user');
        const userInfo = JSON.parse(userStr);

        setSelectedValues(prev => {
            return {
                ...prev,
                [type]: {
                    ...(prev[type] || {}),  // Ensure that previous data for the `type` is not lost
                    [id]: value,            // Update the current selected item
                },
                username: userInfo.username
            };
        });
    };



    // 提交数据到后端
    const handleSubmit = async () => {
        try {
            //if (!authenticated) return;
            request("/updatePalletFinish", {
                method: "POST",

                body: JSON.stringify(selectedValues),
            }).then(response=>{
                setSelectedValues({});
                //跳转到下一个sku
                request("/getNextPallet",{
                    method: 'GET',  // 使用 GET 请求
                       }).then(result=>{
                        console.log("result "+result)
                    navigate(`/WorkDetail_MergePallet/${result.sku}/${encodeURIComponent('todo')}`);
                })


            });
        } catch (error) {
            Toast.show({content: 'Error!'});
        }
    };

    // 点击 Next 按钮时将数据传递给后端
    const handleNextClick = async () => {
        //if (!authenticated) return;
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
        //if (!authenticated) return;
        if (sku) {
            setLoading(true);

            request(`/MergePalletDetail/${encodeURIComponent(sku)}`, {method:'GET'})  // 后端接口，根据 sku 请求数据
                .then((response) => {
                    // 初始化数据
                    setData({
                        steps: response.steps || [],
                        expectedPallet: response.expectedPallet || [],
                        currentPallet: response.currentPallet || []
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




    return (
        <div>
            <NavBar back="Back" onBack={() => navigate(`/WorkDetail_MergePallet_list`)}
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
                                    defaultValue={[step.is_finish]}
                                    onChange={value => handleSelectorChange(step.id, value[0],"steps")} // 监听变化
                                />
                            }>
                                <p>

                                    Move {step.pieces} pcs from <span style={{ color: 'red' }}>{step.from_pallet} [{step.from_location}] </span>
                                     to  <span style={{ color: 'blue' }}> {step.to_pallet} [{step.to_location}] </span>
                                </p>

                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>

                {/*Current Location */}
                <CapsuleTabs.Tab title='Current Location' description='' key='fruits'>
                    <List>
                        {(data?.currentPallet?? []).map((item, index) => (
                            <List.Item key={index}>{item.pallet_no}：{item.qty} pcs</List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>
            </CapsuleTabs>


            {/*<! 预期库位 >*/}
            <CapsuleTabs>
                <CapsuleTabs.Tab title='Expected Location' description='' key='fruits'>
                    <List>
                        {data?.expectedPallet.map((item, index) => (
                            <List.Item
                                key={index}
                                extra={
                                    item?.qty === 0 ? (
                                        <Selector
                                            columns={2}
                                            options={selectorOptions}
                                            value={selectedValues?.[item.id]} // 绑定当前项的选择值
                                            defaultValue={[item.isFinish]}
                                            onChange={value => handleSelectorChange(item.id, value[0], "expectedPallet")} // 监听选择变化
                                        />
                                    ) : null
                                }
                            >
                                {item.pallet_no}：{item.qty} pallets
                            </List.Item>
                        ))}
                    </List>
                </CapsuleTabs.Tab>

            </CapsuleTabs>

            {key !== 'done' && (
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <Button color="success" onClick={() => window.history.back()}>  Last</Button>

                <Button color="success" onClick={handleNextClick}>Next  </Button>
            </div>
                )}

        </div>
    );
};

export default PalletPage;
