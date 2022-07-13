import {
  Center,
  Box,
  Heading,
  Flex,
  HStack,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { RadioGroup } from "../components/CheckBoxGroup";

import { InputNumber } from "../components/InputNumber";

export default function Home() {
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
              <InputNumber name="strengthDistance" label="Distância da força" />
            </Stack>
          </Box>

          <Box border="solid 1px white" p={6} borderRadius={10} mt={10} h={400}>
            <Stack spacing={10}>
              <InputNumber name="torqueValue" label="Momento" />
              <InputNumber name="torqueDistance" label="Distancia do torque" />
            </Stack>
          </Box>

          <Box border="solid 1px white" p={6} borderRadius={10} mt={10} h={400}>
            <Stack spacing={10}>
              Carga distribuída
              <InputNumber name="chargeValue" label="Valor da carga" />
              <InputNumber name="startCharge" label="Inicio da carga" />
              <InputNumber name="endCharge" label="Final da carga" />
            </Stack>
          </Box>
        </HStack>
      </Flex>
    </>
  );
}
