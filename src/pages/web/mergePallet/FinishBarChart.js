import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const FinishBarChart = ({ username, data }) => {
    const [option, setOption] = useState({});

    useEffect(() => {
        // 按日期排序
        const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        const dates = sortedData.map(d => d.date);
        const values = sortedData.map(d => d.finish_count);

        const colorMap = {
            li: '#5B8FF9',
            wang: '#61DDAA',
            gao: '#FF9845'
        };

        setOption({
            title: {
                text: `用户 ${username} 每日完成数`,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: dates,
                name: '日期',
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: '完成数量'
            },
            series: [
                {
                    name: '完成数',
                    type: 'bar',
                    data: values,
                    barMaxWidth: 30,
                    itemStyle: {
                        color: colorMap[username] || '#888'
                    },
                    label: {
                        show: true,
                        position: 'top'
                    }
                }
            ]
        });
    }, [data, username]);

    return (
        <div style={{ margin: "40px 0" }}>
            <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
        </div>
    );
};

export default FinishBarChart;
