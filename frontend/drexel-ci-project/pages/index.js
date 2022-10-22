import { AutoComplete } from 'antd';
import { useState, useEffect } from 'react';
import useSWR from 'swr'
import { fetcher } from '../constants';


const Home = () => {
  const [options, setOptions] = useState([]);

  // Gets data from rest api defined in pages/api/cities.js

  const { data, error } = useSWR('/api/cities', fetcher)

  useEffect(() => {
    if (data) {
      setOptions(data);
    }
  }, [data])

  if (data) {
    console.log(options)
    // setOptions(data.citiesList);
  }



  // const getOptions = async () => {
  //   await fetch('/api/cities')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // console.log(data);
  //       setOptions(data.citiesList);
  //       return data;
  //     }
  //     );
  // };

  // // Calls 
  // useEffect(() => {
  //   getOptions();
  // }, []);

  return (
    <AutoComplete
      style={{ width: 200 }}
      options={options}
      placeholder="Cities"
    />
  )
}

export default Home