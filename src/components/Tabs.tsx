import { Tabs as TabsChakra, 
    TabList, 
    Tab,
    TabPanels,
    TabPanel} from "@chakra-ui/react";

import Chart from "react-google-charts";

interface TabsProps{
    data1: any,
    data2: any, 
    options1: any,
    options2: any,
}


export function Tabs({data1, data2, options1, options2}: TabsProps) {
  return (
    <TabsChakra isFitted>
      <TabList>
        <Tab _selected={{ bg: "pink.500" }} >Gráfico de Força Cisalhante</Tab>
        <Tab _selected={{ bg: "purple.500" }}>Gráfico de Momento</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={data1}
            options={options1}
          />
        </TabPanel>
        <TabPanel>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={data2}
            options={options2}
          />
        </TabPanel>
      </TabPanels>
    </TabsChakra>
  );
}
