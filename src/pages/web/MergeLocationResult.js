import {useState, useEffect} from "react";
import {Table, message, Input, DatePicker, Space, Button, Radio} from "antd";
import {request} from '../../util/request'
import {useNavigate} from "react-router-dom";

const {RangePicker} = DatePicker;
const PAGE_SIZE = 10;

const MergeLocationResult = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState("");
    const [area,setArea] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchData(area, name, dateRange);
    }, [area, name, dateRange]);

    const fetchData = async (area, name, dateRange) => {
        setLoading(true);
        try {
            const response = await request(`/getAllSteps`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({area, name, dateRange})
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
        fetchData(area, name, dateRange);
    };

    const columns = [
        {title: "User Name", dataIndex: "user", key: "username"},
        {title: "Pallet Qty", dataIndex: "pallet_count", key: "PalletQty"},
        {title: "From Location", dataIndex: "from_location", key: "fromLocation"},
        {title: "To Location", dataIndex: "to_location", key: "toLocation"},
        {title: "Finish?", dataIndex: "isFinish", key: "isFinish"},
        {title: "Time", dataIndex: "update_time", key: "time"},
        {title: "", dataIndex: "id", key: "id", hidden:true} // Hide the "ID" column
    ];

    return (
        <div>
            <Space style={{marginBottom: 16}}>

                <Radio.Group defaultValue='1'  onChange={(e) => setArea(e.target.value)}>
                    <Space>
                        <Radio value='1'>A & C</Radio>
                        <Radio value='2'>B</Radio>
                    </Space>
                </Radio.Group>


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
                <Button type="primary" onClick={()=>{navigate('/mergeHistory')}}>History</Button>
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

export default MergeLocationResult;
