import React, { useRef, useState } from 'react'
import {
    Form,
    Input,
    Button,
    Selector,
    NavBar,
    Toast,
} from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../util/request'

const UpDownMove = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    // 单独用于扫码 JSON 输入
    const [scanBuffer, setScanBuffer] = useState('')


    const onFinish = async (values) => {
        try {
            const userAccount = localStorage.getItem('user')
            const parsedUser = JSON.parse(userAccount)

            const valuesWithUser = {
                ...values,
                username: parsedUser.username,
                status: 1,
            }

            await request('/upDownMoveInsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valuesWithUser),
            })

            Toast.show({ content: 'success!', duration: 1500 })
            form.resetFields(['fromLocation'])
            form.resetFields(['toLocation'])
            form.resetFields(['location'])
            setScanBuffer('')
        } catch (error) {
            console.log(error)
            Toast.show({ content: 'Error!' + error, duration: 2000 })
        }
    }



    return (
        <>
            <NavBar back="Back" onBack={() => window.history.back()}>
                Work Detail
            </NavBar>

            <Form
                form={form}
                name="form"
                onFinish={onFinish}
                footer={
                    <Button block type="submit" color="primary" size="large">
                        Confirm
                    </Button>
                }
            >
                <Form.Header>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>Move a pallet In Single Location</span>
                        <Button size="small" color="primary" onClick={() => navigate('/history')}>
                            History
                        </Button>
                    </div>
                </Form.Header>



                {/* location 真正用于提交的字段 */}
                <Form.Item
                    name="location"
                    label="location"
                    help="location"

                >
                    <Input
                        placeholder="please scan or input JSON with DESC"
                        value={form.getFieldValue('location')}
                        onChange={(val) => {
                            // 手动设置值（先显示用户输入）
                            form.setFieldsValue({ location: val })

                            // 100ms debounce 提取 DESC
                            if (window.descDebounceTimer) clearTimeout(window.descDebounceTimer)
                            window.descDebounceTimer = setTimeout(() => {
                                try {
                                    const json = JSON.parse(val)
                                    if (json.DESC) {
                                        let desc = json.DESC
                                        console.log("desc:"+desc);
                                        // 无条件去掉前三个字符（不管是不是 101）
                                        if (desc.length > 3) {
                                            desc = desc.substring(3)
                                        }

                                        form.setFieldsValue({ location: desc })
                                    }
                                } catch (err) {
                                    // 无效 JSON，不处理
                                }
                            }, 100)
                        }}
                    />
                </Form.Item>


                <Form.Item
                    name="fromLocation"
                    label="from _ floor"
                    rules={[
                        { required: true, message: 'Please select the from floor!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const toLocation = getFieldValue('toLocation')
                                if (value === toLocation) {
                                    return Promise.reject('From and To floors cannot be the same!')
                                }
                                return Promise.resolve()
                            },
                        }),
                    ]}
                    getValueFromEvent={(value) => value[0]}
                >
                    <Selector
                        columns={6}
                        options={[
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="toLocation"
                    label="to _ floor"
                    rules={[
                        { required: true, message: 'Please select the to floor!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const fromLocation = getFieldValue('fromLocation')
                                if (value === fromLocation) {
                                    return Promise.reject('From and To floors cannot be the same!')
                                }
                                return Promise.resolve()
                            },
                        }),
                    ]}
                    getValueFromEvent={(value) => value[0]}
                >
                    <Selector
                        columns={6}
                        options={[
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </>
    )
}

export default UpDownMove
