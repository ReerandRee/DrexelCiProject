import { AutoComplete, Radio, RadioChangeEvent } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
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


interface City {
    searcharea: string
}

const TopJobs = () => {
    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [value, setValue] = useState('')
    const [chartData, setChartData] = useState([])
    const [timeframe, setTimeframe] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/city')
            const data = await res.json()


            setOptions(data.map((city: City) => {
                return {
                    value: city.searcharea,
                    label: city.searcharea
                }
            }))

            setIsLoading(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        // setIsLoading(true);

        if (value) {
            axios.get(`/api/topjobs?city=${value}&timeframe=${timeframe}`)
                .then((res) => {
                    console.log(res.data)
                    setChartData(res.data);
                    // console.log(res.data);
                    // setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [value, timeframe]);

    const onSelect = (value: string) => {
        setValue(value)
        console.log(value)
    }

    const onDateRangeChange = (e: RadioChangeEvent) => {
        setTimeframe(e.target.value)
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
                text: 'Top 10 Positions By Job Bar Chart',
            },
        },
    };

    return (
        <>
            {isLoading ? <p>Loading...</p> :
                <>
                    <div>
                        <AutoComplete options={options}
                            className="w-[400px]"
                            allowClear={true}
                            onSelect={onSelect}
                            filterOption={(inputValue, option: any) => option!.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            placeholder="Select City"
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

                    <Bar
                        data={{
                            labels: chartData.map((data: any) => data.position),
                            datasets: [
                                {
                                    label: 'Count',
                                    data: chartData.map((data: any) => data.count),
                                    backgroundColor: colorArray,
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={chartOptions}
                    />

                </>


            }
        </>
    )
}

export default TopJobs