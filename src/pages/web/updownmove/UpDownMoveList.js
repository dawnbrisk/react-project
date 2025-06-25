import { useState, useEffect } from "react";
import { Table, message, Input, DatePicker, Space, Button } from "antd";
import {request} from '../../../util/request'
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

const { RangePicker } = DatePicker;


const InventoryTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchData(currentPage, name, dateRange);
    }, [currentPage, name, dateRange, pageSize]);


    const fetchData = async (page, name, dateRange) => {
        setLoading(true);
        try {
            const response = await request(`/actionList`,
                {method:'POST',body: JSON.stringify({ page, pageSize: pageSize, name, dateRange })}
            );

            setData(response.result);
            setTotal(response.total);
        } catch (error) {
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };

    const handleSearch = () => {
        setCurrentPage(1); // useEffect 会自动触发 fetchData
    };


    const columns = [
        { title: "User Name", dataIndex: "username", key: "username" },
        { title: "Location", dataIndex: "location", key: "location" },
        { title: "From", dataIndex: "fromLocation", key: "fromLocation" },
        { title: "To", dataIndex: "toLocation", key: "toLocation" },
        { title: "Time", dataIndex: "insertTime", key: "time" },
        { title: "", dataIndex: "id", key: "id",hidden:true } // Hide the "ID" column
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
                    onChange={(dates) => setDateRange(dates)}
                />
                <Button type="primary" onClick={handleSearch}>Search</Button>
                <Button type="primary" onClick={()=>{navigate('/upDownMoveDetail')}}  >History</Button>

            </Space>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id" // Use 'id' as rowKey
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showTotal: (total) => `Total: ${total}`,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize); // 可选：支持页面大小动态变化
                    },
                }}
            />
        </div>
    );
};

export default InventoryTable;
