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
import Navbar from "@/components/Navbar";
import Chart2 from '@/components/chart';

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
    const [timeframe, setTimeframe] = useState('')

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
                text: 'Top 10 Cities By Position Bar Chart',
            },
        },
    };

    return (
        <>
            <Navbar>
                <div>
                    {isLoading ? <div
          className="flex basis-3/5 justify-center md:z-10
              md:ml-40 mt-16 md:justify-items-end"
        >
          <img alt="Loading.." src="/assets/loading.gif" />
        </div> :
                    <div style={{ width: '100%', height: '100%' }}>
                    <Chart2 name={'Top 10 Cities for the Job Category'} 
                    description={'The graph represents the top 10 cities for a particular job category. The horizontal axis of the graph represents the cities, while the vertical axis represents either the frequency or the percentage of jobs in that job category.This visual representation allows for a quick comparison of the top cities for the specific job category. It helps identify which cities have the highest concentration of jobs in that particular field.'} 
                    customizer={<div className="flex gap-10">
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
                </div>}
                    chart={<div style={{ width: '80%', height: '100%' }}>
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
                    </div>}/>
                  </div>     
  
              }
                        
                    
                </div>
            </Navbar>
        </>
    )
}

export default TopCities;