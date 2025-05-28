import { useState, useEffect } from "react";
import { Table, message, Input, DatePicker, Space, Button } from "antd";
import {request} from '../../../util/request'
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

const { RangePicker } = DatePicker;
const PAGE_SIZE = 10;

const InventoryTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(currentPage, name, dateRange);
    }, [currentPage, name, dateRange]);

    const fetchData = async (page, name, dateRange) => {
        setLoading(true);
        try {
            const response = await request(`/ActionList`,
                {method:'POST',body: JSON.stringify({ page, pageSize: PAGE_SIZE, name, dateRange })}
            );

            setData(response.result);
            setTotal(response.total);
        } catch (error) {
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(1, name, dateRange);
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
                    pageSize: PAGE_SIZE,
                    total: total,
                    showTotal: (total) => `Total: ${total}`, // 显示总数
                    onChange: (page) => setCurrentPage(page),
                }}
            />
        </div>
    );
};

export default InventoryTable;
