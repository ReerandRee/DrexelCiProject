import { AutoComplete } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
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
import { colorArray } from "@/constants";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TopCities = () => {

    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [value, setValue] = useState('')
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        axios.get('api/positionjobcount')
            .then((res) => {
                setOptions(res.data.map((city: any) => {
                    return {
                        value: city.position,
                        label: city.position
                    }
                }));
            });
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (value) {
            axios.get(`/api/topcities?position=${value}`)
                .then((res) => {
                    console.log(res.data)
                    setChartData(res.data)
                })
        }
    }, [value])


    const onSelect = (value: string) => {
        setValue(value)
        console.log(value)
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Top 10 Cities By Position Bar Chart',
            },
        },
    };

    return (
        <div>
            {isLoading ? <p>Loading...</p> :
                <>
                    <AutoComplete options={options}
                        className="w-[400px]"
                        allowClear={true}
                        onSelect={onSelect}
                        filterOption={(inputValue, option: any) => option!.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />

                    <Bar data={{
                        labels: chartData.map((job: any) => job.city),
                        datasets: [
                            {
                                label: 'Count',
                                data: chartData.map((job: any) => job.count),
                                backgroundColor: colorArray,
                                borderWidth: 1,
                            },
                        ],
                    }}
                        options={chartOptions}
                    />



                </>
            }
        </div>
    )
}

export default TopCities;