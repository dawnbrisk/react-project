import React, { useEffect, useState } from 'react';

import { request } from '../../../util/request';

import MoveStackedBarChart from "./AveragePerHour"

const UserMovementCharts: React.FC = () => {

    const [averageData, setAverageData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {



        request('/AverageMovePerHour',{method:'GET'}).then((response)=>{
            setAverageData(response);
            setLoading(false); // Stop loading when data is fetched
        }).catch((error)=>{
            setError(error); // Set error if request fails
            setLoading(false); // Stop loading
        })
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>User Movement Data(the past 2 months)</h1>

            <MoveStackedBarChart allData={averageData}/>

        </div>
    );
};

export default UserMovementCharts;
