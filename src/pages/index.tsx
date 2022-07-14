import {
  Box,
  Heading,
  Flex,
  HStack,
  Radio,
  Stack,
  Button,
  Divider,
  Text,
} from "@chakra-ui/react";



import { RadioGroup } from "../components/CheckBoxGroup";
import { InputNumber } from "../components/InputNumber";
import { RangeSlider } from "../components/RangeSlider";
import { Slider } from "../components/Slider";
import { TagForce } from "../components/Tag/TagForce";
import { TagMoment } from "../components/Tag/TagMoment";
import { TagWeight } from "../components/Tag/TagWeight";


import { beamWidthLimit } from "./constants";
import { useEffect, useState } from "react";


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
  forceModule: number;
  forceModulePosition: number;
}

interface SupportProps {
  reactionForce: number;
}

export default function Home() {
  /*Valores temporarios dos inputs*/
  const [beamLength, setBeamLength] = useState(0);

  const [supportType, setSupportType] = useState("support1");

  const [ supportA, setSupportA ] = useState<SupportProps>({reactionForce: 0});
  const [ supportB, setSupportB ] = useState<SupportProps>({reactionForce: 0});

  const [forceValue, setForceValue] = useState(0);
  const [forceDistance, setForceDistance] = useState(0);

  const [momentValue, setMomentValue] = useState(0);
  const [momentDistance, setMomentDistance] = useState(0);

  const [coefficientAWeightFunction, setCoefficientAWeightFunction] = useState(0);
  const [coefficientBWeightFunction, setCoefficientBWeightFunction] = useState(0);
  const [coefficientCWeightFunction, setCoefficientCWeightFunction] = useState(0);

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

    const Integral = require('sm-integral');

    /* funcao da carga distribuida */
    function expressionDistributedWeight(x) {
      return  coefficientAWeightFunction*x*x + coefficientBWeightFunction*x + coefficientCWeightFunction;
    }

    /*Módulo da força de toda carga distribuida */
    const weightModule = Integral.integrate(expressionDistributedWeight, 0, weightEndPoint - weightStartPoint);
    
    /* funcao do X barra */
    function expressionDistanceXBar(x) {
      return  coefficientAWeightFunction*x*x*x + coefficientBWeightFunction*x*x + coefficientCWeightFunction*x;
    }

    /*Posição do modulo da força resultante */
    const xBar = Integral.integrate(expressionDistanceXBar, 0, weightEndPoint - weightStartPoint)/weightModule + weightStartPoint;
    
    
    setWeights((prevstate) => [
      ...prevstate,
      {
        id: Math.random(),
        coefficientA: coefficientAWeightFunction,
        coefficientB: coefficientBWeightFunction,
        coefficientC: coefficientCWeightFunction,
        start: weightStartPoint,
        end: weightEndPoint,
        forceModule: weightModule,
        forceModulePosition: xBar,
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

  /*Verifica se há o minimo de dados preenchidos para o calculo da carga distribuida */
  function emptyWeightData(){
    if(weightEndPoint == 0){
      return true;
    }else if(coefficientAWeightFunction == 0 && coefficientBWeightFunction  == 0 && coefficientCWeightFunction == 0){
      return true;
    }else{
      return false;
    }
  }

  function handleCalculateSupportReactions(){
    if(supportType == "support1"){
      
      var sumForcesByDistances = 0;
      var sumForces = 0;

      forces.map(force =>{
        sumForcesByDistances += force.value*force.distance
        sumForces += force.value;
      })

      var sumMoments = 0;
      moments.map(moment =>{
        sumMoments += moment.value;
      })

      var sumForcesModuleByXBar = 0;
      var sumForcesModule = 0;

      weights.map(weight => {
        sumForcesModuleByXBar += weight.forceModule * weight.forceModulePosition;
        sumForcesModule += weight.forceModule;
      })

      const By = (-(sumForcesByDistances + sumMoments + sumForcesModuleByXBar)/beamLength)
      const Ay = (-(By + sumForces + sumForcesModule))


      setSupportA({reactionForce:Ay})
      setSupportB({reactionForce:By})
    }

  }


  useEffect(() => {
    console.log(weights);
  }, [weights]);

  return (
    <Flex direction="column" h="100vh" justify="center" px={20}>
      <Heading mt={8}> Trabalho de Mecânica dos Sólidos</Heading>
      <Divider mt={2} />

      <Stack mt={8} spacing={10}>
        <RadioGroup
          name="typeSupport"
          label="Tipo de apoio"
          defaultValue="support1"
          onChange={(support) => setSupportType(support)}
        >
          <Radio value="support1">Apoio simples - Apoio simples</Radio>
          <Radio value="support2">Apoio simples - Engaste</Radio>
          <Radio value="support3">Sem apoio - Engaste</Radio>
        </RadioGroup>
        <Box w={800}>
          <Slider
            name="beamLeagth"
            label="Comprimento da viga"
            beamLength={beamWidthLimit}
            onSliderValueChange={setBeamLength}
            sliderValue={beamLength}
          />
        </Box>

        <Flex direction="row" justify="flex-start"  gap={6}>
          <Box>
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
                isDisabled={forceValue==0}
              >
                Adicionar Força
              </Button>
              <Stack>
                {forces.map((force) => (
                  <TagForce
                    key={force.id}
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

          <Box>
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
                isDisabled={momentValue==0}
              >
                Adicionar Momento
              </Button>
              <Stack>
                {moments.map((moment) => (
                  <TagMoment
                    key={moment.id}
                    value={moment.value}
                    distance={moment.distance}
                    onRemoveTag={() =>
                      handleRemoveMomentsInVectorMoment(moment.id)
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </Box>

          <Box >
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
                  onChange={(a) => setCoefficientAWeightFunction(Number(a))}
                />
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeBValue"
                  pHolder="B(x)"
                  onChange={(b) => setCoefficientBWeightFunction(Number(b))}
                />
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeCValue"
                  pHolder="C"
                  onChange={(c) => setCoefficientCWeightFunction(Number(c))}
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
                isDisabled={emptyWeightData()}
              >
                Adicionar Carga
              </Button>
              <Stack>
                {weights.map((weight) => (
                  <TagWeight
                    key={weight.id}
                    a={weight.coefficientA}
                    b={weight.coefficientB}
                    c={weight.coefficientC}
                    start={weight.start}
                    end={weight.end}
                    module={weight.forceModule}
                    xBar={weight.forceModulePosition}
                    onRemoveTag={() =>
                      handleRemoveWeightsInVectorWeight(weight.id)
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
        </Flex>
      </Stack>
      <Button 
        variant="solid" 
        colorScheme="blackAlpha" 
        onClick={()=>handleCalculateSupportReactions()}
        >
          Calcular Força e momento resultantes
      </Button>
      <Text fontSize="2xl">Reação de apoio em Ay: {parseFloat(String(supportA.reactionForce)).toFixed(2)}</Text>
      <Text fontSize="2xl">Reação de apoio em By: {parseFloat(String(supportB.reactionForce)).toFixed(2)}</Text>

    </Flex>
  );
}
