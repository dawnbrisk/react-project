import {message} from "antd";
import * as XLSX from "xlsx";
import {request} from "../../../util/request";


const uploadPickingLists = (files: File[]) => {
    const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (!(result instanceof ArrayBuffer)) {
                    return reject(new Error("Invalid file format"));
                }
                resolve(result);
            };
            reader.onerror = () => reject(new Error("File reading failed"));
            reader.readAsArrayBuffer(file);
        });
    };

    const parseExcelFile = async (file: File) => {
        const buffer = await readFileAsArrayBuffer(file);
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, {type: "array"});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        return jsonData.map((row: Record<string, any>) => {
            let offShelfTime = row["下架时间"];

            if (typeof offShelfTime === "number") {
                const dateObj = XLSX.SSF.parse_date_code(offShelfTime);
                if (dateObj) {
                    const localDate  = new Date(dateObj.y, dateObj.m - 1, dateObj.d, dateObj.H, dateObj.M, dateObj.S);
                    offShelfTime = formatDateTime(localDate);
                }
            }


            function formatDateTime(date) {
                const pad = n => n.toString().padStart(2, '0');
                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
                    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            }

            return {
                picking_order_number: row["拣货单号"],
                item_code: row["Item Code"],
                item_no: row["List NO."],
                operator_account: row["操作账号"],
                goods_quantity: row["已下架数量"],
                scan_time: offShelfTime
            };
        });
    };

    const processFiles = async () => {
        try {
            let allData: any[] = [];
            for (const file of files) {
                const parsedData = await parseExcelFile(file);
                allData.push(...parsedData);
                allData = allData.filter(item => item.goods_quantity !== undefined);

            }

            const response = await request("/uploadPickingList", {
                method: "POST",
                body: JSON.stringify(allData)
            });

            message.success("All files uploaded successfully");
        } catch (error) {
            message.error("Upload failed: " + error.message);
            console.error("Error:", error);
        }
    };

    processFiles();
    return false; // Prevent Ant Design auto-upload
};


export default uploadPickingLists;
