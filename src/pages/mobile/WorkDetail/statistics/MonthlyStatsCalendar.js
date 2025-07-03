import { Calendar } from 'antd-mobile'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

export default function MobileCalendarStats() {
    const [dataMap, setDataMap] = useState({})
    const [value, setValue] = useState(() => new Date())

    useEffect(() => {
        // 模拟每一天的数据
        const mock = [
            { date: '2025-07-01', count: 3, total: 100 },
            { date: '2025-07-02', count: 3, total: 100 },
            { date: '2025-07-03', count: 1, total: 30 },
            { date: '2025-07-05', count: 5, total: 200 }
        ]
        const map = {}
        mock.forEach(item => {
            map[item.date] = item
        })
        setDataMap(map)
    }, [])

    const renderDate = (date: Date) => {
        const d = dayjs(date).format('YYYY-MM-DD')
        const data = dataMap[d]
        return (
            <div style={{ fontSize: 10, textAlign: 'center', color: data ? '#1677ff' : '#ccc' }}>
                {dayjs(date).date()}
                {data && (
                    <div style={{ color: '#f5222d' }}>
                        {data.count}次<br />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div style={{ padding: 10 }}>
            <Calendar
                selectionMode='single'
                defaultValue={value}
                onChange={setValue}
                renderDate={renderDate}
            />
        </div>
    )
}
