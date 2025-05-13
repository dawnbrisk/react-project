import React, { useEffect, useState } from "react";
import {message, Table} from "antd";
import { Link } from "react-router-dom";
import { request } from "../../../util/request";

import * as XLSX from 'xlsx';  // Make sure to import the entire library


const AccountTable: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [rawData, setRawData] = useState([]);

    useEffect(() => {
        setLoading(true);
        request("/picking_detail", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
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

    const tableData = months.map(month => {
        const row: Record<string, any> = { key: month, month:(
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        exportToExcel(month);
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
        <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            pagination={false}
            bordered
            scroll={{ x: "max-content" }} // Enable horizontal scrolling
        />
    );
};

export default AccountTable;
