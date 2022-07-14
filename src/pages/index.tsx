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
import { useEffect, useState } from "react";

import { RadioGroup } from "../components/CheckBoxGroup";
import { InputNumber } from "../components/InputNumber";
import { RangeSlider } from "../components/RangeSlider";
import { Slider } from "../components/Slider";
import { TagForce } from "../components/Tag/TagForce";
import { TagMoment } from "../components/Tag/TagMoment";
import { TagWeight } from "../components/Tag/TagWeight";

import { beamWidthLimit } from "./constants";

interface ForceProps {
  id: number;
  value: number;
  distance: number;
}

interface MomentProps {
  id: number;
  value: number;
  distance: number;
}

interface WeightProps {
  id: number;
  coefficientA: number;
  coefficientB: number;
  coefficientC: number;
  start: number;
  end: number;
}

export default function Home() {
  /*Valores temporarios dos inputs*/
  const [beamLength, setBeamLength] = useState(0);

  const [support, setSupport] = useState("");

  const [forceValue, setForceValue] = useState(0);
  const [forceDistance, setForceDistance] = useState(0);

  const [momentValue, setMomentValue] = useState(0);
  const [momentDistance, setMomentDistance] = useState(0);

  const [coefficientAWeightFuntion, setCoefficientAWeightFuntion] = useState(0);
  const [coefficientBWeightFuntion, setCoefficientBWeightFuntion] = useState(0);
  const [coefficientCWeightFuntion, setCoefficientCWeightFuntion] = useState(0);

  const [weightStartPoint, setWeightStartPoint] = useState(0);
  const [weightEndPoint, setWeightEndPoint] = useState(0);

  /*Vetores de forças, momentos e cargas*/
  const [forces, setForces] = useState<ForceProps[]>([]);
  const [moments, setMoments] = useState<MomentProps[]>([]);
  const [weights, setWeights] = useState<WeightProps[]>([]);

  /*Salva as forças em um vetor*/
  function handleSaveForcesInVectorForce() {
    setForces((prevstate) => [
      ...prevstate,
      {
        id: Math.random(),
        value: forceValue,
        distance: forceDistance,
      },
    ]);
  }

  /*Remove as forças de um vetor*/
  function handleRemoveForcesInVectorForce(id: number) {
    const newForcesFilters = forces.filter((force) => force.id !== id);

    setForces(newForcesFilters);
  }

  /*Salva os momentos em um vetor*/
  function handleSaveMomentsInVectorMoment() {
    setMoments((prevstate) => [
      ...prevstate,
      {
        id: Math.random(),
        value: momentValue,
        distance: momentDistance,
      },
    ]);
  }

  /*Remove os momentos de um vetor*/
  function handleRemoveMomentsInVectorMoment(id: number) {
    const newMomentsFilters = moments.filter((moment) => moment.id !== id);

    setMoments(newMomentsFilters);
  }

  /*Salva as cargas distribuidas em um vetor*/
  function handleSaveWeightsInVectorWeight() {
    setWeights((prevstate) => [
      ...prevstate,
      {
        id: Math.random(),
        coefficientA: coefficientAWeightFuntion,
        coefficientB: coefficientBWeightFuntion,
        coefficientC: coefficientCWeightFuntion,
        start: weightStartPoint,
        end: weightEndPoint,
      },
    ]);
  }

  /*Remove as cargas distribuidas de um vetor*/
  function handleRemoveWeightsInVectorWeight(id: number) {
    const newWeightsFilters = weights.filter((weight) => weight.id !== id);

    setWeights(newWeightsFilters);
  }

  /*Salva os pontos iniciais e finais da carga em um state*/
  function handleChangeStartAndEndPointWeight(points: Number[]) {
    setWeightStartPoint(Number(points[0]));
    setWeightEndPoint(Number(points[1]));
  }

  useEffect(() => {
    // console.log("Força", forceValue, forceDistance, "Momento", momentValue, momentDistance, "Carga", weightValue, "P1", weightStartPoint, "P2", weightEndPoint);
    // console.log("Tipo de Suporte", support)
    console.log(weights);
  }, [weights]);

  return (
    <>
      <Center h={100}>
        <Heading> Trabalho de Mecânica dos Sólidos</Heading>
      </Center>

      <Center>
        <Box>
          <RadioGroup
            name="typeSupport"
            label="Tipo de apoio"
            defaultValue="support1"
            onChange={(support) => setSupport(support)}
          >
            <Radio value="support1">Engaste - Primeiro Gênero</Radio>
            <Radio value="support2">Engaste - Sem apoio</Radio>
            <Radio value="support3">Primeiro Gênero - Primeiro Gênero</Radio>
          </RadioGroup>
        </Box>
      </Center>

      <Center mt={6}>
        <Box w={800}>
          <Slider
            name="beamLeagth"
            label="Comprimento da viga"
            beamLength={beamWidthLimit}
            onSliderValueChange={setBeamLength}
            sliderValue={beamLength}
          />
        </Box>
      </Center>

      <Flex justify="center" mt={10}>
        <HStack spacing={5}>
          <Box  p={4} h={400}>
            <Stack spacing={10}>
              <InputNumber
                name="strengthValue"
                label="Valor da força"
                onChange={(value) => setForceValue(Number(value))}
              />
              <Slider
                name="strengthDistance"
                label="Local de aplicação da força"
                beamLength={beamLength}
                onSliderValueChange={setForceDistance}
                sliderValue={forceDistance}
            
  
              />
              <Button
                colorScheme="blue"
                onClick={() => handleSaveForcesInVectorForce()}
              >
                Adicionar Força
              </Button>
              <Stack>
                {forces.map((force) => (
                  <TagForce
                    value={force.value}
                    distance={force.distance}
                    onRemoveTag={() =>
                      handleRemoveForcesInVectorForce(force.id)
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </Box>

          <Box  p={4}   h={400}>
            <Stack spacing={10}>
              <InputNumber
                focusBorderColor="purple.500"
                name="momentValue"
                label="Momento"
                onChange={(value) => setMomentValue(Number(value))}
              />
              <Slider
                colorScheme="purple"
                name="distanceMoment"
                label="Localização de aplicação do momento"
                beamLength={beamLength}
                onSliderValueChange={setMomentDistance}
                sliderValue={momentDistance}
              />
              <Button
                colorScheme="purple"
                onClick={() => handleSaveMomentsInVectorMoment()}
              >
                Adicionar Momento
              </Button>
              <Stack>
                {moments.map((moments) => (
                  <TagMoment
                    value={moments.value}
                    distance={moments.distance}
                    onRemoveTag={() =>
                      handleRemoveMomentsInVectorMoment(moments.id)
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </Box>

          <Box p={4} h={400}>
            <Heading as="h2" size="sm" mb={3}>
              Equação que descreve a carga
            </Heading>
            <Stack spacing={10}>
              <HStack spacing={6}>
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeAValue"
                  pHolder="A(x^2)"
                  onChange={(a) => setCoefficientAWeightFuntion(Number(a))}
                />
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeBValue"
                  pHolder="B(x)"
                  onChange={(b) => setCoefficientBWeightFuntion(Number(b))}
                />
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeCValue"
                  pHolder="C"
                  onChange={(c) => setCoefficientCWeightFuntion(Number(c))}
                />
              </HStack>

              <RangeSlider
                colorScheme="pink"
                name="distanceCharge"
                label="Distribuição da Carga"
                beamLength={beamLength}
                onRangeSliderValueChange={handleChangeStartAndEndPointWeight}
                rangeSliderValue={[weightStartPoint, weightEndPoint]}
              />
              <Button
                colorScheme="pink"
                onClick={() => handleSaveWeightsInVectorWeight()}
              >
                Adicionar Carga
              </Button>
              <Stack>
                {weights.map((weight) => (
                  <TagWeight
                    a={weight.coefficientA}
                    b={weight.coefficientB}
                    c={weight.coefficientC}
                    start={weight.start}
                    end={weight.end}
                    onRemoveTag={() =>
                      handleRemoveWeightsInVectorWeight(weight.id)
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
        </HStack>
      </Flex>
    </>
  );
}
