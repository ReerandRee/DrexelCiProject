import { useState, useEffect } from "react";
import { AutoComplete } from "antd";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const topcities = () => {

    const [selectedPosition, setSelectedPosition] = useState('');
    const [positionData, setPositionData] = useState([]);
    const [jobsInCity, setJobsInCity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/jobs?searchterm=all")
            .then((res) => {
                setPositionData(res.data.map((postion) => { return { value: postion.searchterm, label: postion.searchterm } }));
                // console.log(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setIsLoading(true);

        if (selectedPosition) {
            axios.get(`/api/jobs?searchterm=${selectedPosition}`)
                .then((res) => {
                    setJobsInCity(res.data);
                    console.log(res.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                }
                );
        }


    }, [selectedPosition]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top Cities By Job Bar Chart',
            },
        },
    };

    const labels = jobsInCity.map((job) => job.searcharea);
    const counts = jobsInCity.map((job) => job._count.searcharea);


    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Position Count',
                data: counts,
                backgroundColor: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'],
                borderWidth: 1,
            },
        ],
    };


    return (
        <div>
            <h1>Top Cities by Job</h1>
            {positionData ? <>
                <AutoComplete
                    options={positionData}
                    placeholder={'Hello'}
                    style={{ maxWidth: "700px", minWidth: "500px" }}
                    onSelect={(value) => {
                        console.log(value);
                        setSelectedPosition(value);
                    }}

                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    } />
                {isLoading ? <div>loading...</div> : <div style={{ width: '90%' }}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
                }
            </> : <></>}
        </div>
    );
};

export default topcities;