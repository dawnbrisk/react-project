import React from 'react'
import {
    Form,
    Input,
    Button,
    Selector, NavBar, Toast,
} from 'antd-mobile'
import {useNavigate} from 'react-router-dom';
import {request} from '../../../../util/request';

const UpDownMove = () => {

    const navigate = useNavigate();

    const [form] = Form.useForm(); // 创建表单实例

    const onFinish = async (values) => {

        try {

            const userAccount = localStorage.getItem("user");

            const parsedUser = JSON.parse(userAccount);

            const valuesWithUser = {
                ...values, // 复制原有 values
                username: parsedUser.username, // 添加用户账户信息
                status: 1
            };

           await request("/upDownMoveInsert", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(valuesWithUser),
            });

                Toast.show({content: 'success!', duration: 1500});
                form.resetFields(['fromLocation']);
                form.resetFields(['toLocation']);
                form.resetFields(['location']);

        } catch (error) {
            console.log(error);
            Toast.show({content: 'Error!' + error, duration: 2000});
        }
    }


    return (
        <>
            <NavBar back="Back" onBack={() => window.history.back()}>
                Work Detail
            </NavBar>

            <Form
                form={form}
                name='form'
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='large'>
                        Confirm
                    </Button>
                }
            >
                <Form.Header></Form.Header>

                <Form.Header>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{flexGrow: 1}}>Move a pallet In Single Location</span>
                        <Button size="small" color="primary" onClick={() => navigate('/history')}>
                            History
                        </Button>
                    </div>
                </Form.Header>


                <Form.Item name='location' label='location' help='location' rules={[
                    {required: true, message: 'please enter location！'},
                    {
                        pattern: /^(A|B|C)-\d{2}-\d{2}-\d{1}$/,
                        message: 'The location format must be similar to: B-xx-xx-x.',
                    },
                ]}>
                    <Input placeholder='please enter location'/>
                </Form.Item>

                <Form.Item name='fromLocation' label='from _ floor'
                           rules={[
                               {required: true, message: 'Please select the to floor!'},
                               ({getFieldValue}) => ({
                                   validator(_, value) {
                                       const toLocation = getFieldValue('toLocation');
                                       if (value === toLocation) {
                                           return Promise.reject('From and To floors cannot be the same!');
                                       }
                                       return Promise.resolve();
                                   },
                               }),
                           ]}

                           getValueFromEvent={(value) => value[0]}>
                    <Selector
                        columns={6}

                        options={[
                            {label: '1', value: '1'},
                            {label: '2', value: '2'},
                            {label: '3', value: '3'},
                            {label: '4', value: '4'},
                            {label: '5', value: '5'},
                            {label: '6', value: '6'},
                        ]}
                    />
                </Form.Item>

                <Form.Item name='toLocation' label='to _ floor'
                           rules={[
                               {required: true, message: 'Please select the from floor!'},
                               ({getFieldValue}) => ({
                                   validator(_, value) {
                                       const fromLocation = getFieldValue('fromLocation');
                                       if (value === fromLocation) {
                                           return Promise.reject('From and To floors cannot be the same!');
                                       }
                                       return Promise.resolve();
                                   },
                               }),
                           ]}

                           getValueFromEvent={(value) => value[0]}>
                    <Selector
                        columns={6}

                        options={[
                            {label: '1', value: '1'},
                            {label: '2', value: '2'},
                            {label: '3', value: '3'},
                            {label: '4', value: '4'},
                            {label: '5', value: '5'},
                            {label: '6', value: '6'},
                        ]}
                    />
                </Form.Item>
            </Form>
        </>
    )
}

export default UpDownMove