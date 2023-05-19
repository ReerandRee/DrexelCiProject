import { useState, useEffect } from "react";
import { AutoComplete } from "antd";
import axios from "axios";
import { Select } from "antd";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Title
);
/*
function makeRequest(path){
    return new Promise(function (resolve,reject){
        axios.get(path).then((res) => {
            //console.log(res);
            //console.log(res.data.map((theNum) => {return theNum._count.searchterm})[0]);
            var result=  res.data.map((theNum) => {return theNum._count.searchterm})[0];
            resolve(result);
        })
        .catch((err) => {
            reject(err);
        }
        );
    })
}
*/



const JobDistributionByCities = () => {
    async function getData(cityName,positionName){
        //let number = await makeRequest(`/api/jobs?city=${cityName}&position=${positionName}`);
        let number = await axios.get(`/api/jobs?city=${cityName}&position=${positionName}`)
        console.log(number);
        return number;
    }
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositons, setSelectedPositions] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [positionData, setPositionData] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const [plotData, setPlotData] = useState([]);   
    const [jobsInCity, setJobsInCity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    //These following bariables are created for multiple radar ONLY

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

        if (selectedPosition) {
            axios.get(`/api/jobs?searchterm=${selectedPosition}`)
                .then((res) => {
                    setJobsInCity(res.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                }
                );
        }
    }, [selectedPosition]);


    useEffect(() => {
        setIsLoading(true);
        
        console.log("This is the main SQL command that i want to use \n");
        if (selectedPositons) {
            //labels = selectedCities;
            console.log(selectedCities);

            selectedPositons.forEach((position) => {
                const dictionary = {};
                selectedCities.forEach((city) => {
                    dictionary[city] = getData(city,position);

                })
                
                console.log(Object.keys(dictionary));
                console.log(dictionary);
                console.log(dictionary['Dallas, Texas']);
                let theData = {
                    label: position,
                    data: selectedCities.map(label => dictionary[label]),
                };

                console.log("following is the data ");
                console.log(theData);
                
                
            });

        }
        setIsLoading(false);


    }, [selectedPositons,selectedCities]);

    const chartOptions = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Job Distribution by Cities Radar Chart",
          },
        },
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            suggestedMax: 50,
            ticks: {
              stepSize: 10,
            },
          },
        },
      };

    const labels = jobsInCity.map((job) => job.searcharea);
    const counts = jobsInCity.map((job) => job._count.searcharea);

    const chartData = {
        labels: labels,
        datasets: [
          {
            label: "test",
            data: counts,
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(255, 99, 132)",
          },
        ],
      };
    
    return (
    <div>
        <h1>Job Distribution by Cities Radar Chart</h1>
        
        {positionData ? <>
                <Select options={positionOptions} mode='multiple'
                style={{ maxWidth: "700px", minWidth: "500px" }}
                placeholder="Select Positions"
                onChange={(value) => {
                    console.log(value);
                    setSelectedPositions(value);
                    setSelectedCities(["Dallas, Texas", "El Paso, Texas", "Los Angeles, California"])
                }}
            />
                {isLoading ? <div>loading...</div> : <div style={{ width: '90%' }}>
                    <Radar data={chartData} options={chartOptions} />
                </div>
                }
            </> : <></>}
    </div>
  );
};

export default JobDistributionByCities;