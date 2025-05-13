import React, { useState, useEffect } from 'react';
import {Button, DatePicker, Input, message, Radio, Space, Table} from 'antd';

import {request} from "../../util/request";
const PAGE_SIZE = 10;

const MergePalletResult = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState("");
    const [dateRange, setDateRange] = useState([]);

    const {RangePicker} = DatePicker;
    useEffect(() => {
        fetchData( name, dateRange);
    }, [ name, dateRange]);

    const fetchData = async ( name, dateRange) => {
        setLoading(true);
        try {
            const response = await request(`/getMergeSteps`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, dateRange})
                }
            );

            setData(response);
            setTotal(response.total);
        } catch (error) {
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(name, dateRange);
    };

    const columns = [
        {title: "User Name", dataIndex: "user", key: "username"},
        {title: "SKU", dataIndex: "sku", key: "sku"},
        {title: "Pieces", dataIndex: "pieces", key: "pieces"},
        {title: "From Pallet", dataIndex: "from_pallet", key: "from_pallet"},
        {title: "To Pallet", dataIndex: "to_pallet", key: "to_pallet"},
        {title: "Finish?", dataIndex: "is_finish", key: "isFinish"},
        {title: "Time", dataIndex: "update_time", key: "time"},
        {title: "", dataIndex: "id", key: "id", hidden:true} // Hide the "ID" column
    ];

    return (
        <div>
            <Space style={{marginBottom: 16}}>

                <Input
                    placeholder="Search Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{width: 200}}
                />

                <RangePicker
                    onChange={(dates) => setDateRange(dates)}
                />
                <Button type="primary" onClick={handleSearch}>Search</Button>
            </Space>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id" // Use 'id' as rowKey
                pagination={{
                    current: currentPage,
                    pageSize: PAGE_SIZE,
                    total: total,
                    showTotal: (total) => `Total: ${total}`, // 显示总数
                    onChange: (page) => setCurrentPage(page),
                }}
            />
        </div>
    );
};

export default MergePalletResult;