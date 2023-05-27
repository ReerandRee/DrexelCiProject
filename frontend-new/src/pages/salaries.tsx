
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
import { Select } from "antd";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Chart2 from '@/components/chart';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <div
    className="flex basis-3/5 justify-center md:z-10
        md:ml-40 mt-16 md:justify-items-end"
  >
    <img alt="Loading.." src="/assets/loading.gif" />
  </div> });

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
                
                <div style={{ width: '100%', height: '100%' }}>
                  <Chart2 name={'Salaries'} 
                  description={'The graph represents the salary ranges for multiple jobs. The horizontal axis of the graph represents the job titles or job categories, while the vertical axis represents the salary ranges. This visual representation allows for a quick comparison of the salary ranges across multiple jobs. It helps to identify which jobs have higher or lower salary ranges and provides a visual overview of the salary distribution for different professions.'} 
                  customizer={<Select options={options} mode='multiple'
                  style={{ maxWidth: "700px", minWidth: "500px" }}
                  placeholder="Select Positions"
                  onChange={(value) => {
                      console.log(value);
                      setSelectedPositions(value);
                  }}
              />}
                  chart={<div style={{ width: '100%', height: '100%' }}>
                  <Plot layout={layout} data={plotData} />                  
                  </div>}/>
                </div>
            </Navbar>
        </>
    )
}

export default Salaries;