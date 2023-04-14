import { AutoComplete, Radio, RadioChangeEvent } from "antd";
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
    const [timeframe, setDateRange] = useState('')

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
            axios.get(`/api/topcities?position=${value}&timeframe=${timeframe}`)
                .then((res) => {
                    console.log(res.data)
                    setChartData(res.data)
                })
        }
    }, [value, timeframe])


    const onSelect = (value: string) => {
        setValue(value)
        console.log(value)
    }

    const onDateRangeChange = (e: RadioChangeEvent) => {
        setDateRange(e.target.value)
        console.log(e.target.value)
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
                    <div className="flex gap-10">
                        <AutoComplete options={options}
                            className="w-[400px]"
                            allowClear={true}
                            onSelect={onSelect}
                            filterOption={(inputValue, option: any) => option!.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            placeholder="Select a position"
                        />
                        <div>
                            <label htmlFor="date" className="pr-4">Date Range:</label>
                            <Radio.Group name="date" optionType="default" defaultValue={"0"} onChange={onDateRangeChange}>
                                <Radio.Button value="0">All time</Radio.Button>
                                <Radio.Button value="90">Last 3 Months</Radio.Button>
                                <Radio.Button value="180">Last 6 Months</Radio.Button>
                                <Radio.Button value="365">Last year</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>

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