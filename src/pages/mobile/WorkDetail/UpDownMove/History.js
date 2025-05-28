import React, {useEffect, useState} from 'react';
import {List, NavBar, SwipeAction, Toast} from 'antd-mobile';
import {useNavigate} from "react-router-dom";
import {request} from '../../../../util/request'

export default function SwipeList() {

    const parsedUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    // 只显示一个用户名
    const [username] = useState(parsedUser.username);

    // 初始化data为空数组
    const [data, setData] = useState([]);

    useEffect(() => {
        const params = {username: parsedUser.username, status: "1"};

        request("/selectHistory",{method:'POST',body: JSON.stringify(params)})
            .then(response => {

                if (Array.isArray(response.result)) {
                    setData(response.result);
                } else {
                    console.warn("Response data.result is not an array:");
                    setData([]); // Or handle as needed
                }
            })
            .catch(error => {
                Toast.show("Failed to load data" + error);
                setData([]); // Set to empty array in case of error
            });
    }, [parsedUser.username]);  // Empty dependency array, so the effect runs once when the component mounts


    // 假设你的后端删除 API 路径是 /deleteRecord
    const handleDelete = (id) => {
        request("/deleteAction", {method:'POST',body: JSON.stringify({id:id})})
            .then((response) => {
                if (response===1) {
                    setData((prevData) => prevData.filter((item) => item.id !== id));
                    Toast.show("Deleted successfully");
                } else {
                    Toast.show("Failed to delete record");
                }
            })
            .catch(() => {
                Toast.show("Error deleting record");
            });
    };

    return (
        <div>
            {/* 顶部导航栏 */}
            <NavBar onBack={() => navigate(-1)} style={{background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                History (today)
            </NavBar>

            {/* 用户名 & 总数 */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 15px', fontSize: '16px', fontWeight: 'bold',
                background: '#fff', borderBottom: '1px solid #ddd'
            }}>
                <span>User: {username}</span>
                <span>Total: {data.length}</span>
            </div>

            <List>
                {data.map((item, index) => (
                    <SwipeAction
                        key={item.id}
                        rightActions={[
                            {
                                key: 'delete',
                                text: 'Delete',
                                color: 'danger',
                                onClick: () => handleDelete(item.id),
                            },
                        ]}
                    >
                        <List.Item style={{
                            background: index % 2 === 0 ? '#E3F2FD' : '#F5F5F5',  // 交替颜色
                            padding: '12px 15px',
                            fontSize: '14px'
                        }}>
                            {item.location} : from {item.fromLocation}F to {item.toLocation}F
                            ({new Date(item.insertTime).toLocaleTimeString()})
                        </List.Item>
                    </SwipeAction>
                ))}
            </List>
        </div>
    );
}
