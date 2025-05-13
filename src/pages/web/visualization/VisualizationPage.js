
import WarehouseMap from "./LocationVisualization"; // 可视化组件

import {request} from "../../../util/request";

import React, { useEffect, useState, useRef } from 'react';
import {Button, Input} from "antd";



const WarehousePage = () => {
    const [data, setData] = useState([]);
    const [searchLoc, setSearchLoc] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        request("/allLocation", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            setData(response);
        });
    }, []);

    return (
        <div>
            <h2>仓库可视化</h2>

            {/* 工具栏 */}
            <div style={{ marginBottom: '10px' }}>
                <Input
                    value={searchLoc}
                    placeholder="输入 Location 编号搜索"
                    onChange={(e) => setSearchLoc(e.target.value)}
                    style={{ width: 200 }}
                />
                <Button onClick={() => canvasRef.current?.exportImage()}>导出 PNG</Button>
                <Button onClick={() => canvasRef.current?.exportPDF()}>导出 PDF</Button>

            </div>

            {/* 图例 */}
            <div style={{ marginBottom: '10px' }}>
                <span style={{ marginRight: '10px' }}>图例：</span>
                {[1, 3, 5, 7, 10].map((n) => (
                    <span
                        key={n}
                        style={{
                            display: 'inline-block',
                            width: 40,
                            height: 20,
                            backgroundColor: `rgba(0,112,255,${0.3 + 0.7 * (n / 10)})`,
                            marginRight: 8,
                            border: '1px solid #ccc',
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: 12
                        }}
                    >
            {n}
          </span>
                ))}
            </div>

            {/* Canvas 渲染区域 */}
            <WarehouseMap ref={canvasRef} data={data} highlightLocation={searchLoc} />
        </div>
    );
};

export default WarehousePage;
