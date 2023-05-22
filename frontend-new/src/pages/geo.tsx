import React, { useState, useEffect, use } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import axios from "axios"

//const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const colorScale = scaleQuantize<string>()
  //.domain([0.01, 0.025, 0.026, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06])
  .domain([
    0.016374953480245796, 0.05594914237633937
  ])
  .range([
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618"
  ]);

interface cityData {
  city:string,
  count: number;
}

function getWordAfterComma(str: string): string | null {
  const parts = str.split(',');

  if (parts.length > 1) {
    // Trim leading and trailing whitespace from the extracted word
    const wordAfterComma = parts[1].trim();
    return wordAfterComma;
  }

  return null; // Return null if no comma found or if it's the last word
}

const MapChart = () => {
  const [data, setData] = useState<cityData[]>([]);
  const [totalJobCount, setJobCount] = useState(0);
  const [stateData, setStateData] = useState<any[]>([]);
  const [stateData2, setStateData2] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      axios.get('api/cityjobcount')
        .then((res) => {
          setData(res.data);
          
        });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect( () => {
    const stateToCount: { [key:string]: number} ={};
    var totalJobs : number = 0;
    for (const theCity of data){
      const {city, count} = theCity;

      totalJobs += count;
    }
    for (const theCity of data){
      const {city, count} = theCity;

      const state = getWordAfterComma(city) as string;

      if (stateToCount.hasOwnProperty(state)){
        stateToCount[state] += count/totalJobs;
      }
      else {
        stateToCount[state] = count/totalJobs;
      }
      
    }
    //setJobCount(totalJobs);
    setStateData2(stateToCount);
   
  },[data]);

  useEffect( () => {
    console.log(stateData2);
   
  },[stateData2]);


  return (
    <div className="flex flex-col">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({geographies}) =>
            geographies.map((geo:any) => {
              var jobCount = 0;
              //const cur = data.find((s) => s.id === geo.id);
              if (stateData2.hasOwnProperty(geo.properties.name)){
                jobCount = stateData2[geo.properties.name];
              } else {
                jobCount = 0;
              }
              console.log(colorScale(jobCount));

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  //fill={cur ? colorScale(cur.unemployment_rate) : "#EEE"}
                  fill={colorScale(jobCount)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      </div>
  );
};

export default MapChart;
