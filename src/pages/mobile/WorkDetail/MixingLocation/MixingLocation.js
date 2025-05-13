import React, { useEffect, useState } from 'react';
import {List, Card, Skeleton, Toast, NavBar} from 'antd-mobile';
import {request} from "../../../../util/request";


const MixingLocation = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from /getOldestSku API
    useEffect(() => {
        const fetchData = async () => {
            try {
                request('/mixingLocation').then(response=>{
                    setData(response);
                })

            } catch (error) {
                Toast.show('Failed to fetch data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Card>
            {loading ? (
                <Skeleton.Paragraph lineCount={3} active /> // Display a skeleton loader
            ) : (
                <>
                    {/* Table header */}
                    <NavBar back="Back" onBack={() => window.history.back()}
                            style={{backgroundColor: '#007bff', color: 'white'}}>
                        Mixing List
                    </NavBar>
                    <List>
                        <List.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

                                <span style={{ fontWeight: 'bold', textAlign: 'left' }}>Location</span>
                                <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Count</span>
                                <span style={{ fontWeight: 'bold', textAlign: 'right' }}>SKU</span>
                            </div>

                        </List.Item>
                    </List>
                    {/* Table rows */}
                    <List >
                        {data.map((item, index) => (
                            <List.Item
                                key={index}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#F1F8E9' : '#DCEDC8',// Alternating row colors
                                }}
                            >

                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <input type="checkbox"  style={{ color: 'red',textAlign: 'left' }}/>
                                    <span style={{ color: 'red',textAlign: 'left' }}>{item.Location_Code} </span>
                                    <span style={{ color: 'green',textAlign: 'center' }}>{item.uniqueSkuCount} </span>
                                    <div style={{
                                        color: '#6D4C41',
                                        textAlign: 'right',
                                        display: 'flex',
                                        flexDirection: 'column'  // 使用纵向排列
                                    }}>
                                        {item.sku.split(',').map((skuItem, i) => (
                                            <span key={i}>{skuItem.trim()}</span>  // trim() 去除可能的空格
                                        ))}
                                    </div>

                                </div>


                            </List.Item>
                        ))}
                    </List>
                </>
            )}
        </Card>
    );
};

export default MixingLocation;
