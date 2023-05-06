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

    }, []);



    return (
        <div>
            <h1>Salary BoxPlot</h1>
            <div className="graph">

            </div>
        </div>
    );
};

export default topjobs;