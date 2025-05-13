import React from "react";
import {Upload, Button, message} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {request} from "../../../util/request";

import uploadPickingLists from "./BatchUploadPickingList";
import doubleCheck from "./DoubleCheck";

const ExcelUpload = () => {


    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (!(result instanceof ArrayBuffer)) {
                message.error("Invalid file format");
                return;
            }

            const data = new Uint8Array(result);
            const workbook = XLSX.read(data, {type: "array"});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const formattedData = jsonData.map((row: Record<string, unknown>) => ({
                item_code: row["Item Code"],
                Current_Inventory_Qty: row["Current Inventory Qty"],
                Location_Code: row["Location Code"],
                Pallet_Code: row["Pallet Code"],
                In_Stock_Time: row["In Stock Time"],
                Length:row["Length(cm)"],
                Width:row["Width(cm)"],
                Height:row["Height(cm)"]
            }));

            request("/api/upload", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formattedData)
            })
                .then(response => {
                    alert(response.status);
                }) // 解析后端返回的字符串


        };

        reader.readAsArrayBuffer(file);
        return false; // 防止 Ant Design 自动上传
    };

    return (

        <div>

            {/* 双周盘点上传 */}
            <Upload showUploadList={false}
                beforeUpload={doubleCheck}  // 在上传时使用 doubleCheck 函数
            >
                <Button icon={<UploadOutlined />}>Double Weeks Check</Button>
            </Upload>

            { /*upload picking  list  */}
            <Upload
                multiple
                showUploadList={false}
                beforeUpload={(file, fileList) => {
                    uploadPickingLists(fileList);
                    return false;
                }}
            >
                <Button>Upload Picking List  </Button>
            </Upload>
            {/*upload all items */}
            <Upload multiple beforeUpload={handleUpload} showUploadList={false} accept=".xlsx,.xls">
                <Button icon={<UploadOutlined/>}>Upload All Items</Button>
            </Upload>
        </div>
    );

};

export default ExcelUpload;
