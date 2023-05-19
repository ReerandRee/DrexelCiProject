import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Select } from "antd";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  ChartData
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




const JobDistributionByCities = () => {
  async function getData(cityName: string, positionName: string): Promise<any> {
    //let number = await makeRequest(`/api/jobs?city=${cityName}&position=${positionName}`);
    const response: AxiosResponse<any> = await axios.get(`/api/jobs?city=${cityName}&position=${positionName}`);
    const data = response.data;
    return data;
  }

  function getJobCount(city: string, jobName: string, jobData: Array<any>): number {
    // Find the object in jobData that matches the city and job name
    let matchedJob = jobData.find(item => item.cityName === city && item.jobName === jobName);

    // Return the job count if a match is found, otherwise return 0 or any default value you prefer
    return matchedJob ? matchedJob.jobCount : 0;
  }

  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<any[]>([]); //"Dallas, Texas", "El Paso, Texas", "Los Angeles, California"
  const [positionData, setPositionData] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [options, setOptions] = useState([])
  const [plotData, setPlotData] = useState<ChartData<"radar", number[], string>>({
    labels: selectedCities,
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  interface jobInCity {
    cityName: String,
    jobName: String,
    number: number,
  }

  // interface ChartData {
  //   labels: string[];
  //   datasets: {
  //     label: string;
  //     data: number[];
  //     fill: boolean;
  //   }[];
  // }

  //const [jobCountToCity, setJobCountToCity] = useState({});
  const [theArrayOfJob, setTheArrayOfJob] = useState<any[]>([]);

  useEffect(() => {
    //setSelectedCities(["Dallas, Texas", "El Paso, Texas", "Los Angeles, California"]);
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
    //setSelectedCities(["Dallas, Texas", "El Paso, Texas", "Los Angeles, California"]);
    axios.get('api/cityjobcount')
      .then((res) => {
        console.log(res);
        setCityOptions(res.data.map((position: any) => {
          return {
            value: position.city,
            label: position.city
          }
        }));
      });
  }, []);



  useEffect(() => {


    const entries = theArrayOfJob.length;
    const totalNeeded = selectedCities.length * selectedPositions.length;
    if (entries === totalNeeded) {
      let newChartData : ChartData<"radar", number[], string> = {
        labels: selectedCities,
        datasets: [],
      }

      //Initialize each position as its own dictionary
      for (const position of selectedPositions) {
        let dataset = {
          label: position,
          data: selectedCities.map(city => {
            let jobCount = getJobCount(city, position, theArrayOfJob);
            return jobCount;
          }),
          fill: true,
        };
        newChartData.datasets.push(dataset);
      }
      setPlotData(newChartData);
    }



  }, [theArrayOfJob]);

  useEffect(() => {
    setIsLoading(true);
    setTheArrayOfJob([]);

    if (selectedPositions) {
      for (const position of selectedPositions) {
        for (const city of selectedCities) {
          axios.get(`/api/positionandcity?city=${city}&position=${position}`).then(
            (res) => {
              let data = {
                cityName: city as String,
                jobName: position as String,
                jobCount: res.data[0]["_count"]["searchterm"] as number,
              };
              setTheArrayOfJob((theArrayOfJob) => [...theArrayOfJob, data]);
            }
          )
        }

      };

    }
    setIsLoading(false);


  }, [selectedPositions, selectedCities]);

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

      },
    },
  };

  return (
    <div>
      <h1>Job Distribution by Cities Radar Chart</h1>

      {positionData ? <>
        <Select options={options} mode='multiple'
          style={{ maxWidth: "700px", minWidth: "500px" }}
          placeholder="Select Positions"
          onChange={(value) => {
            setSelectedPositions(value);
          }}
        />
        <Select options={cityOptions} mode='multiple'
          style={{ maxWidth: "700px", minWidth: "500px" }}
          placeholder="Select Cities"
          onChange={(value) => {
            setSelectedCities(value);
          }}
        />
        {isLoading ? <div>loading...</div> : <div style={{ width: '90%' }}>
          <Radar data={plotData} options={chartOptions} />
        </div>
        }
      </> : <></>}
    </div>
  );
};

export default JobDistributionByCities;