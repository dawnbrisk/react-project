import React, {useState, useRef} from 'react';
import {
    Form,
    Input,
    Button,
    Toast,
    Popup,
    List,
    NavBar,
} from 'antd-mobile';
import {request} from "../../../../util/request";

import {CameraOutline} from "antd-mobile-icons";

export default function MergePalletPage() {
    const [form] = Form.useForm();
    const [skuA, setSkuA] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const extractPalletInfo = (val: string) => {
        try {
            const json = JSON.parse(val);
            return {
                code: json.DESC || '',
                sku: json.R1_SKU || '',
            };
        } catch {
            return {code: val, sku: ''};
        }
    };

    const handlePalletChange = (prefix: 'palletA' | 'palletB', val: string) => {
        const {code, sku} = extractPalletInfo(val);
        const fieldUpdate: any = {
            [`${prefix}_code`]: code,
            [`${prefix}_raw`]: val,
        };
        if (prefix === 'palletA') {
            setSkuA(sku);
        }
        form.setFieldsValue(fieldUpdate);
    };

    const handleSubmit = async () => {

        const values = form.getFieldsValue();

        const response = await request('/checkIfExist', {body: JSON.stringify({
                fromPallet: values.palletA_code,
                toPallet: values.palletB_code,
            })});
        debugger;
        if(response >=1 ){
            Toast.show({icon: 'fail', content: 'Duplicate submission detected, Please check your submission history'});
            return;
        }


        let fileUrls = [];

        if (selectedFiles.length > 0) {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('files', file);
            });

            try {
                const uploadRes = await request('/uploadFiles', { body: formData });
                fileUrls = uploadRes || [];
            } catch (error) {
                console.error('fail to upload:', error);
                return;
            }
        }

        try {
            const res = await request('/generalMergePallets', {
                body: JSON.stringify({
                    palletA_code: values.palletA_code,
                    palletB_code: values.palletB_code,
                    fileUrls: fileUrls, // 或 fileIds，看你后端的逻辑
                })
            });

            if (res) {
                Toast.show({icon: 'success', content: 'Merged successfully'});

            } else {
                Toast.show({icon: 'fail', content: 'Submission failed'});
            }

            form.resetFields();
            setSkuA('');
            setSelectedFiles([]);
        } catch (err) {
            Toast.show({icon: 'fail', content: 'Network error'});
        }
    };

    const handleOpenPopup = () => {
        fetchHistory();
        setHistoryVisible(true);
    };

    const fetchHistory = async () => {
        try {
            const res = await request('/generalMergeHistory');
            setHistoryList(res);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) {
            Toast.show({content: 'No file selected'});
            return;
        }

        files.forEach(file => {
            Toast.show('Selected file:', file.name, file.type, file.size);
        });

        setSelectedFiles(prev => [...prev, ...files]);
        Toast.show({content: `Selected ${files.length} image(s)`, duration: 1500});
    };


    return (
        <div style={{padding: 12}}>
            <NavBar
                back="Back"
                onBack={() => window.history.back()}
                style={{backgroundColor: '#007bff', color: 'white'}}
                right={
                    <Button
                        size="small"
                        onClick={handleOpenPopup}
                        style={{color: 'white', border: 'none', background: 'transparent'}}
                    >
                        History
                    </Button>
                }
            >
                Merge Pallet
            </NavBar>

            <div
                style={{
                    textAlign: 'center',
                    margin: '12px 0',
                    padding: '12px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '12px',
                    fontSize: 16,
                }}
            >
                Current SKU: <strong>{skuA || '-'}</strong>
            </div>

            <Form form={form} layout="horizontal">
                {/* Pallet A */}
                <div
                    style={{
                        marginBottom: 12,
                        padding: 12,
                        borderRadius: 12,
                        border: '1px solid #ddd',
                    }}
                >
                    <Form.Item
                        name="palletA_code"
                        label="Pallet A Code"
                        style={{marginBottom: 8}}
                    >
                        <Input
                            placeholder="Scan Pallet A "
                            onBlur={(e) => handlePalletChange('palletA', e.target.value)}
                        />
                    </Form.Item>
                </div>

                {/* Pallet B */}
                <div
                    style={{
                        marginBottom: 12,
                        padding: 12,
                        borderRadius: 12,
                        border: '1px solid #ddd',
                    }}
                >
                    <Form.Item
                        name="palletB_code"
                        label="Pallet B Code"
                        style={{marginBottom: 8}}
                    >
                        <Input
                            placeholder="Scan Pallet B "
                            onBlur={(e) => handlePalletChange('palletB', e.target.value)}
                        />
                    </Form.Item>
                </div>

                {/* Submit & Upload */}
                <div style={{marginTop: 24, textAlign: 'center'}}>
                    <div style={{marginTop: 8}}>
                        <div onClick={handleUploadClick} style={{ cursor: 'pointer', color: '#3880ff', fontSize: '24px' }}>
                            <CameraOutline />
                        </div>


                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                        />
                    </div>


                    {/* Image Preview */}
                    {selectedFiles.length > 0 && (
                        <div style={{marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap',justifyContent: 'center'}}>
                            {selectedFiles.map((file, index) => (
                                <div key={index} style={{position: 'relative'}}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 8}}
                                    />
                                    <Button
                                        size="mini"
                                        color="danger"
                                        fill="outline"
                                        style={{
                                            position: 'absolute',
                                            top: -6,
                                            right: -6,
                                            padding: 0,
                                            width: 18,
                                            height: 18,
                                            lineHeight: '16px',
                                            fontSize: 10,
                                        }}
                                        onClick={() =>
                                            setSelectedFiles(prev => prev.filter((_, i) => i !== index))
                                        }
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <span/>
                    <Button color="primary" size="large" onClick={handleSubmit} style={{ marginTop: '16px' }}>
                        Merge & Save
                    </Button>

                </div>
            </Form>



            {/* History Popup */}
            <Popup
                visible={historyVisible}
                onMaskClick={() => setHistoryVisible(false)}
                bodyStyle={{height: '60%',overflowY: 'auto'}}
            >
                <div style={{padding: 16}}>
                    <h3>Today History （Total: {historyList.length} ）</h3>
                    <List>
                        {historyList.map((item, idx) => (
                            <List.Item key={idx}>
                                <div>
                                    <div><strong>SKU:</strong> {item.sku}  -  {item.pieces} pcs</div>

                                    <div><strong>From:</strong> {item.from_location} / {item.from_pallet}</div>
                                    <div><strong>To:</strong> {item.to_location} / {item.to_pallet}</div>
                                    <div><strong>Time:</strong> {new Date(item.insert_time).toLocaleString()}</div>
                                </div>
                            </List.Item>
                        ))}
                    </List>
                </div>
            </Popup>
        </div>
    );
}
