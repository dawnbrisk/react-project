import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { request } from "../../../util/request"; // your custom request util

const PickingIntervalLineChart = () => {
    const chartRef = useRef(null);
    const [dateList, setDateList] = useState([]);     // x-axis
    const [seriesList, setSeriesList] = useState([]); // series for each account

    // Fetch data from /averageInterval
    useEffect(() => {
        request("/averageInterval", { method: "GET" })
            .then((data) => {
                const sortedDates = Object.keys(data).sort(); // x-axis dates
                const accountsSet = new Set();

                // collect all account names
                sortedDates.forEach(date => {
                    Object.keys(data[date]).forEach(account => accountsSet.add(account));
                });

                const accounts = Array.from(accountsSet);

                const series = accounts.map(account => ({
                    name: account,
                    type: "line",
                    smooth: true,
                    showSymbol: false,
                    connectNulls: true,  // 👈 保持连续

                    data: sortedDates.map(date => {
                        const val = data[date][account];
                        return val != null ? Number(val.toFixed(0)) : 0; // 👈 保留 0，线才不会断
                    }),
                }));

                setDateList(sortedDates);
                setSeriesList(series);
            })
            .catch(err => {
                console.error("Failed to fetch averageInterval:", err);
            });
    }, []);

    // ✅ 2️⃣ Draw chart
    useEffect(() => {
        if (!chartRef.current || dateList.length === 0) return;

        const chart = echarts.init(chartRef.current);

        const option = {
            title: { text: "Account Average Interval", left: "center" },
            tooltip: { trigger: "axis" },
            legend: { top: "bottom" },
            xAxis: { type: "category", data: dateList },
            yAxis: { type: "value" },
            series: seriesList,
        };

        chart.setOption(option);
        return () => chart.dispose(); // cleanup on unmount
    }, [dateList, seriesList]);

    return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default PickingIntervalLineChart;
