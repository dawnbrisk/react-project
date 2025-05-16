import React, { useEffect,useState} from "react";
import MoveUserBarChart from "./MoveUserBarChart";
import { request } from "../../../util/request"; // Your API request utility
const MultiUserMoveCharts = () => {

    const [allData,setAllData] =  useState([]);
    useEffect(() => {
        // 放在 useEffect 里只执行一次
        request(`/movePalletHistory`, { method: "GET" }).then((response) => {
            setAllData(response);
        });
    }, []); // 空依赖数组：组件挂载时执行一次

    // 按 user 分组
    const userMap = {};

    allData.forEach(item => {
        const username = item.user;
        if (!userMap[username]) {
            userMap[username] = [];
        }
        userMap[username].push(item);
    });

    return (
        <div>
            {Object.entries(userMap).map(([username, data]) => (
                <MoveUserBarChart key={username} username={username} data={data} />
            ))}
        </div>
    );
};

export default MultiUserMoveCharts;
