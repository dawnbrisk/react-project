import {message} from 'antd';

import * as XLSX from 'xlsx';

import {request} from "../../../util/request"; // 发送请求


// 上传文件时的处理函数
const doubleCheck = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
        const binaryStr = reader.result;
        const workbook = XLSX.read(binaryStr, {type: 'binary'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];


        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        const skus = jsonData.map((row) => row[0]); // 获取第一列的所有SKU

        // 上传给后端
        try {
            const response = await request('/api/doubleWeekCheck', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(skus)
            });

            // 假设后端返回的格式是类似于： [{"item_code":"WF318735AAB", ...}]
            exportToExcel(response);  // 导出返回的数据到Excel
        } catch (error) {
            message.error('上传失败');
            console.log(error)
        }
    };

    reader.readAsBinaryString(file);
    return false; // 阻止默认上传行为
};

// 导出数据到Excel
const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 导出为Excel文件
    XLSX.writeFile(workbook, 'exported_data.xlsx');
};


export default doubleCheck;
