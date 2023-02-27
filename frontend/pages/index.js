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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const categoryOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Job Count By Category Bar Chart',
    },
  },
};

export const cityOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Job Count By City Bar Chart',
    },
  },
};

const Home = () => {

  const [categoryData, setData] = useState([{}]);
  const [cityData, setCityData] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      const jobCount = await axios(
        `http://localhost:3000/api/jobCount`
      );

      const cityJobCount = await axios(
        `http://localhost:3000/api/jobsPerCity`
      );

      console.log(jobCount);
      console.log(cityJobCount);
      setData(jobCount.data);
      setCityData(cityJobCount.data);
    };

    fetchData();
  }, []);

  const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];


  const labels = categoryData.map((job) => {
    return job.searchterm;
  });

  const counts = categoryData.map((job) => {
    return job._count;
  });

  const categoryChartData = {
    labels,
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
    return city.searcharea;
  })

  const cityCounts = cityData.map((city) => {
    return city._count;
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

  return (
    <>
      <div>Homepage</div>

      <div style={{ width: '75%', height: '50%', margin: 'auto' }}>
        <Bar options={categoryOptions} data={categoryChartData} />
      </div>

      <div style={{ width: '75%', height: '50%', margin: 'auto' }}>
        <Bar options={cityOptions} data={cityChartData} />
      </div>
    </>
  )
}

// export const getServerSideProps = async () => {
//   const jobs = await prisma.jobs.findMany({
//     select: {
//       company: true,
//       location: true,
//       id: true,
//       search_term: true,

//     }, 
//     where: {
//       location: {
//         contains: 'New York',
//       },
//     },
//   })

// }

export default Home