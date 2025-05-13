import React, {useEffect, useState} from 'react';
import {List, Card, Skeleton, Toast, NavBar} from 'antd-mobile';
import {request} from "../../../../util/request";


const EmptyLocation = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from /getOldestSku API
    useEffect(() => {
        const fetchData = async () => {
            try {
                request('/emptyLocationList').then(response => {
                    setData(response);
                })

            } catch (error) {
                Toast.show('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Card>
            {loading ? (
                <Skeleton.Paragraph lineCount={3} active/>// Display a skeleton loader
            ) : (
                <>
                    {/* Table header */}
                    <NavBar back="Back" onBack={() => window.history.back()}
                            style={{backgroundColor: '#007bff', color: 'white'}}>
                        Empty Location List
                    </NavBar>

                    {/* Table rows */}
                    <List>
                        {data?.map((item, index) => (
                            <List.Item
                                key={index}
                                style={{
                                    backgroundColor: index % 2 === 0 ? '#F1F8E9' : '#DCEDC8',// Alternating row colors
                                }}
                            >


                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{color: 'red'}}>{item}</span>

                                </div>


                            </List.Item>
                        ))}
                    </List>
                </>
            )}
        </Card>
    );
};

export default EmptyLocation;
