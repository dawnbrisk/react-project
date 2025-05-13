import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

// 子组件：堆叠柱状图
const MoveStackedBarChart = ({ username, data }) => {
    const [option, setOption] = useState({});

    useEffect(() => {
        const hourSet = new Set();
        const groupedData = {};
        const dateTotals = {}; // To store totals for each date

        data.forEach(item => {
            const date = item.move_date;
            const hour = item.hour_slot.substring(11, 13) + ":00";
            hourSet.add(hour);
            if (!groupedData[date]) {
                groupedData[date] = {};
            }
            groupedData[date][hour] = item.move_count;

            // Calculate totals for each date
            dateTotals[date] = (dateTotals[date] || 0) + item.move_count;
        });

        const hours = Array.from(hourSet).sort();
        const dates = Object.keys(groupedData).sort();

        const series = hours.map(hour => ({
            name: hour,
            type: "bar",
            stack: "total",
            barMaxWidth: 30,
            emphasis: {
                focus: "series"
            },
            data: dates.map(date => groupedData[date][hour] || 0)
        }));

        // Add total labels to the series
        series.push({
            name: 'Total',
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                position: 'top',
                formatter: function(params) {
                    return dateTotals[dates[params.dataIndex]];
                }
            },
            itemStyle: {
                // Make the total bar invisible but keep the label
                color: 'transparent'
            },
            emphasis: {
                itemStyle: {
                    color: 'transparent'
                }
            },
            data: dates.map(date => 0) // Data is 0 because we're just using it for labels
        });

        setOption({
            title: {
                text: `用户 ${username} 移动次数统计`,
                left: 'center'
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: function(params) {
                    let total = 0;
                    let tooltip = `<div>${params[0].axisValue}</div>`;

                    params.forEach(param => {
                        if (param.seriesName !== 'Total') {
                            tooltip += `<div>
                                ${param.marker} ${param.seriesName}: ${param.value}
                            </div>`;
                            total += param.value;
                        }
                    });

                    tooltip += `<div><strong>总次数: ${total}</strong></div>`;
                    return tooltip;
                }
            },
            legend: {
                data: hours,
                top: '10%'
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: "category",
                data: dates
            },
            yAxis: {
                type: "value",
                name: "移动次数"
            },
            series
        });
    }, [data, username]);

    return (
        <div style={{ marginBottom: "40px" }}>
            <ReactECharts option={option} style={{ height: "400px" }} />
        </div>
    );
};

// 父组件：多个用户的图表
const MultiUserMoveCharts = ({ allData }) => {
    // 分组：username => data[]
    const userMap = {};

    allData.forEach(item => {
        if (!userMap[item.username]) {
            userMap[item.username] = [];
        }
        userMap[item.username].push(item);
    });

    return (
        <div>
            {Object.keys(userMap).map(username => (
                <MoveStackedBarChart
                    key={username}
                    username={username}
                    data={userMap[username]}
                />
            ))}
        </div>
    );
};

export default MultiUserMoveCharts;