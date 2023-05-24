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
    <>  <Navbar/>
        {isLoading && cityData.length === 0 && categoryData.length === 0 ? <div>Loading...</div> :
          <>
            <Radio.Group optionType="button" options={chartOptions} onChange={onChange} value={chartType} />
            <div className=''>

              {chartType === 'category' &&
                <div style={{ width: '70%', height: '100%' }}>
                  <Bar options={categoryOptions} data={categoryChartData} />
                </div>
              }

              {chartType === 'city' && <div style={{ width: '70%', height: '100%' }}>
                <Bar options={cityOptions} data={cityChartData} />
              </div>}
            </div>
          </>
        }
      
    </>
  )
}
