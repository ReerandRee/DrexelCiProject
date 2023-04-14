import { AutoComplete } from "antd"
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
            axios.get(`/api/topjobs?city=${value}`)
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
    }, [value]);

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