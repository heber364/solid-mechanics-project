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
import { useState } from "react";
import { RadioGroup } from "../components/CheckBoxGroup";

import { InputNumber } from "../components/InputNumber";
import { RangeSlider } from "../components/RangeSlider";
import { Slider } from "../components/Slider";

export default function Home() {

  const [beamLength, setBeamLength] = useState(20);


  
  return (
    <>
      <Center h={100}>
        <Heading> Trabalho de Mecânica dos Sólidos</Heading>
      </Center>
      <Center>
        <Box>
          <RadioGroup
            name="firstSupport"
            label="Tipo do primeiro apoio"
            defaultValue="apoio1"
          >
            <Radio value="apoio1">Tipo 1</Radio>
            <Radio value="apoio2">Tipo 2</Radio>
            <Radio value="apoio3">Tipo 3</Radio>
          </RadioGroup>
        </Box>
        <Box ml={40}>
          <RadioGroup
            name="secondSupport"
            label="Tipo do segundo apoio"
            defaultValue="apoio1"
          >
            <Radio value="apoio1">Tipo 1</Radio>
            <Radio value="apoio2">Tipo 2</Radio>
            <Radio value="apoio3">Tipo 3</Radio>
          </RadioGroup>
        </Box>
      </Center>

      <Flex justify="center" mt={6}>
        <HStack spacing={5}>
          <Box border="solid 1px white" p={6} borderRadius={10} h={400}>
            <Stack spacing={10}>
              <InputNumber name="strengthValue" label="Valor da força" />
              <Slider name="strengthDistance" label="Local de aplicação da força" beamLength={beamLength}/>
              <Button colorScheme="blue">Adicionar Força</Button>
            </Stack>
          </Box>

          <Box border="solid 1px white" p={6} borderRadius={10} mt={10} h={400}>
            <Stack spacing={10}>
              <InputNumber name="momentValue" label="Momento" />
              <Slider name="distanceMoment" label="Localização de aplicação do momento" beamLength={beamLength} />
              <Button colorScheme="blue">Adicionar Momento</Button>
            </Stack>
          </Box>

          <Box border="solid 1px white" p={6} borderRadius={10} mt={10} h={400}>
            <Stack spacing={10}>
              Carga distribuída
              <InputNumber name="chargeValue" label="Valor da carga" />
              <RangeSlider name="distanceCharge" label="Distribuição da Carga" beamLength={beamLength} />
              <Button colorScheme="blue">Adicionar Carga</Button>

            </Stack>
          </Box>
        </HStack>
      </Flex>
    </>
  );
}
