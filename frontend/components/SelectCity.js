import { Select } from "antd"
import { useState } from 'react';
import PageLayout from "./PageLayout";

const SelectCity = (props) => {
  // const [userInput, setUserInput] = useState();
  // const [selectedCities, setSelectedCities] = useState([]);

  const handleChange = (value) => {
    console.log(value);
    props.setSelectedCities(value);
  }
  return (
    <>
      <Select
        // mode="multiple"
        allowClear
        placeholder="Please select"
        style={{ width: '50vw' }}
        onChange={value => handleChange(value)}
      // value={userInput}
      >
        {props.cities.map((city) => {
          return (
            <Select.Option key={city.city + ", " + city.state_name}>
              {city.city}, {city.state_name}
            </Select.Option>
          )
        })}
      </Select>
    </>
  )
}

export default SelectCity