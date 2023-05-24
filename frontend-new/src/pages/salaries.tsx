
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
import { Select } from "antd";
import axios from "axios";
import Navbar from "@/components/Navbar";

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <p>Loading...</p> });

const Salaries = () => {

    const [options, setOptions] = useState([])
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [plotData, setPlotData] = useState<any[]>([]);


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
    }, []);

    useEffect(() => {

        if (selectedPositions) {
            selectedPositions.forEach((position: string) => {

                axios.get(`/api/salaries?position=${position}`)
                    .then((res) => {
                        let data = {
                            y: res.data.map((salary: any) => { return salary.parsed_salary }) as number[],
                            type: 'box' as const,
                            name: position,
                        };
                        console.log(data);
                        setPlotData((plotData) => [...plotData, data]);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        }
        setPlotData([]);

        console.log(plotData);
    }, [selectedPositions])

    const layout = {
        title: 'Salaries for Selected Jobs',
        yaxis: {
            title: 'Salary',
        },
    };


    return (
        <>
            <Navbar>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-3xl'>Salaries</h1>
                    <Select options={options} mode='multiple'
                        style={{ maxWidth: "700px", minWidth: "500px" }}
                        placeholder="Select Positions"
                        onChange={(value) => {
                            console.log(value);
                            setSelectedPositions(value);
                        }}
                    />
                    <Plot layout={layout} data={plotData} />
                </div>
            </Navbar>
        </>
    )
}

export default Salaries;