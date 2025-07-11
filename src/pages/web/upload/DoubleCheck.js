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
        function parseDateTime(dateTimeStr) {
            // 将 "2025-05-30 09:20:55" 转成 "2025-05-30T09:20:55"
            // 这样浏览器解析会更标准，默认当成本地时间
            return new Date(dateTimeStr.replace(' ', 'T') );
        }

        // 上传给后端
        try {

            // 1. 先请求当前库存的时间
            const serverTimeRes = await request('/getDate',{method:'GET'});
            // 解析格式

            const serverTime = parseDateTime(serverTimeRes.date);
            const now = new Date();

            // 2. 计算时间差，单位小时
            const diffHours = (now - serverTime) / (1000 * 60 * 60);

            if (diffHours > 5) {
                message.warning('The inventory data is outdated. Please upload the latest inventory.\n ');
                return;
            }

            const response = await request('/doubleWeekCheck', {
                body: JSON.stringify(skus)
            });

            // 假设后端返回的格式是类似于： [{"item_code":"WF318735AAB", ...}]
            exportToExcel(response);  // 导出返回的数据到Excel
            message.success('Success!');
        } catch (error) {
            message.error('Fail');
            console.log(error)
        }
    };

    reader.readAsBinaryString(file);
    return false; // 阻止默认上传行为
};

// 导出数据到Excel
const exportToExcel = (data) => {
    const headers = Object.keys(data[0] || {});
    const aoa = [headers];
    let lastSKU = null;

    data.forEach(row => {
        const currentSKU = row['item_code'];
        if (lastSKU !== null && currentSKU !== lastSKU) {
            aoa.push(new Array(headers.length).fill(''));
        }
        const rowData = headers.map(h => row[h]);
        aoa.push(rowData);
        lastSKU = currentSKU;
    });

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 生成日期字符串 YYYYMMDD
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    // 拼接文件名
    const fileName = `Inventory_Check_List_${dateStr}.xlsx`;

    XLSX.writeFile(workbook, fileName);
};




export default doubleCheck;
