import Head from 'next/head'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useState } from 'react';
import { colorArray } from '@/constants';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import Navbar from '@/components/Navbar';
import Chart from '@/components/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const categoryOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Job Count By Category Bar Chart',
    },
  },
};

const cityOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Job Count By City Bar Chart',
    },
  },
};

interface CategoryData {
  position?: string;
  count?: number;
}

interface CityData {
  city?: string;
  count?: number;
}

export default function Home() {

  const [categoryData, setData] = useState<CategoryData[]>([]);
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartType, setChartType] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      axios.get('api/cityjobcount')
        .then((res) => {
          setCityData(res.data);
          console.log(res.data);
        });

      axios.get('api/positionjobcount')
        .then((res) => {
          setData(res.data);
        });

      setIsLoading(false);
    };

    fetchData();
    setChartType('category');
  }, []);


  const labels = categoryData.map((job) => {
    return job.position;
  });

  const counts = categoryData.map((job) => {
    return job.count;
  });

  const categoryChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Jobs',
        data: counts,
        borderWidth: 1,
        backgroundColor: colorArray
      },
    ],
  }

  const cityLabels = cityData.map((city) => {
    return city.city;
  })

  const cityCounts = cityData.map((city) => {
    return city.count;
  })

  const cityChartData = {
    labels: cityLabels,
    datasets: [
      {
        label: 'Jobs',
        data: cityCounts,
        borderWidth: 1,
        backgroundColor: colorArray
      },
    ],
  }

  const chartOptions = [{ value: "category", label: "Job Count by Category" }, { value: "city", label: "Job Count by City" }]

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setChartType(e.target.value);
  };

  return (
    <>
      <Navbar>
        {isLoading && cityData.length === 0 && categoryData.length === 0 ? <div
          className="flex basis-3/5 justify-center md:z-10
              md:ml-40 mt-16 md:justify-items-end"
        >
          <img alt="Loading.." src="/assets/loading.gif" />
        </div> :
          <>

              {chartType === 'category' &&
                <div style={{ width: '100%', height: '100%' }}>
                  <Chart name={'Bar Graph Depicting Job Counts by Category'} 
                  description={'The bar graph represents different job categories and their respective frequencies. The horizontal axis of the graph represents the job categories, while the vertical axis represents the frequency or number of jobs in each category.'} 
                  customizer={<Radio.Group optionType="button" options={chartOptions} onChange={onChange} value={chartType} buttonStyle="solid" />}
                  chart={<div style={{ width: '80%', height: '100%' }}>
                  <Bar options={categoryOptions} data={categoryChartData} />                  
                  </div>}/>
                </div>
              }

              {chartType === 'city' && <div style={{ width: '100%', height: '100%' }}>
                  <Chart name={'Bar Graph Depicting Job Counts by the City'} 
                  description={'The bar graph represents the number of jobs in different cities. The horizontal axis of the graph represents the cities, while the vertical axis represents the job counts or the number of jobs in each city.'} 
                  customizer={<Radio.Group optionType="button" options={chartOptions} onChange={onChange} value={chartType}/>}
                  chart={<div style={{ width: '80%', height: '100%' }}>
                  <Bar options={cityOptions} data={cityChartData} />                  
                  </div>}/>
                </div>}
            
            
            
          </>
        }
      </Navbar>

    </>
  )
}
