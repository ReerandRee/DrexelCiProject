import { Select } from "antd"
import { useState } from 'react';
import PageLayout from "./PageLayout";

const SelectCity = ({ cities }) => {
  // const [userInput, setUserInput] = useState();

  return (
    <>
      <Select
        mode="multiple"
        allowClear
        placeholder="Please select"
        style={{ width: '50vw' }}
      // value={userInput}
      >
        {cities.map((city) => {
          return (
            <Select.Option key={city.city + "," + city.state_name}>
              {city.city}, {city.state_name}
            </Select.Option>
          )
        })}
      </Select>
    </>
  )
}

export default SelectCity