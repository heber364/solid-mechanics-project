import { useState } from "react";

import {
  FormControl,
  FormLabel,
  RangeSlider as RangeSliderChakra,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderProps as RangeSliderPropsChakra,
  RangeSliderThumb,
  RangeSliderTrack,
  Tooltip,
} from "@chakra-ui/react";

interface RangeSliderProps extends RangeSliderPropsChakra {
  name: string;
  label: string;
  beamLength: number;
}

export function RangeSlider({
  name,
  label,
  beamLength,
  ...rest
}: RangeSliderProps) {
  const [startPoint, setStartPoint] = useState(0.25 * beamLength);
  const [endPoint, setEndPoint] = useState(0.75 * beamLength);

  const [showTooltip, setShowTooltip] = useState(false);

  function handleSetPoint(val: Number[]) {
    setStartPoint(Number(val[0]));
    setEndPoint(Number(val[1]));
  }

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }


  return (
    <FormControl>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <RangeSliderChakra
        mt={6}
        aria-label={["min", "max"]}
        min={0}
        max={beamLength}
        defaultValue={[0.20 * beamLength, 0.80 * beamLength]}
        onChange={(val) => handleSetPoint(val)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...rest}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
        <RangeSliderMark value={0.2*beamLength} {...labelStyles}>
          {0.2*beamLength}m
        </RangeSliderMark>
        <RangeSliderMark value={0.50*beamLength} {...labelStyles}>
          {0.50*beamLength}m
        </RangeSliderMark>
        <RangeSliderMark value={0.80*beamLength} {...labelStyles}>
          {0.80*beamLength}m
        </RangeSliderMark>

        <Tooltip
          hasArrow
          bg="blue.600"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${startPoint}m`}
        >
          <RangeSliderThumb index={0} />
        </Tooltip>
        <Tooltip
          hasArrow
          bg="blue.600"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${endPoint}m`}
        >
          <RangeSliderThumb index={1} />
        </Tooltip>
      </RangeSliderChakra>
    </FormControl>
  );
}
