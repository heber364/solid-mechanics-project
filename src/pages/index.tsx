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
import { TagForce } from "../components/Tag/TagForce";
import { TagMoment } from "../components/Tag/TagMoment";
import { TagWeight } from "../components/Tag/TagWeight";

import { useEffect, useState } from "react";

import _ from "lodash";
import produce from "immer";

import {
  beamWidthLimit,
  shearForceOptions,
  momentOptions,
  Integral,
} from "../utils/constants";

import {
  ForceMomentProps,
  WeightProps,
  SupportProps,
  RectangularBeamProps,
  MaximumMomentProps,
  CircularBeamProps,
  TriangularBeamProps,
} from "../utils/interfaceProps";

import Chart from "react-google-charts";

export default function Home() {
  const [updateUseEffect1, setUpdateUseEffect1] = useState(false);
  const [updateUseEffect2, setUpdateUseEffect2] = useState(false);
  /*Valores temporarios dos inputs*/

  /*Etapa 1*/
  const [beamLength, setBeamLength] = useState(10);

  const [supportType, setSupportType] = useState("support1");

  const [supportA, setSupportA] = useState<SupportProps>({
    reactionForce: 0,
    reactionMoment: 0,
  });
  const [supportB, setSupportB] = useState<SupportProps>({
    reactionForce: 0,
    reactionMoment: 0,
  });

  const [forceValue, setForceValue] = useState(0);
  const [forceDistance, setForceDistance] = useState(0);

  const [momentValue, setMomentValue] = useState(0);
  const [momentDistance, setMomentDistance] = useState(0);

  const [coefficientA, setCoefficientA] = useState(0);
  const [coefficientB, setCoefficientB] = useState(0);
  const [coefficientC, setCoefficientC] = useState(0);

  const [weightStartPoint, setWeightStartPoint] = useState(0);
  const [weightEndPoint, setWeightEndPoint] = useState(0);

  /*Vetores de forças, momentos e cargas*/
  const [forces, setForces] = useState<ForceMomentProps[]>([
    // { id: 1, type: "force", distance: 3, value: -10 },
    // { id: 2, type: "force", distance: 13, value: -15 },
  ]);

  const [moments, setMoments] = useState<ForceMomentProps[]>([]);
  const [weights, setWeights] = useState<WeightProps[]>([
    {
      id: 3,
      type: "weight",
      distance: 0,
      length: 10,
      coefficientA: 0,
      coefficientB: 0,
      coefficientC: 5,
      forceModule: -50,
      forceModulePosition: 5,
    },
  ]);

  const [chartData, setChartData] = useState([]);
  const [chartData2, setChartData2] = useState([]);

  /*Etapa 2*/
  const [beamProfile, setBeamProfile] = useState("retangular");
  const [maximumMoment, setMaximumMomment] = useState<MaximumMomentProps>({
    value: 0,
    position: 0,
  });

  const [rectangularBeam, setRectangularBeam] = useState<RectangularBeamProps>({
    a: 0,
    b: 0,
  });
  const [distanceNeutralAxis, setDistanceNeutralAxis] = useState(0);

  const [circularBeam, setCircularBeam] = useState<CircularBeamProps>({
    r: 0,
  });

  const [triangularBeam, setTriangularBeam] = useState<TriangularBeamProps>({
    b: 0,
    h: 0,
  });

  const [xSectionChosen, setXSectionChosen] = useState(0);


  const [momentChosen, setMomentChosen] = useState<MaximumMomentProps>({
    position:0,
    value:0
  });
  const [normalShear, setNormalShear] = useState(0);
  const [maximumNormalShear, setMaximumNormalShear] = useState(0);
  /******/

  /*Salva as forças em um vetor*/
  function handleSaveForcesInVectorForce() {
    setForces((prevstate) => [
      ...prevstate,
      {
        type: "force",
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
        type: "moment",
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
    const Integral = require("sm-integral");

    /* funcao da carga distribuida */
    function expressionDistributedWeight(x) {
      return coefficientA * x * x + coefficientB * x + coefficientC;
    }

    /* funcao do X barra */
    function expressionDistanceXBar(x) {
      return x * (coefficientA * x * x + coefficientB * x + coefficientC);
    }

    /*Módulo da força de toda carga distribuida */
    const weightModule = Integral.integrate(
      expressionDistributedWeight,
      0,
      weightEndPoint - weightStartPoint
    );

    /*Posição do modulo da força resultante */
    const xBar =
      Integral.integrate(
        expressionDistanceXBar,
        0,
        weightEndPoint - weightStartPoint
      ) /
        weightModule +
      weightStartPoint;

    setWeights((prevstate) => [
      ...prevstate,
      {
        type: "weight",
        id: Math.random(),
        coefficientA: coefficientA,
        coefficientB: coefficientB,
        coefficientC: coefficientC,
        distance: weightStartPoint,
        length: weightEndPoint - weightStartPoint,
        forceModule: -weightModule,
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
  function emptyWeightData() {
    if (weightEndPoint == 0) {
      return true;
    } else if (coefficientA == 0 && coefficientB == 0 && coefficientC == 0) {
      return true;
    } else {
      return false;
    }
  }

  /*Calcula reações */
  function handleCalculateSupportReactions() {
    var sumForcesByDistances = 0;
    var sumForces = 0;

    forces.map((force) => {
      sumForcesByDistances += force.value * force.distance;
      sumForces += force.value;
    });

    var sumMoments = 0;
    moments.map((moment) => {
      sumMoments += moment.value;
    });

    var sumForcesModuleByXBar = 0;
    var sumForcesModule = 0;

    weights.map((weight) => {
      sumForcesModuleByXBar += weight.forceModule * weight.forceModulePosition;
      sumForcesModule += weight.forceModule;
    });

    if (supportType == "support1") {
      var By =
        -(sumForcesByDistances + sumMoments + sumForcesModuleByXBar) /
        beamLength;
      var Ay = -(By + sumForces + sumForcesModule);

      var M1 = 0;
    } else if (supportType == "support2") {
      var By = 0;
      var Ay = -(sumForces + sumForcesModule);

      var M1 = sumMoments + sumForcesByDistances + sumForcesModuleByXBar;
    }

    setSupportA({ reactionForce: Ay, reactionMoment: M1 });
    setSupportB({ reactionForce: By, reactionMoment: 0 });
  }

  /* Ordena vetor de forças por posição*/
  function handleOrderForcesByPosition() {
    const aux = forces.sort(function (a, b): any {
      if (a.distance < b.distance) {
        return -1;
      } else {
        return true;
      }
    });

    setForces(aux);
  }

  /*Carrega os dados do gráfico de forças de cisalhamento */
  function loadSheaForceGraphData() {
    var forcesAndWeights = [...forces, ...weights];

    var forcesAndWeights = forcesAndWeights.sort(function (a, b): any {
      if (a.distance < b.distance) {
        return -1;
      } else {
        return true;
      }
    });

    const allForces = [
      {
        type: "force",
        id: Math.random(),
        value: supportA.reactionForce,
        distance: 0,
        coefficientA: 0,
        coefficientB: 0,
        coefficientC: 0,
        length: 0,
      },
      ...forcesAndWeights,
      {
        type: "force",
        id: Math.random(),
        value: supportB.reactionForce,
        distance: beamLength,
        coefficientA: 0,
        coefficientB: 0,
        coefficientC: 0,
        length: 0,
      },
    ];

    var data = [];

    const newData = produce(data, (draft) => {
      var yAnterior = supportA.reactionForce;

      for (let i = 0; i < allForces.length; i++) {
        if (i == 0) {
          draft.push(["xAxis", "yAxis"]);
          draft.push([0, allForces[i].value]);
        } else {
          if (allForces[i].type == "weight") {
            /* Se a próxima força não estiver no mesmo lugar do inico da carga */
            if (allForces[i].distance != allForces[i + 1].distance) {
              /*Função da carga distribuida */

              let expressionDistributedWeight = function (x): number {
                return -(
                  allForces[i].coefficientA * x * x +
                  allForces[i].coefficientB * x +
                  allForces[i].coefficientC
                );
              };

              /*Plota vários pontos da carga distribuida */

              for (let j = 0; j <= allForces[i].length; j += 0.001) {
                draft.push([
                  allForces[i].distance + j,
                  yAnterior +
                    Integral.integrate(expressionDistributedWeight, 0, j),
                ]);
              }

              yAnterior += Integral.integrate(
                expressionDistributedWeight,
                0,
                allForces[i].length
              );
            } else {
              draft.push([allForces[i + 1].distance, yAnterior]);

              draft.push([
                allForces[i + 1].distance,
                yAnterior + allForces[i + 1].value,
              ]);

              yAnterior += allForces[i + 1].value;

              /*Função da carga distribuida */
              let expressionDistributedWeight = function (x): number {
                return (
                  allForces[i].coefficientA * x * x +
                  allForces[i].coefficientB * x +
                  allForces[i].coefficientC
                );
              };

              /*Plota vários pontos da carga distribuida */
              for (let j = 0; j <= allForces[i].length; j += 0.01) {
                draft.push([
                  allForces[i].distance + j,
                  yAnterior +
                    Integral.integrate(expressionDistributedWeight, 0, j),
                ]);
              }

              yAnterior += Integral.integrate(
                expressionDistributedWeight,
                0,
                allForces[i].length
              );

              i++;
            }
          } else {
            draft.push([allForces[i].distance, yAnterior]);

            draft.push([allForces[i].distance, yAnterior + allForces[i].value]);
            yAnterior += allForces[i].value;
          }
        }
      }
    });

    setChartData(newData);
  }

  function loadMomentChartData() {
    var forcesAndMoments = [...forces, ...moments, ...weights];

    /* Ordena vetor de forças e momentos  */
    var forcesAndMoments = forcesAndMoments.sort(function (a, b): any {
      if (a.distance < b.distance) {
        return -1;
      } else {
        return true;
      }
    });

    var array = [
      {
        type: "force",
        id: Math.random(),
        value: supportA.reactionForce,
        distance: 0,
      },
      ...forcesAndMoments,
      {
        type: "force",
        id: Math.random(),
        value: supportB.reactionForce,
        distance: beamLength,
      },
    ];

    if (supportType == "support2") {
      var array = [
        {
          type: "force",
          id: Math.random(),
          value: supportA.reactionForce,
          distance: 0,
        },
        ...forcesAndMoments,
      ];
    }

    var data = [];

    var maximumMomentValue = supportA.reactionMoment;
    var maximumMomentPosition = 0;

    var momentAuxValue = 0;
    var momentAuxPosition = xSectionChosen;

    const newData = produce(data, (draft) => {
      var forcasAnteriores = supportA.reactionForce;
      var yAnterior = 0;

      if (supportType == "support2") {
        var yAnterior = supportA.reactionMoment;
      }

      for (let i = 0; i < array.length; i++) {
        if (array[i].distance == momentAuxPosition) {
          momentAuxValue = array[i].value;
        }

        if (i == 0) {
          draft.push(["xAxis", "yAxis"]);
          draft.push([0, yAnterior]);
        } else {
          if (array[i].type == "moment") {
            draft.push([
              array[i].distance,
              yAnterior +
                forcasAnteriores * (array[i].distance - array[i - 1].distance),
            ]);

            draft.push([
              array[i].distance,
              yAnterior +
                forcasAnteriores * (array[i].distance - array[i - 1].distance) +
                array[i].value,
            ]);

            yAnterior -=
              array[i].value -
              forcasAnteriores * (array[i].distance - array[i - 1].distance);
          } else if (array[i].type == "force") {
            if (array[i - 1].type == "weight") {
              draft.push([array[i].distance, yAnterior - array[i].value]);
              forcasAnteriores = yAnterior - array[i].value;
            } else {
              draft.push([
                array[i].distance,
                yAnterior +
                  forcasAnteriores *
                    (array[i].distance - array[i - 1].distance),
              ]);

              yAnterior +=
                forcasAnteriores * (array[i].distance - array[i - 1].distance);

              forcasAnteriores += array[i].value;
            }
          } else if (array[i].type == "weight") {
            draft.push([
              array[i].distance,
              yAnterior +
                forcasAnteriores * (array[i].distance - array[i - 1].distance),
            ]);

            yAnterior +=
              forcasAnteriores * (array[i].distance - array[i - 1].distance);

            let expressionShearForce = function (x): number {
              return (
                (1 / 3) * array[i].coefficientA * x * x * x +
                (1 / 2) * array[i].coefficientB * x * x +
                array[i].coefficientC * x
              );
            };

            /*Plota vários pontos da carga distribuida */
            for (let j = 0; j < array[i].length; j += 0.1) {
              var aux =
                forcasAnteriores * j -
                Integral.integrate(expressionShearForce, 0, j);

              draft.push([array[i].distance + j, yAnterior + aux]);

              if (yAnterior + aux > maximumMomentValue) {

                maximumMomentPosition = Number(
                  parseFloat(String(array[i].distance + j )).toFixed(2)
                );

                maximumMomentValue = Number(
                  parseFloat(String(yAnterior + aux)).toFixed(2)
                );
              }

              let positionAux = Number(
                parseFloat(String(array[i].distance + j)).toFixed(2)
              );

              if (positionAux == momentAuxPosition) {
                  momentAuxValue = Number(parseFloat(String(yAnterior + aux)).toFixed(2)
              );
                
              }
            }

            yAnterior +=
              -Integral.integrate(expressionShearForce, 0, array[i].length) +
              forcasAnteriores * array[i].length;
          }
        }

        if (yAnterior > maximumMomentValue) {
          maximumMomentPosition = array[i].distance;
          maximumMomentValue = yAnterior;
        }
      }
    });

    setMaximumMomment({
      value: maximumMomentValue,
      position: maximumMomentPosition,
    });

    setMomentChosen({value: momentAuxValue, position:momentAuxPosition});

    setChartData2(newData);
  }

  useEffect(() => {
    handleCalculateSupportReactions();
    handleOrderForcesByPosition();
    loadSheaForceGraphData();
    loadMomentChartData();
  }, [updateUseEffect1]);

  useEffect(() => {
    loadMomentChartData();
    loadNormalShear();
  }, [updateUseEffect2]);

  /*Etapa 2*/

  function loadNormalShear() {
    var momentInertia;
    var maximumNormalShearAux;
    var normalShearAux;

    if (beamProfile == "retangular") {
      momentInertia = (rectangularBeam.a * Math.pow(rectangularBeam.b, 3)) / 12;

      maximumNormalShearAux =
        (maximumMoment.value * (rectangularBeam.b / 2)) / momentInertia;

      normalShearAux = (momentChosen.value * distanceNeutralAxis) / momentInertia;
    } else if (beamProfile == "circular") {

      momentInertia = (3.14 * Math.pow(circularBeam.r, 4)) / 4;

      maximumNormalShearAux = (maximumMoment.value * circularBeam.r) / momentInertia;

      normalShearAux = (momentChosen.value * distanceNeutralAxis) / momentInertia;


    } else if (beamProfile == "triangular") {
      momentInertia = (triangularBeam.b * Math.pow(triangularBeam.h, 3))/36;
    }

    normalShearAux = Number(parseFloat(String(normalShearAux)).toFixed(2));

    maximumNormalShearAux = Number(parseFloat(String(maximumNormalShearAux)).toFixed(2));

    setNormalShear(normalShearAux);
    setMaximumNormalShear(maximumNormalShearAux);
  }

  return (
    <Flex direction="column" justify="center" px={20}>
      <Heading mt={8}> Trabalho de Mecânica dos Sólidos</Heading>
      <Divider mt={2} mb={1} />
      <Heading as="h2" fontSize={20} background="gray.800">
        Etapa I
      </Heading>
      <Divider mt={1} />

      <Stack mt={8} spacing={10}>
        <RadioGroup
          name="typeSupport"
          label="Tipo de apoio"
          defaultValue="support1"
          onChange={(support) => setSupportType(support)}
        >
          <Radio value="support1">Apoio simples - Apoio simples</Radio>
          <Radio value="support2">Engaste - livre</Radio>
        </RadioGroup>
        <Box w={800}>
          <InputNumber
            name="beamLeagth"
            label="Comprimento da viga"
            onChange={(value) => setBeamLength(Number(value))}
          />
        </Box>

        <Flex direction="row" justify="flex-start" gap={6}>
          <Box>
            <Stack spacing={10}>
              <InputNumber
                name="strengthValue"
                label="Valor da força ( + pra cima )"
                onChange={(value) => setForceValue(Number(value))}
              />
              <InputNumber
                name="strengthDistance"
                min={0}
                max={beamLength}
                label="Local de aplicação da força ( m )"
                onChange={(value) => setForceDistance(Number(value))}
              />
              <Button
                colorScheme="blue"
                onClick={() => handleSaveForcesInVectorForce()}
                isDisabled={forceValue == 0}
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
                label="Momento ( + anti-horário )"
                onChange={(value) => setMomentValue(Number(value))}
              />
              <InputNumber
                focusBorderColor="purple.500"
                name="distanceMoment"
                max={beamLength}
                label="Localização de aplicação do momento ( + anti-horário )"
                onChange={(value) => setMomentDistance(Number(value))}
              />
              <Button
                colorScheme="purple"
                onClick={() => handleSaveMomentsInVectorMoment()}
                isDisabled={momentValue == 0}
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

          <Box>
            <Heading as="h2" size="sm" mb={3}>
              Equação que descreve a carga ( + pra baixo)
            </Heading>
            <Stack spacing={10}>
              <HStack spacing={6}>
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeAValue"
                  pHolder="A(x^2)"
                  onChange={(a) => setCoefficientA(Number(a))}
                />
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeBValue"
                  pHolder="B(x)"
                  onChange={(b) => setCoefficientB(Number(b))}
                />
                <InputNumber
                  focusBorderColor="pink.500"
                  w={32}
                  name="chargeCValue"
                  pHolder="C"
                  onChange={(c) => setCoefficientC(Number(c))}
                />
              </HStack>
              <HStack>
                <InputNumber
                  focusBorderColor="pink.500"
                  min={0}
                  max={beamLength}
                  label="Início da carga ( m )"
                  name="chargeCValue"
                  onChange={(value) => setWeightStartPoint(Number(value))}
                />
                <InputNumber
                  focusBorderColor="pink.500"
                  label="Final da carga ( m )"
                  min={weightStartPoint}
                  max={beamLength}
                  name="chargeCValue"
                  onChange={(value) => setWeightEndPoint(Number(value))}
                />
              </HStack>
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
                    start={weight.distance}
                    end={weight.distance + weight.length}
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
        colorScheme="cyan"
        mt={8}
        onClick={() => setUpdateUseEffect1(!updateUseEffect1)}
      >
        CALCULAR
      </Button>
      <HStack spacing={12} mt={12}>
        <Text fontSize="2xl">
          Reação de apoio em A: Ay:
          {parseFloat(String(supportA.reactionForce)).toFixed(2)}N MA:{" "}
          {parseFloat(String(supportA.reactionMoment)).toFixed(2)}
        </Text>
        <Text fontSize="2xl">
          Reação de apoio em B: By:{" "}
          {parseFloat(String(supportB.reactionForce)).toFixed(2)}N
        </Text>
      </HStack>

      <Divider />
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData}
        options={shearForceOptions}
      />

      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData2}
        options={momentOptions}
      />
      <Divider mt={2} mb={2} />
      <Heading as="h2" fontSize={20} background="gray.800">
        Etapa II
      </Heading>
      <Divider mt={2} />
      <RadioGroup
        name="tipoviga"
        label="Perfil da Viga"
        defaultValue="retangular"
        onChange={(profile) => setBeamProfile(profile)}
      >
        <Radio value="retangular">Retangular</Radio>
        <Radio value="circular">Circular</Radio>
        <Radio value="triangular">Triangular</Radio>
      </RadioGroup>

      {beamProfile == "retangular" && (
        <Box mt={6}>
          <HStack spacing={8} w={200}>
            <InputNumber
              name="base"
              label="Base da viga (a)"
              w={36}
              onChange={(base) =>
                setRectangularBeam({ a: Number(base), b: rectangularBeam.b })
              }
            />
            <InputNumber
              name="altura"
              label="Altura da viga (b)"
              w={36}
              onChange={(altura) =>
                setRectangularBeam({ a: rectangularBeam.a, b: Number(altura) })
              }
            />
          </HStack>
        </Box>
      )}

      {beamProfile == "circular" && (
        <Box mt={6}>
          <InputNumber
            name="raio"
            label="Raio da viga (r)"
            w={36}
            onChange={(raio) => setCircularBeam({ r: Number(raio) })}
          />
        </Box>
      )}

      {beamProfile == "triangular" && (
        <Box mt={6}>
          <HStack spacing={8} w={400}>
            <InputNumber
              name="base"
              label="Base da viga triangular (b)"
              w={64}
              onChange={(base) =>
                setTriangularBeam({ b: Number(base), h: triangularBeam.h})
              }
            />
            <InputNumber
              name="altura"
              label="Altura da viga triangular (h)"
              w={64}
              onChange={(altura) =>
                setTriangularBeam({ b:  triangularBeam.b, h: Number(altura)})
              }
            />
          </HStack>
        </Box>
      )}


      <Divider mt={4} />

      <Box mt={6} w={1000} mb={6}>
        <Flex gap={5} align="end" justify="center">
          <InputNumber
            min={0}
            max={beamLength}
            name="momentDistance"
            label="Posição (x) da viga:"
            onChange={(x) => setXSectionChosen(Number(x))}
          />

          {beamProfile == "retangular" && (
            <InputNumber
              min={-rectangularBeam.b / 2}
              max={rectangularBeam.b / 2}
              name="yDistance"
              label="Distância (y) do eixo neutro:"
              onChange={(y) => setDistanceNeutralAxis(Number(y))}
            />
          )}

          {beamProfile == "circular" && (
            <InputNumber
            min={-circularBeam.r}
            max={circularBeam.r}
            name="yDistance"
            label="Distância (y) do eixo neutro:"
            onChange={(y) => setDistanceNeutralAxis(Number(y))}
          />
          )}

          <Button
            colorScheme="cyan"
            onClick={() => setUpdateUseEffect2(!updateUseEffect2)}
            pl={20}
            pr={20}
          >
            Calcular tensão normal
          </Button>
        </Flex>
      </Box>

      <Box pb={28}>
        <Divider mt={2} mb={2} />
        <Heading as="h2" fontSize={32} bgColor="gray.800">
          Resultados:
        </Heading>
        <Divider mt={2} mb={4} />
        <HStack spacing={64}>
          <Text fontSize={20}>
            Posição do momento máximo: {maximumMoment.position} [ m ]
          </Text>
          <Text fontSize={20}>
            Momento Máximo: {maximumMoment.value} [ N / m ]
          </Text>
          <Text fontSize={20}>
            Tensão normal máxima: {maximumNormalShear} [ Pa ]
          </Text>
        </HStack>
        <Divider mt={4} mb={4} />
        <HStack spacing={36}>
         <Text fontSize={20}>
            Posição do momento escolhido: {momentChosen.position} [ m ]
          </Text>
          <Text fontSize={20}>
            Momento da posição escolhida: {momentChosen.value} [ N / m ]
          </Text>
          <Text fontSize={20}>
            Tensão normal escolhida: {normalShear} [ Pa ]
          </Text>
        </HStack>
      </Box>
    </Flex>
  );
}
