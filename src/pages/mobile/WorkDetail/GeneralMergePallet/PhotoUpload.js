import React, { useState } from 'react';
import { Button, ImageUploader, Toast } from 'antd-mobile';
import {request} from "../../../../util/request";
import config from "../../../../util/config";

const PhotoUpload: React.FC<{ onUploadSuccess?: (res: any) => void }> = ({ onUploadSuccess }) => {
    const [fileList, setFileList] = useState([]);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('files', file);

        try {
            const uploadRes = await request('/uploadFiles', { body: formData });

            Toast.show({ icon: 'success', content: 'success' });

            if (onUploadSuccess) {
                onUploadSuccess(uploadRes);  // ✅ 回传给父组件
            }

            const fullUrl = `${config.baseURL}${uploadRes}`;

            return {
                url: fullUrl, // AntD Mobile ImageUploader 要求
            };
        } catch (error) {
            console.error(error);
            Toast.show({ icon: 'fail', content: 'fail' });

        }
    };

    return (
        <div style={{ padding: 16 }}>
            <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={handleUpload}
                capture="environment"
                maxCount={1}
            >
                <Button block color="primary">Take Photo</Button>
            </ImageUploader>
        </div>
    );
};


export default PhotoUpload;
