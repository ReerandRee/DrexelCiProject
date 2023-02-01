import { Select } from "antd"

const SelectBar = (props) => {

    const handleChange = (value) => {
        console.log(value);
        props.setSelected(value);
    }

    return (
        <>
            <Select
                mode={props.multiple ? "multiple" : null}
                allowClear
                placeholder="Please select"
                style={{ width: '50vw' }}
                onChange={value => handleChange(value)}
            // value={userInput}
            >
                {props.data.map((job) => {
                    return (
                        <Select.Option key={job.id}>
                            {job.Job_Title}
                        </Select.Option>
                    )
                })}
            </Select>
        </>
    )
}

export default SelectBar