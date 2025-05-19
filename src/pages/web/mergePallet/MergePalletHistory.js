import React, {useEffect, useState} from 'react';
import FinishBarChart from './FinishBarChart'; // 路径根据你的项目结构调整
import { request } from "../../../util/request"; // Your API request utility

const MergeUserCharts = () => {
    const [groupedData, setGroupedData] = useState({});
    const [loading, setLoading] = useState(true);

    // 分组函数
    const groupByUser = (data) => {
        const result = {};
        data.forEach(item => {
            const { user } = item;
            if (!result[user]) result[user] = [];
            result[user].push({
                date: item.date,
                finish_count: item.finish_count
            });
        });
        return result;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await request("/getMergePalletHistory",{ method: "GET" });
                // 假设返回是一个数组对象
                const data = res || [];
                const filtered = data.filter(d => d.user && d.user.trim() !== "");
                const grouped = groupByUser(filtered);
                setGroupedData(grouped);
            } catch (error) {
                console.error("Error fetching merge pallet history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>加载中...</p>;

    return (
        <div>
            {Object.keys(groupedData).map(user => (
                <FinishBarChart key={user} username={user} data={groupedData[user]} />
            ))}
        </div>
    );
};

export default MergeUserCharts;