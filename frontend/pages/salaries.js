
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
import { Select } from "antd";
import axios from "axios";

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <p>Loading...</p> });

const salaries = () => {

    const [selectedPositons, setSelectedPositions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const [plotData, setPlotData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        axios.get("/api/jobs?searchterm=all")
            .then((res) => {
                setPositionOptions(res.data.map((postion) => { return { value: postion.searchterm, label: postion.searchterm } }));
                // console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        setIsLoading(true);

        if (selectedPositons) {
            console.log(selectedPositons);
            setPlotData([]);
            selectedPositons.forEach((position) => {
                axios.get(`/api/jobs?salary=${position}`)
                    .then((res) => {
                        let data = {
                            y: res.data.map((salary) => { return salary.parsed_salary }),
                            type: 'box',
                            name: position,
                        };
                        console.log(data);
                        setPlotData((plotData) => [...plotData, data]);


                        console.log(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    }
                    );
            });

        }
        setIsLoading(false);


    }, [selectedPositons]);



    const layout = {
        title: 'Salaries for Selected Jobs',
        yaxis: {
            title: 'Salary',
        },
    };


    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <Select options={positionOptions} mode='multiple'
                style={{ maxWidth: "700px", minWidth: "500px" }}
                placeholder="Select Positions"
                onChange={(value) => {
                    console.log(value);
                    setSelectedPositions(value);

                }}
            />
            <div style={{
                display: "flex",
                justifyContent: "center",
            }}>
                {isLoading ? <p>Loading...</p> :
                    <Plot
                        data={plotData}
                        layout={layout}
                    />
                }
            </div>
        </div>
    );
}

export default salaries;