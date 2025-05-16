import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const MoveUserBarChart = ({ username, data }) => {
    const [option, setOption] = useState({});

    useEffect(() => {
        // 按日期排序
        const sortedData = [...data].sort((a, b) => new Date(a.move_date) - new Date(b.move_date));

        const dates = sortedData.map(d => d.move_date);
        const values = sortedData.map(d => d.total_pallets);

        setOption({
            title: {
                text: `用户 ${username} 每日Pallet移动数`,
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
                name: '移动pallet数'
            },
            series: [
                {
                    name: 'Pallet数',
                    type: 'bar',
                    data: values,
                    barMaxWidth: 30, // 限制最大宽度为 30px
                    itemStyle: {
                        color: '#00B8A9'
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

export default MoveUserBarChart;
