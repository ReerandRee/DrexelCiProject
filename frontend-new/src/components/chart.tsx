import { TypedChartComponent } from "react-chartjs-2/dist/types";
import HText from "./shared/HText";

type Props = {
    name: string;
    description?: string;
    chart: any;
    customizer: any;
  };
  
  const Chart = ({ name, description, chart,customizer }: Props) => {
    const chartStyle = `flex
    flex-col items-center justify-center
    whitespace-normal text-center
    transition duration-500 border-2 bg-gray-20`;
  
    return (
      
      <div className={chartStyle}>
          <HText>{name}</HText>
          <div className="mt-5 inline mx-auto mb-2">{customizer}</div>
          {chart}
          <div className="bg-gray-800 text-white p-5"><p className="">{description}</p></div>
          
      </div>
        
      
    );
  };
  
  export default Chart;