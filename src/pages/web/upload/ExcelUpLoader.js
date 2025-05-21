import React, { useState } from "react";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import { Upload, Button, message, Space, Spin } from "antd";
import * as XLSX from "xlsx";
import { request } from "../../../util/request";

import uploadPickingLists from "./BatchUploadPickingList";
import doubleCheck from "./DoubleCheck";

const { Dragger } = Upload;

const ExcelUpload = () => {
    const [uploading, setUploading] = useState(false);

    const handleExport = () => {
        const exportData = [
            { item_code: "A001", qty: 100, location: "L01" },
            { item_code: "B002", qty: 200, location: "L02" },
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
        XLSX.writeFile(workbook, "exported_data.xlsx");
        message.success("Exported data.xlsx");
    };

    const handleUpload = (file: File) => {
        setUploading(true); // 开始上传，设为true

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (!(result instanceof ArrayBuffer)) {
                message.error("Invalid file format");
                setUploading(false); // 出错也结束loading
                return;
            }

            const data = new Uint8Array(result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const formattedData = jsonData.map((row: Record<string, unknown>) => ({
                item_code: row["Item Code"],
                Current_Inventory_Qty: row["Current Inventory Qty"],
                Location_Code: row["Location Code"],
                Pallet_Code: row["Pallet Code"],
                In_Stock_Time: row["In Stock Time"],
                Length: row["Length(cm)"],
                Width: row["Width(cm)"],
                Height: row["Height(cm)"],
            }));

            request("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            }).then((response) => {
                setUploading(false);
                message.success(response.status);

            }).catch(() => {
                message.error("Upload failed");
                setUploading(false);
            }).finally(() => {
                setUploading(false); // 请求结束，无论成功失败都结束loading
            });
        };

        reader.readAsArrayBuffer(file);
        return false; // 阻止默认自动上传
    };

    const commonDraggerProps = {
        multiple: true,
        showUploadList: false,
        maxCount: 1,
        style: { width: 250 },
    };

    return (
        <Space direction="horizontal" size="large" style={{ width: "100%", padding: 16 }}>

            <Dragger {...commonDraggerProps} beforeUpload={doubleCheck}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Upload Biweeks Check List</p>
            </Dragger>

            <Dragger
                {...commonDraggerProps}
                beforeUpload={(file, fileList) => {
                    uploadPickingLists(fileList);
                    return false;
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Upload Picking List</p>
            </Dragger>

            <Dragger {...commonDraggerProps} beforeUpload={handleUpload} accept=".xlsx,.xls" disabled={uploading}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    {uploading ? <><Spin /> Uploading...</> : "Upload All Items"}
                </p>
            </Dragger>

            <Button
                type="primary"
                icon={<DownloadOutlined style={{ fontSize: 24 }} />}
                onClick={handleExport}
                style={{
                    width: 250,
                    height: 120,
                    fontSize: 16,
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                disabled={uploading} // 上传中禁用导出按钮，避免操作冲突
            >
                Export Daily Data
            </Button>

        </Space>
    );
};

export default ExcelUpload;
