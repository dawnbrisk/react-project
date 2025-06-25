import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, message, Space, Table } from 'antd';
import { useNavigate } from "react-router-dom";
import { request } from "../../util/request";
import dayjs from "dayjs";
import config from "../../util/config";


const PAGE_SIZE = 10;

const MergePalletResult = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;
    const [pageSize, setPageSize] = useState(PAGE_SIZE);


    // 当 name, dateRange, currentPage 变化时自动请求数据
    useEffect(() => {
        fetchData(name, dateRange, currentPage, pageSize);
    }, [name, dateRange, currentPage, pageSize]);


    const fetchData = async (name, dateRange, page, size) => {
        setLoading(true);
        try {
            const response = await request(`/getMergeSteps`, {
                body: JSON.stringify({
                    name,
                    dateRange: dateRange.map(d => d.format()),
                    page,
                    pageSize: size,
                }),
            });

            setData(response.data || []);
            setTotal(response.total || 0);
        } catch (error) {
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };


    const handleSearch = () => {
        setCurrentPage(1); // 搜索时重置页码
    };

    const columns = [
        { title: "User Name", dataIndex: "user", key: "username" },
        { title: "SKU", dataIndex: "sku", key: "sku" },
        { title: "Pieces", dataIndex: "pieces", key: "pieces" },
        { title: "From Location", dataIndex: "from_location", key: "from_location" },
        { title: "From Pallet", dataIndex: "from_pallet", key: "from_pallet" },
        { title: "To Location", dataIndex: "to_location", key: "to_location" },
        { title: "To Pallet", dataIndex: "to_pallet", key: "to_pallet" },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (value) => value === "1" ? "general" : <span style={{ color: 'green' }}>specific</span>,
        },
        { title: "Finish?", dataIndex: "is_finish", key: "isFinish" },
        { title: "Time", dataIndex: "update_time", key: "time" },
        {
            title: "Photo",
            dataIndex: "filePath",
            key: "filePath",
            render: (filePath) =>
                filePath ? (
                    <a
                        href={`${config.baseURL}${filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        photo
                    </a>
                ) : null,
        }
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: 200 }}
                />

                <RangePicker
                    showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                    }}
                    onChange={(dates) => setDateRange(dates || [])}
                    allowClear
                />
                <Button type="primary" onClick={handleSearch}>Search</Button>
                <Button type="primary" onClick={() => { navigate('/mergePalletHistory') }}>History</Button>
            </Space>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total}`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}

            />
        </div>
    );
};

export default MergePalletResult;
