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
  IBeamProps,
  HBeamProps,
  TBeamProps,
  UBeamProps,
} from "../utils/interfaceProps";

import Chart from "react-google-charts";

export default function Home() {
  const [updateUseEffect1, setUpdateUseEffect1] = useState(false);
  const [updateUseEffect2, setUpdateUseEffect2] = useState(false);
  /*Valores temporarios dos inputs*/

  /*Etapa 1*/
  const [beamLength, setBeamLength] = useState(15);

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
    { id: 1, type: "force", distance: 2, value: -10 },
  ]);

  const [moments, setMoments] = useState<ForceMomentProps[]>([]);
  const [weights, setWeights] = useState<WeightProps[]>([
    {
      id: 3,
      type: "weight",
      distance: 5,
      length: 5,
      coefficientA: 0,
      coefficientB: 0,
      coefficientC: 5,
      forceModule: -25,
      forceModulePosition: 7.5,
    },
  ]);

  const [chartData, setChartData] = useState([]);
  const [chartData2, setChartData2] = useState([]);

  /*Etapa 2*/
  const [beamProfile, setBeamProfile] = useState("retangular");

  const [rectangularBeam, setRectangularBeam] = useState<RectangularBeamProps>({
    a: 0,
    b: 0,
  });

  const [circularBeam, setCircularBeam] = useState<CircularBeamProps>({
    r: 0,
  });

  const [triangularBeam, setTriangularBeam] = useState<TriangularBeamProps>({
    b: 0,
    h: 0,
  });

  const [IBeam, setIBeam] = useState<IBeamProps>({
    vertical: {
      h: 0,
      b: 0,
    },
    horizontal: {
      h: 0,
      b: 0,
    },
  });

  const [HBeam, setHBeam] = useState<HBeamProps>({
    horizontal: {
      h: 0,
      b: 0,
    },
    vertical: {
      h: 0,
      b: 0,
    },
  });

  const [TBeam, setTBeam] = useState<TBeamProps>({
    vertical: {
      h: 0,
      b: 0,
    },
    horizontal: {
      h: 0,
      b: 0,
    },
  });

  const [UBeam, setUBeam] = useState<UBeamProps>({
    vertical: {
      h: 0,
      b: 0,
    },
    horizontal: {
      h: 0,
      b: 0,
    },
  });

  const [maximumMoment, setMaximumMomment] = useState<MaximumMomentProps>({
    value: 0,
    position: 0,
  });

  const [momentChosen, setMomentChosen] = useState<MaximumMomentProps>({
    position: 0,
    value: 0,
  });

  const [distanceNeutralAxis, setDistanceNeutralAxis] = useState(0);
  const [xSectionChosen, setXSectionChosen] = useState(0);

  const [normalShear, setNormalShear] = useState(0);
  const [maximumNormalShear, setMaximumNormalShear] = useState(0);
  const [minimumNormalShear, setMinimumNormalShear] = useState(0);
  const [centroid, setCentroid] = useState(0);
  const [momentInertia, setMomentInertia] = useState(0);
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
              if(array[i] == array[array.length - 1]){
                draft.push([array[i].distance, yAnterior - array[i].value * (array[i].distance - (array[i - 1].distance + array[i-1].length))]);
              }else{
                draft.push([array[i].distance, yAnterior - forcasAnteriores ]);

                yAnterior += array[i].value;
  
                forcasAnteriores += array[i].value;
              }

            } else {
              if(array[i] == array[array.length -1]){
                draft.push([
                  array[i].distance,
                  yAnterior -
                    array[i].value *
                      (array[i].distance - array[i - 1].distance),
                ]);
              }else{
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
                  parseFloat(String(array[i].distance + j)).toFixed(2)
                );

                maximumMomentValue = Number(
                  parseFloat(String(yAnterior + aux)).toFixed(2)
                );
              }

              let positionAux = Number(
                parseFloat(String(array[i].distance + j)).toFixed(2)
              );

              if (positionAux == momentAuxPosition) {
                momentAuxValue = Number(
                  parseFloat(String(yAnterior + aux)).toFixed(2)
                );
              }
            }

            yAnterior += -Integral.integrate(expressionShearForce, 0, array[i].length) + forcasAnteriores * array[i].length;
            // forcasAnteriores = (array[i].coefficientC  * array[i].length)  - forcasAnteriores;
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

    setMomentChosen({ value: momentAuxValue, position: momentAuxPosition });

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
    var centroid = 0;
    var momentInertia;
    var maximumNormalShearAux;
    var minimumNormalShearAux;
    var normalShearAux;

    if (beamProfile == "retangular") {
      centroid = rectangularBeam.b / 2;

      momentInertia = (rectangularBeam.a * Math.pow(rectangularBeam.b, 3)) / 12;

      maximumNormalShearAux =
        -(maximumMoment.value * (rectangularBeam.b - centroid)) / momentInertia;
      minimumNormalShearAux = -maximumNormalShearAux;

      normalShearAux =
        -(momentChosen.value * (distanceNeutralAxis - centroid)) /
        momentInertia;
    } else if (beamProfile == "circular") {
      centroid = circularBeam.r;

      momentInertia = (3.14 * Math.pow(circularBeam.r, 4)) / 4;

      maximumNormalShearAux =
        -(maximumMoment.value * circularBeam.r) / momentInertia;
      minimumNormalShearAux = -maximumNormalShearAux;

      normalShearAux =
        -(momentChosen.value * (distanceNeutralAxis - centroid)) /
        momentInertia;
    } else if (beamProfile == "triangular") {
      centroid = (1 / 3) * triangularBeam.h;

      momentInertia = (triangularBeam.b * Math.pow(triangularBeam.h, 3)) / 36;

      maximumNormalShearAux =
        -(maximumMoment.value * (triangularBeam.h - centroid)) / momentInertia;
      minimumNormalShearAux =
        -(maximumMoment.value * ((-1 / 3) * triangularBeam.h)) / momentInertia;

      normalShearAux =
        -(momentChosen.value * (distanceNeutralAxis - centroid)) /
        momentInertia;
    } else if (beamProfile == "I") {
      let alturaTotal = IBeam.vertical.h + 2 * IBeam.horizontal.h;
      centroid = (IBeam.vertical.h + 2 * IBeam.horizontal.h) / 2;

      momentInertia =
        (IBeam.vertical.b * Math.pow(IBeam.vertical.h, 3)) / 12 +
        2 *
          ((IBeam.horizontal.b * Math.pow(IBeam.horizontal.h, 3)) / 12 +
            IBeam.horizontal.h *
              IBeam.horizontal.b *
              Math.pow(IBeam.vertical.h / 2 + IBeam.horizontal.h / 2, 2));

      maximumNormalShearAux =
        -(maximumMoment.value * (alturaTotal - centroid)) / momentInertia;
      minimumNormalShearAux = -maximumNormalShearAux;

      normalShearAux =
        -(momentChosen.value * (distanceNeutralAxis - centroid)) /
        momentInertia;
    } else if (beamProfile == "H") {
      centroid = HBeam.vertical.h / 2;

      momentInertia =
        (HBeam.horizontal.b * Math.pow(IBeam.horizontal.h, 3)) / 12 +
        2 * ((HBeam.vertical.b * Math.pow(HBeam.vertical.h, 3)) / 12);

      maximumNormalShearAux =
        -(maximumMoment.value * (HBeam.vertical.h - centroid)) / momentInertia;
      minimumNormalShearAux = -maximumNormalShearAux;

      normalShearAux =
        -(momentChosen.value * (distanceNeutralAxis - centroid)) /
        momentInertia;
    } else if (beamProfile == "T") {
      let alturaTotal = TBeam.vertical.h + TBeam.horizontal.h;

      centroid =
        ((TBeam.vertical.h / 2) * TBeam.vertical.h * TBeam.vertical.b +
          (TBeam.horizontal.h / 2 + TBeam.vertical.h) *
            TBeam.horizontal.h *
            TBeam.horizontal.b) /
        (TBeam.vertical.h * TBeam.vertical.b +
          TBeam.horizontal.h * TBeam.horizontal.b);

      momentInertia =
        (TBeam.vertical.b * Math.pow(TBeam.vertical.h, 3)) / 12 +
        TBeam.vertical.b *
          TBeam.vertical.h *
          (centroid - Math.pow(TBeam.vertical.h / 2, 2)) +
        ((TBeam.horizontal.b * Math.pow(TBeam.horizontal.h, 3)) / 12 +
          TBeam.horizontal.b *
            TBeam.horizontal.h *
            (TBeam.vertical.h +
              Math.pow(TBeam.horizontal.h / 2 - centroid, 2)));

      maximumNormalShearAux =
        -(maximumMoment.value * (alturaTotal - centroid)) / momentInertia;
      minimumNormalShearAux =
        -(maximumMoment.value * -centroid) / momentInertia;

      normalShearAux =
        -(momentChosen.value * (distanceNeutralAxis - centroid)) /
        momentInertia;
    } else if (beamProfile == "U") {
      let alturaTotal = UBeam.vertical.h;

      let A1 = (UBeam.vertical.h - UBeam.horizontal.h) * UBeam.vertical.b;
      let A3 = (UBeam.vertical.h - UBeam.horizontal.h) * UBeam.vertical.b;
      let A2 = UBeam.vertical.b * UBeam.horizontal.h;

      let Y1 = (UBeam.vertical.h - UBeam.horizontal.h) / 2 + UBeam.horizontal.h;
      let Y3 = (UBeam.vertical.h - UBeam.horizontal.h) / 2 + UBeam.horizontal.h;
      let Y2 = UBeam.horizontal.h / 2;

      centroid = (Y1 * A1 + Y2 * A2 + Y3 * A3) / (A1 + A2 + A3);

      var Ix1 =
        (UBeam.vertical.b *
          (UBeam.vertical.h - Math.pow(UBeam.horizontal.h, 3))) /
        12;
      var Ix3 =
        (UBeam.vertical.b *
          (UBeam.vertical.h - Math.pow(UBeam.horizontal.h, 3))) /
        12;
      var Ix2 = (UBeam.vertical.b * Math.pow(UBeam.horizontal.h, 3)) / 12;

      var dy1 = Y1 - centroid;
      var dy2 = Y2 - centroid;
      var dy3 = Y3 - centroid;

      momentInertia =
        Ix1 +
        A1 * Math.pow(dy1, 2) +
        (Ix2 + A2 * Math.pow(dy2, 2)) +
        (Ix3 + A3 * Math.pow(dy3, 2));

      maximumNormalShearAux =
        -(maximumMoment.value * (alturaTotal - centroid)) / momentInertia;
      minimumNormalShearAux =
        -(maximumMoment.value * -centroid) / momentInertia;
      normalShearAux = -(momentChosen.value * (distanceNeutralAxis - centroid));
    }

    normalShearAux = Number(parseFloat(String(normalShearAux)).toFixed(3));

    maximumNormalShearAux = Number(
      parseFloat(String(maximumNormalShearAux)).toFixed(3)
    );

    minimumNormalShearAux = Number(
      parseFloat(String(minimumNormalShearAux)).toFixed(3)
    );

    centroid = Number(parseFloat(String(centroid)).toFixed(3));

    momentInertia = Number(parseFloat(String(momentInertia)).toFixed(3));

    setNormalShear(normalShearAux);

    setMinimumNormalShear(minimumNormalShearAux);
    setMaximumNormalShear(maximumNormalShearAux);

    setCentroid(centroid);
    setMomentInertia(momentInertia);
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
            value={beamLength}
            onChange={(value) => setBeamLength(Number(value))}
          />
        </Box>

        <Flex direction="row" justify="flex-start" gap={6}>
          <Box>
            <Stack spacing={10}>
              <InputNumber
                value={forceValue}
                name="strengthValue"
                label="Valor da força ( + pra cima )"
                onChange={(value) => setForceValue(Number(value))}
              />
              <InputNumber
                value={forceDistance}
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
                value={momentValue}
                focusBorderColor="purple.500"
                name="momentValue"
                label="Momento ( + anti-horário )"
                onChange={(value) => setMomentValue(Number(value))}
              />
              <InputNumber
                value={momentDistance}
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
                  value={weightStartPoint}
                  focusBorderColor="pink.500"
                  min={0}
                  max={beamLength}
                  label="Início da carga ( m )"
                  name="chargeCValue"
                  onChange={(value) => setWeightStartPoint(Number(value))}
                />
                <InputNumber
                  value={weightEndPoint}
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
        <Radio value="I">I</Radio>
        <Radio value="H">H</Radio>
        <Radio value="T">T</Radio>
        <Radio value="U">
          U (Seção vertical compreende a altura total da figura)
        </Radio>
      </RadioGroup>

      {beamProfile == "retangular" && (
        <Box mt={6}>
          <HStack spacing={8} w={400}>
            <InputNumber
              value={rectangularBeam.a}
              name="base"
              label="Base da retângulo:"
              w={36}
              onChange={(base) =>
                setRectangularBeam({ a: Number(base), b: rectangularBeam.b })
              }
            />
            <InputNumber
              value={rectangularBeam.b}
              name="altura"
              label="Altura do retângulo:"
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
            value={circularBeam.r}
            name="raio"
            label="Raio do círculo:"
            w={36}
            onChange={(raio) => setCircularBeam({ r: Number(raio) })}
          />
        </Box>
      )}

      {beamProfile == "triangular" && (
        <Box mt={6}>
          <HStack spacing={8} w={400}>
            <InputNumber
              value={triangularBeam.b}
              name="base"
              label="Base do triângulo:"
              w={64}
              onChange={(base) =>
                setTriangularBeam({ b: Number(base), h: triangularBeam.h })
              }
            />
            <InputNumber
              value={triangularBeam.h}
              name="altura"
              label="Altura do triângulo:"
              w={64}
              onChange={(altura) =>
                setTriangularBeam({ b: triangularBeam.b, h: Number(altura) })
              }
            />
          </HStack>
        </Box>
      )}

      {beamProfile == "I" && (
        <Box mt={6}>
          <HStack spacing={8} w={400}>
            <InputNumber
              value={IBeam.horizontal.b}
              name="baseHorizontal"
              label="Base da seção horizontal:"
              w={64}
              onChange={(base) =>
                setIBeam({
                  horizontal: { b: Number(base), h: IBeam.horizontal.h },
                  vertical: { b: IBeam.vertical.b, h: IBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={IBeam.horizontal.h}
              name="alturaHorizontal"
              label="Altura da seção horizontal:"
              w={64}
              onChange={(altura) =>
                setIBeam({
                  horizontal: { b: IBeam.horizontal.b, h: Number(altura) },
                  vertical: { b: IBeam.vertical.b, h: IBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={IBeam.vertical.b}
              name="baseVertical"
              label="Base da seção vertical:"
              w={64}
              onChange={(base) =>
                setIBeam({
                  horizontal: { b: IBeam.horizontal.b, h: IBeam.horizontal.h },
                  vertical: { b: Number(base), h: IBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={IBeam.vertical.h}
              name="alturaVertical"
              label="Altura da seção vertical:"
              w={64}
              onChange={(altura) =>
                setIBeam({
                  horizontal: { b: IBeam.horizontal.b, h: IBeam.horizontal.h },
                  vertical: { b: IBeam.vertical.b, h: Number(altura) },
                })
              }
            />
          </HStack>
        </Box>
      )}

      {beamProfile == "H" && (
        <Box mt={6}>
          <HStack spacing={8} w={400}>
            <InputNumber
              value={HBeam.horizontal.b}
              name="baseHorizontal"
              label="Base da seção horizontal:"
              w={64}
              onChange={(base) =>
                setHBeam({
                  horizontal: { b: Number(base), h: HBeam.horizontal.h },
                  vertical: { b: HBeam.vertical.b, h: HBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={HBeam.horizontal.h}
              name="alturaHorizontal"
              label="Altura da seção horizontal:"
              w={64}
              onChange={(altura) =>
                setHBeam({
                  horizontal: { b: HBeam.horizontal.b, h: Number(altura) },
                  vertical: { b: HBeam.vertical.b, h: HBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={HBeam.vertical.b}
              name="baseVertical"
              label="Base da seção vertical:"
              w={64}
              onChange={(base) =>
                setHBeam({
                  horizontal: { b: HBeam.horizontal.b, h: HBeam.horizontal.h },
                  vertical: { b: Number(base), h: HBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={HBeam.vertical.h}
              name="alturaVertical"
              label="Altura da seção vertical:"
              w={64}
              onChange={(altura) =>
                setHBeam({
                  horizontal: { b: HBeam.horizontal.b, h: HBeam.horizontal.h },
                  vertical: { b: HBeam.vertical.b, h: Number(altura) },
                })
              }
            />
          </HStack>
        </Box>
      )}

      {beamProfile == "T" && (
        <Box mt={6}>
          <HStack spacing={8} w={400}>
            <InputNumber
              value={TBeam.horizontal.b}
              name="baseHorizontal"
              label="Base da seção horizontal:"
              w={64}
              onChange={(base) =>
                setTBeam({
                  horizontal: { b: Number(base), h: TBeam.horizontal.h },
                  vertical: { b: TBeam.vertical.b, h: TBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={TBeam.horizontal.h}
              name="alturaHorizontal"
              label="Altura da seção horizontal:"
              w={64}
              onChange={(altura) =>
                setTBeam({
                  horizontal: { b: TBeam.horizontal.b, h: Number(altura) },
                  vertical: { b: TBeam.vertical.b, h: TBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={TBeam.vertical.b}
              name="baseVertical"
              label="Base da seção vertical:"
              w={64}
              onChange={(base) =>
                setTBeam({
                  horizontal: { b: TBeam.horizontal.b, h: TBeam.horizontal.h },
                  vertical: { b: Number(base), h: TBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={TBeam.vertical.h}
              name="alturaVertical"
              label="Altura da seção vertical:"
              w={64}
              onChange={(altura) =>
                setTBeam({
                  horizontal: { b: TBeam.horizontal.b, h: TBeam.horizontal.h },
                  vertical: { b: TBeam.vertical.b, h: Number(altura) },
                })
              }
            />
          </HStack>
        </Box>
      )}

      {beamProfile == "U" && (
        <Box mt={6}>
          <HStack spacing={8} w={400}>
            <InputNumber
              value={UBeam.horizontal.b}
              name="baseHorizontal"
              label="Base da seção horizontal:"
              w={64}
              onChange={(base) =>
                setUBeam({
                  horizontal: { b: Number(base), h: UBeam.horizontal.h },
                  vertical: { b: UBeam.vertical.b, h: UBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={UBeam.horizontal.h}
              name="alturaHorizontal"
              label="Altura da seção horizontal:"
              w={64}
              onChange={(altura) =>
                setUBeam({
                  horizontal: { b: UBeam.horizontal.b, h: Number(altura) },
                  vertical: { b: UBeam.vertical.b, h: UBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={UBeam.vertical.b}
              name="baseVertical"
              label="Base da seção vertical:"
              w={64}
              onChange={(base) =>
                setUBeam({
                  horizontal: { b: UBeam.horizontal.b, h: UBeam.horizontal.h },
                  vertical: { b: Number(base), h: UBeam.vertical.h },
                })
              }
            />
            <InputNumber
              value={UBeam.vertical.h}
              name="alturaVertical"
              label="Altura da seção vertical:"
              w={64}
              onChange={(altura) =>
                setUBeam({
                  horizontal: { b: UBeam.horizontal.b, h: UBeam.horizontal.h },
                  vertical: { b: UBeam.vertical.b, h: Number(altura) },
                })
              }
            />
          </HStack>
        </Box>
      )}

      <Divider mt={4} />

      <Box mt={6} w={1000} mb={6}>
        <Flex gap={5} align="end" justify="center">
          <InputNumber
            value={xSectionChosen}
            min={0}
            max={beamLength}
            name="momentDistance"
            label="Posição (x) da viga:"
            onChange={(x) => setXSectionChosen(Number(x))}
          />

          {beamProfile == "retangular" && (
            <InputNumber
              value={distanceNeutralAxis}
              min={0}
              max={rectangularBeam.b}
              name="yDistance"
              label="Posição (y) da seção transversal:"
              onChange={(y) => setDistanceNeutralAxis(Number(y))}
            />
          )}
          {beamProfile == "circular" && (
            <InputNumber
              value={distanceNeutralAxis}
              min={0}
              max={2 * circularBeam.r}
              name="yDistance"
              label="Posição (y) da seção transversal:"
              onChange={(y) => setDistanceNeutralAxis(Number(y))}
            />
          )}
          {beamProfile == "triangular" && (
            <InputNumber
              value={distanceNeutralAxis}
              min={0}
              max={triangularBeam.h}
              name="yDistance"
              label="Posição (y) da seção transversal:"
              onChange={(y) => setDistanceNeutralAxis(Number(y))}
            />
          )}
          {beamProfile == "I" && (
            <InputNumber
              value={distanceNeutralAxis}
              min={0}
              max={IBeam.vertical.h + 2 * IBeam.horizontal.h}
              name="yDistance"
              label="Posição (y) da seção transversal:"
              onChange={(y) => setDistanceNeutralAxis(Number(y))}
            />
          )}
          {beamProfile == "H" && (
            <InputNumber
              value={distanceNeutralAxis}
              min={0}
              max={HBeam.vertical.h}
              name="yDistance"
              label="Posição (y) da seção transversal:"
              onChange={(y) => setDistanceNeutralAxis(Number(y))}
            />
          )}
          {beamProfile == "T" && (
            <InputNumber
              value={distanceNeutralAxis}
              min={0}
              max={TBeam.vertical.h + TBeam.horizontal.h}
              name="yDistance"
              label="Posição (y) da seção transversal:"
              onChange={(y) => setDistanceNeutralAxis(Number(y))}
            />
          )}
          {beamProfile == "U" && (
            <InputNumber
              value={distanceNeutralAxis}
              min={0}
              max={UBeam.vertical.h}
              name="yDistance"
              label="Posição (y) da seção transversal:"
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
        <Divider mt={2} mb={3} />
        <HStack spacing={10}>
          <Text fontSize={18}>Centróide da figura: {centroid} [ m ]</Text>
          <Text fontSize={18}>Momento de Inércia: {momentInertia} [ m^4 ]</Text>
        </HStack>

        <Divider mt={3} mb={4} />
        <HStack spacing={10}>
          <Heading as="h2" fontSize={24}>
            Máximo:
          </Heading>
          <Text fontSize={16}>Posição(x): {maximumMoment.position} [ m ]</Text>
          <Text fontSize={16}>Momento: {maximumMoment.value} [ N / m ]</Text>
          <Text fontSize={16}>
            Tensão normal ( Compressão ): {maximumNormalShear} [ Pa ]
          </Text>
          <Text fontSize={16}>
            Tensão normal ( Tração): {minimumNormalShear} [ Pa ]
          </Text>
        </HStack>
        <Divider mt={4} mb={4} />
        <HStack spacing={10}>
          <Heading as="h2" fontSize={24}>
            Escolhido:
          </Heading>
          <Text fontSize={16}>Posição (x): {momentChosen.position} [ m ]</Text>
          <Text fontSize={16}>Momento: {momentChosen.value} [ N / m ]</Text>

          <Text fontSize={16}>
            Tensão normal ( + Tração ): {normalShear} [ Pa ]
          </Text>
        </HStack>
      </Box>
    </Flex>
  );
}
