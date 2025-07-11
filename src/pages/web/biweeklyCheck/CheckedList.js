import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import './InventoryTable.css'; // 放 CSS 文件
import { request } from "../../../util/request"; // Your API request utility

const DoubleWeeksCheckTable = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 1500,
        total: 0
    });

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchData = async (page, size) => {
        const result = await request(`/double_weeks_check?page=${page}&size=${size}`, { method: 'GET' });
        const rawData = result.records || [];
        const processed = preprocessData(rawData);

        setData(processed);
        setPagination(prev => ({
            ...prev,
            total: result.total || 0
        }));
    };



    const preprocessData = (records) => {
        const countMap = {};
        records.forEach(item => {
            countMap[item.item_code] = (countMap[item.item_code] || 0) + 1;
        });

        const seen = {};
        return records.map((item, index) => {
            if (!seen[item.item_code]) {
                seen[item.item_code] = true;
                return { ...item, rowSpan: countMap[item.item_code] };
            } else {
                return { ...item, rowSpan: 0 };
            }
        });
    };





    const columns = [
        {
            title: 'Item Code',
            dataIndex: 'item_code',
            key: 'item_code',
            render: (text, row, index) => ({
                children: text,
                props: {
                    rowSpan: row.rowSpan,
                    className: row.rowSpan > 0 ? 'item-code-cell' : '', // 只有显示的合并单元格才加样式
                }
            })
        },
        { title: 'Location Code', dataIndex: 'location_code', key: 'location_code' },
        { title: 'Pallet Code', dataIndex: 'pallet_code', key: 'pallet_code' },
        { title: 'Current Qty', dataIndex: 'current_inventory_qty', key: 'current_inventory_qty' },
        {
            title: 'Checked Result',
            dataIndex: 'checked_qty',
            key: 'checked_qty',
            render: (text, record) => {
                const mismatch = record.current_inventory_qty !== Number(record.checked_qty);
                return (
                    <span style={{ color: mismatch ? 'red' : 'inherit', fontWeight: mismatch ? 'bold' : 'normal' }}>
                    {text}
                </span>
                );
            }
        },
        { title: 'Upload Time', dataIndex: 'insert_time', key: 'insert_time' },
        { title: 'Check Time', dataIndex: 'update_time', key: 'update_time' },
        { title: 'User', dataIndex: 'user', key: 'user' },
    ];


    const rowClassName = (record, index) => {
        let baseClass = index % 2 === 0 ? 'row-even' : 'row-odd';
        const prev = data[index - 1];
        if (prev && prev.item_code !== record.item_code) {
            baseClass += ' item-divider';
        }
        return baseClass;
    };

    return (
        <Table
            dataSource={data}
            columns={columns}
            rowKey={(record, index) => index}
            rowClassName={rowClassName}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: (page, pageSize) => {
                    setPagination({ ...pagination, current: page, pageSize });
                }
            }}
            bordered
        />
    );
};

export default DoubleWeeksCheckTable;
