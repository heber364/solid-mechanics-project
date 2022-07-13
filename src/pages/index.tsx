import {
  Center,
  Box,
  Heading,
  Flex,
  HStack,
  Radio,
  Stack,
  Button,
} from "@chakra-ui/react";
import {  useEffect, useState } from "react";

import { RadioGroup } from "../components/CheckBoxGroup";
import { InputNumber } from "../components/InputNumber";
import { RangeSlider } from "../components/RangeSlider";
import { Slider } from "../components/Slider";

import { beamWidthLimit } from "./constants"

export default function Home() {
  



  const [beamLength, setBeamLength] = useState(20);

  const [forceDistance, setForceDistance] = useState(0);
  const [momentDistance, setMomentDistance] = useState(0);
  const [startPointWeight, setStartPointWeight] = useState(0);
  const [endPointWeight, setEndPointWeight] = useState(0);

  function handleSetPoints(val: Number[]) {
    setStartPointWeight(Number(val[0]));
    setEndPointWeight(Number(val[1]));
  }


  useEffect(()=>{
    console.log("Força", forceDistance, "Momento", momentDistance, "P1", startPointWeight, "P2", endPointWeight);

  })

  
  return (
    <>
      <Center h={100}>
        <Heading> Trabalho de Mecânica dos Sólidos</Heading>
      </Center>

      <Center>
        <Box >
          <RadioGroup
            name="typeSupport"
            label="Tipo de apoio"
            defaultValue="apoio1"
          >
            <Radio value="apoio1">Engaste - Primeiro Gênero</Radio>
            <Radio value="apoio2">Engaste - Sem apoio</Radio>
            <Radio value="apoio3">Primeiro Gênero - Primeiro Gênero</Radio>
          </RadioGroup>
        </Box>
      </Center>
     
      <Center mt={6}>
        <Box w={800} >
          <Slider 
            name="beamLeagth" 
            label="Comprimento da viga"
            beamLength={beamWidthLimit} 
            onSliderValueChange={setBeamLength} 
            sliderValue={beamLength} />
        </Box>
      </Center>
      

      <Flex justify="center" mt={6}>
        <HStack spacing={5}>
          <Box border="solid 1px white" p={6} borderRadius={10} h={400}>
            <Stack spacing={10}>
              <InputNumber 
                name="strengthValue" 
                label="Valor da força" 
              />
              <Slider 
                name="strengthDistance" 
                label="Local de aplicação da força" 
                beamLength={beamLength}
                onSliderValueChange={setForceDistance}
                sliderValue={forceDistance}
              />
              <Button colorScheme="blue">Adicionar Força</Button>
            </Stack>
          </Box>

          <Box border="solid 1px white" p={6} borderRadius={10} mt={10} h={400}>
            <Stack spacing={10}>
              <InputNumber name="momentValue" label="Momento" />
              <Slider 
                name="distanceMoment" 
                label="Localização de aplicação do momento" 
                beamLength={beamLength}
                onSliderValueChange={setMomentDistance} 
                sliderValue={momentDistance}
              />
              <Button colorScheme="blue">Adicionar Momento</Button>
            </Stack>
          </Box>

          <Box border="solid 1px white" p={6} borderRadius={10} mt={10} h={400}>
            <Stack spacing={10}>
              Carga distribuída
              <InputNumber name="chargeValue" label="Valor da carga" />
              <RangeSlider 
                name="distanceCharge" 
                label="Distribuição da Carga" 
                beamLength={beamLength}  
                onRangeSliderValueChange={handleSetPoints}
                rangeSliderValue={[startPointWeight, endPointWeight]}
              />
              <Button colorScheme="blue">Adicionar Carga</Button>

            </Stack>
          </Box>
        </HStack>
      </Flex>
    </>
  );
}
