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
import  useAuthRedirect from "../../useAuthRedirect"
import {CameraOutline} from "antd-mobile-icons";
import {message} from "antd";

export default function MergePalletPage() {
    const authenticated =useAuthRedirect();
    const [form] = Form.useForm();
    const [skuA, setSkuA] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const isValidPalletCode = (code) => {
        return /^\d{3}-\d{8}-\d{3}$/.test(code);
    };

    const handleSubmit = async () => {
        //if (!authenticated) return;
        setUploading(true); // 开始上传（显示 loading）
        const values = form.getFieldsValue();
        let { palletA_code, palletB_code } = values;

        palletA_code = palletA_code?.trim();
        palletB_code = palletB_code?.trim();

        // 先做非空校验
        if (!palletA_code || !palletB_code) {
            message.error("Both pallet codes are required.");
            setUploading(false);
            return;
        }

        // 再做格式校验
        if (!isValidPalletCode(palletA_code) || !isValidPalletCode(palletB_code)) {
            message.error("Please enter a correct pallet code (format: XXX-XXXXXXXX-XXX).");
            setUploading(false);
            return;
        }

        if (selectedFiles.length === 0) {
            message.error('photo is required !')
            setUploading(false);
            return;
        }

        const response = await request('/checkIfExist', {body: JSON.stringify({
                fromPallet: values.palletA_code,
                toPallet: values.palletB_code,
            })});

        if(response >=1 ){
            message.error({icon: 'fail', content: 'Duplicate submission detected, Please check your submission history'});
            setUploading(false);
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
                setUploading(false); // 上传失败也要恢复状态
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
        } finally {
            setUploading(false); // 无论成功失败都恢复上传状态
        }
    };

    const handleOpenPopup = () => {
        fetchHistory();
        setHistoryVisible(true);
    };

    const fetchHistory = async () => {
        //if (!authenticated) return;
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

        if (files.length > 1) {
            Toast.show({content: 'Only one photo can be uploaded'});
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
                            placeholder="Move from which pallet?"
                            value={form.getFieldValue('palletA_code')}
                            onChange={(val) => {
                                // 手动设置值（先显示用户输入）
                                //form.setFieldsValue({ palletA_code: val })

                                // 100ms debounce 提取 DESC
                                if (window.descDebounceTimer) clearTimeout(window.descDebounceTimer)
                                window.descDebounceTimer = setTimeout(() => {
                                    try {
                                        const json = JSON.parse(val)
                                        if (json.DESC) {
                                            let desc = json.DESC



                                            form.setFieldsValue({ palletA_code: desc })
                                        }
                                    } catch (err) {
                                        // 无效 JSON，不处理
                                    }
                                }, 300)
                            }}
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
                            placeholder="Move to which pallet?"
                            value={form.getFieldValue("palletB_code")}
                            onChange={(val) => {
                                // 手动设置值（先显示用户输入）
                                //form.setFieldsValue({ palletB_code: val })

                                // 100ms debounce 提取 DESC
                                if (window.descDebounceTimer) clearTimeout(window.descDebounceTimer)
                                window.descDebounceTimer = setTimeout(() => {
                                    try {
                                        const json = JSON.parse(val)
                                        if (json.DESC) {
                                            let desc = json.DESC
                                            // 无条件去掉前三个字符（不管是不是 101）


                                            form.setFieldsValue({ palletB_code: desc })
                                        }
                                    } catch (err) {
                                        // 无效 JSON，不处理
                                    }
                                }, 300)
                            }}
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
                    <Button loading={uploading}
                            disabled={uploading} color="primary" size="large" onClick={handleSubmit} style={{ marginTop: '16px' }}>
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
