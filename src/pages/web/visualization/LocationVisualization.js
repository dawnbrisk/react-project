import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as Fabric from 'fabric';

const WarehouseMap = forwardRef(({ data, highlightLocation }, ref) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const scaleRef = useRef(1);
    const rectMap = useRef({}); // 用来存储每个库位对象，便于定位

    const X_START = 1;
    const X_END = 31;
    const Y_START = 11;
    const Y_END = 97;
    const CELL_WIDTH = 20;
    const CELL_HEIGHT = 30;
    const GAP = 20;

    // 根据 num 设置不同的蓝色
    const getColor = (num) => {
        const clamped = Math.max(0, Math.min(1, num / 10)); // 假设 max num 是 10
        const alpha = 0.3 + 0.7 * clamped; // alpha 值控制蓝色深浅
        return `rgba(0, 112, 255, ${alpha})`; // 纯蓝色
    };

    const drawMap = (canvas) => {
        canvas.clear();
        rectMap.current = {};

        const locationMap = {};
        data.forEach(item => {
            locationMap[`${item.Xlocation}-${item.Ylocation}`] = item;
        });

        // 绘制坐标轴
        // 绘制 Y 轴
        const yAxisLine = new Fabric.Line([30, 20, 30, 2600], { stroke: '#000', strokeWidth: 2 });
        canvas.add(yAxisLine);

        for (let y = Y_START; y <= Y_END; y++) {
            const yPos = (y - Y_START) * CELL_HEIGHT + 20;
            const text = new Fabric.Text(`${y}`, {
                left: 10,
                top: yPos - 10,
                fontSize: 12,
                fill: '#000',
            });
            canvas.add(text);
        }

        // 绘制 X 轴
        const xAxisLine = new Fabric.Line([30, 20, 950, 20], { stroke: '#000', strokeWidth: 2 });
        canvas.add(xAxisLine);

        for (let x = X_START; x <= X_END; x++) {
            const xPos = (x - X_START) * CELL_WIDTH + (x-1)/2*GAP;
            const text = new Fabric.Text(`${String(x).padStart(2, '0')}`, {
                left: xPos - 10,
                top: 10,
                fontSize: 12,
                fill: '#000',
            });
            canvas.add(text);
        }

        // 绘制库位
        for (let x = X_START; x <= X_END; x++) {
            const colIndex = x - X_START;
            const hasGap = Math.floor(colIndex / 2);
            const realX = colIndex * CELL_WIDTH + hasGap * GAP;

            for (let y = Y_START; y <= Y_END; y++) {
                const rowIndex = y - Y_START;
                const posKey = `${String(x).padStart(2, '0')}-${String(y)}`;
                const item = locationMap[posKey];
                const num = item?.num ?? -1;
                const locName = item?.location ?? 'N/A';

                // 绘制库位背景颜色
                const rect = new Fabric.Rect({
                    left: realX + 30, // 加上坐标系的偏移
                    top: rowIndex * CELL_HEIGHT + 20,
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT,
                    fill: getColor(num), // 设置蓝色填充
                    stroke: '#ccc',
                    strokeWidth: 1,
                });

                // 添加 num 数字文本
                const numText = new Fabric.Text(`${num}`, {
                    left: realX + 30 + 3,
                    top: rowIndex * CELL_HEIGHT + 20 + 5,
                    fontSize: 12,
                    fill: '#fff', // 白色字体
                });

                // 合并矩形和数字文本为一个组
                const group = new Fabric.Group([rect, numText], {
                    selectable: false,
                });

                // 保存库位到 rectMap，便于后续操作
                rectMap.current[locName] = group;
                canvas.add(group);
            }
        }
    };

    useEffect(() => {
        const canvas = new Fabric.Canvas(canvasRef.current, {
            width: 1500,
            height: 3000,
            selection: false,
        });

        fabricCanvasRef.current = canvas;
        drawMap(canvas);

        canvas.on('mouse:wheel', function (opt) {
            let delta = opt.e.deltaY;
            let zoom = scaleRef.current;
            zoom *= 0.999 ** delta;
            zoom = Math.min(3, Math.max(0.1, zoom));
            scaleRef.current = zoom;
            canvas.setZoom(zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        return () => {
            canvas.dispose();
        };
    }, [data]);

    useEffect(() => {
        if (!highlightLocation || !fabricCanvasRef.current) return;

        // 清除所有高亮
        Object.values(rectMap.current).forEach(group => {
            group.item(0).set('stroke', '#ccc');
            group.item(0).set('strokeWidth', 1);
        });

        const group = rectMap.current[highlightLocation];
        if (group) {
            group.item(0).set('stroke', 'yellow');
            group.item(0).set('strokeWidth', 3);
            fabricCanvasRef.current.setActiveObject(group);
            fabricCanvasRef.current.renderAll();

            // 自动滚动视图到该位置
            fabricCanvasRef.current.absolutePan({ x: -group.left + 300, y: -group.top + 300 });
        }
    }, [highlightLocation]);

    // 暴露导出功能
    useImperativeHandle(ref, () => ({
        exportImage: () => {
            const url = fabricCanvasRef.current.toDataURL({ format: 'png' });
            const a = document.createElement('a');
            a.href = url;
            a.download = 'warehouse_map.png';
            a.click();
        },
        exportPDF: async () => {
            const { jsPDF } = await import('jspdf');
            const imgData = fabricCanvasRef.current.toDataURL({ format: 'png' });
            const pdf = new jsPDF('l', 'pt', [1500, 3000]);
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save('warehouse_map.pdf');
        }
    }));

    return <canvas ref={canvasRef} />;
});

export default WarehouseMap;
