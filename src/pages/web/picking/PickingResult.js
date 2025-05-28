import React, { useEffect, useState } from "react";
import {Button, message, Modal, Spin, Table} from "antd";
import { Link } from "react-router-dom";
import { request } from "../../../util/request";

import * as XLSX from 'xlsx';  // Make sure to import the entire library


const AccountTable: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [rawData, setRawData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [orderNumbers, setOrderNumbers] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        request("/picking_detail", {
            method: "GET",
        })
            .then((data) => {
                setRawData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch data:", error);
                setLoading(false);
            });
    }, []);


    const months = [...new Set(rawData.map(item => item.month))];
    const accounts = [...new Set(rawData.map(item => item.operator_account))];


    const handleMonthClick = async (month: string) => {
        setSelectedMonth(month);
        setModalLoading(true);
        try {
            console.log("month:"+month);
            const res = await request(`/month_picking`, {body: JSON.stringify(month)})

            setOrderNumbers(res); // 假设返回的是 string[]，例如 ['20250521-NW1-001', '20250521-NW1-002']
            setIsModalVisible(true);
        } catch (err) {
            console.error("Failed to fetch month picking orders:", err);
            message.error("加载拣货单失败");
        } finally {
            setModalLoading(false);
        }
    };


    const tableData = months.map(month => {
        const row: Record<string, any> = { key: month, month:(
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        handleMonthClick(month);
                    }}
                    style={{ color: "#1890ff", cursor: "pointer" }}
                >
                    {month}
                </a>
            ) };
        accounts.forEach(account => {
            const entry = rawData.find(item => item.month === month && item.operator_account === account);
            row[account] = entry ? (
                <Link to={`/picking_details/${month}/${account}`}>{entry.total_quantity}</Link>
            ) : "-";
        });
        return row;
    });

    const columns = [
        { title: (<Link to={`/picking_interval`}>Year-Month</Link>), dataIndex: "month", key: "month", fixed: "left" },
        ...accounts.map(account => ({
            title: account,
            dataIndex: account,
            key: account,
        }))
    ];


    // Export to Excel function

    const exportToExcel = (month: string) => {
        const monthData = rawData.filter((item) => item.month === month);

        debugger;
        if (monthData.length === 0) {
            message.warning("No data available for this month");
            return;
        }

        // CORRECT usage:
        const ws = XLSX.utils.json_to_sheet(
            monthData.map(item => ({
                Account: item.operator_account,
                Quantity: item.total_quantity,
                // Add other fields as needed
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Monthly Data");
        XLSX.writeFile(wb, `${month}_picking_result.xlsx`);
    };


    return (
        <>
            <Table
                columns={columns}
                dataSource={tableData}
                loading={loading}
                pagination={false}
                bordered
                scroll={{ x: "max-content" }}
            />

            {/* 👇 Modal 放在这里，和 Table 同级 */}
            <Modal
                title={`拣货单列表 - ${selectedMonth}（共 ${orderNumbers.length} 个）`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                {modalLoading ? (
                    <Spin tip="加载中..." />
                ) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                            <Button onClick={()=>exportToExcel(selectedMonth)} type="primary">下载</Button>
                        </div>
                        <Table
                            columns={[{ title: "拣货单号", dataIndex: "order", key: "order" }]}
                            dataSource={orderNumbers.map((order, index) => ({
                                key: index,
                                order,
                            }))}
                            pagination={{ pageSize: 10 }}
                            size="small"
                        />
                    </>
                )}
            </Modal>
        </>
    );

};

export default AccountTable;
