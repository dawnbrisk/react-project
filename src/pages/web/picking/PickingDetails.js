import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useParams } from "react-router-dom";
import { request } from "../../../util/request"; // Your API request utility

const StackedBarChart = () => {
    const chartRef = useRef(null);
    const { month, account } = useParams(); // 从路由获取参数
    const [rawData, setRawData] = useState([]);

    // ✅ 1️⃣ 获取后端数据
    useEffect(() => {
        if (!month || !account) return;

        request(`/pickingByAccount?month=${month}&account=${account}`, { method: "GET" })
            .then((response) => {
                setRawData(response);
            })
            .catch((error) => {
                console.error("Failed to fetch data:", error);
            });
    }, [month, account]);

    // ✅ 2️⃣ 处理数据并渲染图表
    useEffect(() => {
        if (!chartRef.current || rawData.length === 0) return;

        const chart = echarts.init(chartRef.current);

        const hourSet = new Set();
        const groupedData = {};

        rawData.forEach(item => {
            const date = item.move_date;
            const hour = item.hour_slot && item.hour_slot.substring(11, 13) + ":00";
            if (hour) {
                hourSet.add(hour);
                if (!groupedData[date]) {
                    groupedData[date] = {};
                }
                groupedData[date][hour] = item.move_count;
            }
        });

        const hours = Array.from(hourSet).sort();
        const dates = Object.keys(groupedData).sort();

        // 构造 series：每小时的数据
        const series = hours.map(hour => ({
            name: hour,
            type: "bar",
            stack: "total",
            barMaxWidth: 30,
            emphasis: {
                focus: "series"
            },
            label: {
                show: false // 不显示每一段的 label，只显示总和
            },
            data: dates.map(date => groupedData[date][hour] || 0)
        }));

        // 计算每天的总数
        const totalData = dates.map(date =>
            hours.reduce((sum, hour) => sum + (groupedData[date][hour] || 0), 0)
        );

        // 添加透明柱状图用于显示总和
        // 添加自定义 label 显示总和（不参与堆叠）
        series.push({
            name: "总数标签",
            type: "custom",
            renderItem: function (params, api) {
                const xValue = api.value(0); // 类别索引
                const total = api.value(1); // 总和值

                const point = api.coord([xValue, total]);
                return {
                    type: 'text',
                    style: {
                        text: total,
                        x: point[0],
                        y: point[1] - 10,
                        textAlign: 'center',
                        textVerticalAlign: 'bottom',
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                };
            },
            encode: {
                x: 0,
                y: 1
            },
            data: dates.map((date, index) => [date, totalData[index]])
        });


        const option = {
            title: {
                text: `拣货堆叠柱状图 - ${account}`,
                left: "center"
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" }
            },
            legend: {
                data: hours,
                top: "10%"
            },
            grid: {
                top: "20%",
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: {
                type: "category",
                data: dates
            },
            yAxis: {
                type: "value",
                name: "拣货数量"
            },
            series
        };

        chart.setOption(option);
        return () => chart.dispose(); // 清理
    }, [rawData, account]);

    return (
        <div style={{ position: "relative" }}>
            <div ref={chartRef} style={{ width: "100%", height: "500px" }} />
        </div>
    );
};

export default StackedBarChart;
