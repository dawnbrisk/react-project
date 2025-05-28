// src/components/LocationHeatmap.js
import {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {request} from "../../../util/request";

const LocationHeatmap = () => {
    const chartRef = useRef(null);
    const [data, setData] = useState([]);
    const [zoomRange, setZoomRange] = useState({start: 0, end: 100});


    const handleZoomIn = () => {
        setZoomRange(prev => {
            const delta = 10;
            const newStart = Math.min(prev.start + delta, prev.end - delta);
            const newEnd = Math.max(prev.end - delta, newStart + delta);
            updateZoom(newStart, newEnd);
            return {start: newStart, end: newEnd};
        });
    };

    const handleZoomOut = () => {
        setZoomRange(prev => {
            const delta = 10;
            const newStart = Math.max(prev.start - delta, 0);
            const newEnd = Math.min(prev.end + delta, 100);
            updateZoom(newStart, newEnd);
            return {start: newStart, end: newEnd};
        });
    };

    const updateZoom = (start, end) => {
        if (chartRef.current) {
            const chartInstance = echarts.getInstanceByDom(chartRef.current);
            chartInstance.dispatchAction({
                type: 'dataZoom',
                dataZoomIndex: 0, // 要对应 dataZoom 的索引
                start,
                end
            });
        }
    };

    useEffect(() => {
        request("/allLocation", {
            method: "GET",
        }).then((response) => {
            setData(response);
        });
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        const transformedData = data.map(item => ({
            x: parseInt(item.Xlocation),
            y: parseInt(item.Ylocation),
            value: item.num,
            type: item.num === "5" ? "满" : "空"
        }));

        const addAisle = (transformedData) => {
            const aisles = [];
            for (let x = 1; x <= 31; x += 2) {
                for (let y = 11; y <= 97; y++) {
                    aisles.push({
                        x: x + 1,
                        y: y,
                        value: 0,
                        type: '过道'
                    });
                }
            }
            return [...transformedData, ...aisles];
        };

        const finalData = addAisle(transformedData);

        const option = {
            tooltip: {
                position: 'top',
                formatter: function (params) {
                    return `库位: ${params.name}<br>托盘数: ${params.value}`;
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '10%',
                top: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: Array.from({length: 31}, (_, i) => `0${i + 1}`.slice(-2))
            },
            yAxis: {
                type: 'category',
                data: Array.from({length: 87}, (_, i) => `${i + 11}`)
            },
            visualMap: {
                min: -1,
                max: 7,
                calculable: true,
                inRange: {
                    color: ['#e0f7fa', '#26c6da', '#00838f']
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,

                    start: zoomRange.start,
                    end: zoomRange.end
                }
            ],


            series: [{
                name: '库位',
                type: 'heatmap',
                data: finalData.map(item => [item.x - 1, item.y - 11, item.value]),
                label: {
                    show: true,
                    formatter: function (params) {
                        const item = finalData[params.dataIndex];
                        if (item.type === "过道") {
                            return "";
                        }
                        return item.type === "满" ? "满" : item.value;
                    }
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#ff5722',
                        borderWidth: 1
                    }
                }
            }]
        };

        const chart = echarts.init(chartRef.current);
        chart.setOption(option);

        // 销毁图表以防内存泄漏
        return () => {
            chart.dispose();
        };
    }, [data]);

    return (
        <div>
            <button onClick={handleZoomIn}>+</button>
            <button onClick={handleZoomOut}>-</button>
            <div id="chartContainer" ref={chartRef} style={{width: "100%", height: "6000px"}}/>
        </div>
    )
        ;
};

export default LocationHeatmap;
