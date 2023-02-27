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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const Home = () => {

  const [data, setData] = useState([{}]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/jobCount')
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
  }, []);

  const labels = data.map((job) => {
    return job.searchterm;
  })

  const counts = data.map((job) => {
    return job._count;
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Job Count',
        data: counts,
        borderWidth: 1,
      },
    ],
  }


  return (
    <>
      <div>Homepage</div>

      <Bar options={options} data={chartData} />

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