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


const topjobs = () => {

    const [selectedCity, setSelectedCity] = useState('');
    const [jobsData, setJobsData] = useState([]);
    const [jobsInCity, setJobsInCity] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get("/api/jobs?searcharea=all")
            .then((res) => {
                setJobsData(res.data.map((searcharea) => { return { value: searcharea.searcharea, label: searcharea.searcharea } }));
                console.log();
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setIsLoading(true);

        if (selectedCity) {
            axios.get(`/api/jobs?city=${selectedCity}`)
                .then((res) => {
                    setJobsInCity(res.data);
                    console.log(res.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [selectedCity]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top Jobs By City Bar Chart',
            },
        },
    };

    const labels = jobsInCity.map((job) => job.searchterm);
    const counts = jobsInCity.map((job) => job._count.searchterm);


    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Job Count',
                data: counts,
                backgroundColor: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'],
                borderWidth: 1,
            },
        ],
    };


    return (
        <div>
            <h1>Top Jobs</h1>
            {jobsData ? <>
                <AutoComplete
                    options={jobsData}
                    placeholder={'Hello'}
                    style={{ maxWidth: "700px", minWidth: "500px" }}
                    onSelect={(value) => {
                        console.log(value);
                        setSelectedCity(value);
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

export default topjobs;