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
import Chart2 from '@/components/chart';

ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
	Title
);

import { colorArray } from "@/constants";
import Navbar from "@/components/Navbar";


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

	const [theArrayOfJob, setTheArrayOfJob] = useState<any[]>([]);

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
		axios.get('api/cityjobcount')
			.then((res) => {
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
			let newChartData: ChartData<"radar", number[], string> = {
				labels: selectedCities,
				datasets: [],
			}

			let color: number = 0;
			//Initialize each position as its own dictionary
			for (const position of selectedPositions) {
				let dataset = {
					label: position,
					data: selectedCities.map(city => {
						let jobCount = getJobCount(city, position, theArrayOfJob);
						return jobCount;
					}),
					fill: true,
					borderColor: colorArray[color],
					backgroundColor: colorArray[color] + "33", //opacity of 20%
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: colorArray[color],
				};
				newChartData.datasets.push(dataset);
				color++;
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
								cityName: city as string,
								jobName: position as string,
								jobCount: res.data[0] == null ? 0 : res.data[0]["_count"]["searchterm"] as number,
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
		<>
			<Navbar>
				<div>
                    {isLoading ? <div
          className="flex basis-3/5 justify-center md:z-10
              md:ml-40 mt-16 md:justify-items-end"
        >
          <img alt="Loading.." src="/assets/loading.gif" />
        </div> :
				<div className="flex flex-col">
                  <Chart2 name={'Job Distribution by Cities Radar Chart'} 
                  description={'The radar chart represents the distribution of jobs across different cities. The chart consists of a circular grid with multiple axes radiating from the center, each representing a specific city. The number of axes corresponds to the number of cities included in the analysis.This visual representation allows for a quick comparison of job distributions across different cities. It helps identify which cities have a higher concentration of jobs and provides an overview of the job distribution pattern across the analyzed cities.'} 
                  customizer={<div className="flex flex-wrap">
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
			  </div>}
                  chart={<div className="w-full max-h-[470px] flex justify-center items-center">
                  <Radar data={plotData} options={chartOptions} />                  
                  </div>}/>
                </div>}
				</div>
			</Navbar>

		</>
	);
};

export default JobDistributionByCities;