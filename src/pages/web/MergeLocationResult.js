import { useState, useEffect } from "react";
import { Table, message, Input, DatePicker, Space, Button } from "antd";
import { request } from '../../util/request';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const DEFAULT_PAGE_SIZE = 10;

const MergeLocationResult = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [name, setName] = useState("");
    const [area, setArea] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(area, name, dateRange, 1, pageSize);
    }, [area, name, dateRange]);

    const fetchData = async (area, name, dateRange, page = 1, pageSizeValue = pageSize) => {
        setLoading(true);
        try {
            const response = await request(`/getAllSteps`, {
                method: 'POST',
                body: JSON.stringify({
                    area,
                    name,
                    dateRange,
                    page,
                    pageSize: pageSizeValue,
                }),
            });

            setData(response.data);
            setTotal(response.total);
            setCurrentPage(page);
            setPageSize(pageSizeValue);
        } catch (error) {
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(area, name, dateRange, 1, pageSize);
    };

    const columns = [
        { title: "User Name", dataIndex: "user", key: "username" },
        { title: "Pallet Qty", dataIndex: "pallet_count", key: "PalletQty" },
        { title: "From Location", dataIndex: "from_location", key: "fromLocation" },
        { title: "To Location", dataIndex: "to_location", key: "toLocation" },
        { title: "Finish?", dataIndex: "isFinish", key: "isFinish" },
        { title: "Time", dataIndex: "update_time", key: "time" },
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
                        defaultValue: [
                            dayjs('00:00:00', 'HH:mm:ss'),
                            dayjs('23:59:59', 'HH:mm:ss'),
                        ],
                    }}
                    onChange={(dates) => setDateRange(dates)}
                />

                <Button type="primary" onClick={handleSearch}>Search</Button>
                <Button type="primary" onClick={() => navigate('/mergeHistory')}>History</Button>
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
                    onChange: (page, newPageSize) => {
                        fetchData(area, name, dateRange, page, newPageSize);
                    },
                }}
            />
        </div>
    );
};

export default MergeLocationResult;
