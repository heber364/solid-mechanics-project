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
  rangeSliderValue: number[];
  onRangeSliderValueChange: (rangeSliderValue: number[]) => void;
}

export function RangeSlider({
  name,
  label,
  beamLength, 
  onRangeSliderValueChange,
  rangeSliderValue,
   ...rest
}: RangeSliderProps) {
  const [showTooltip, setShowTooltip] = useState(false);


  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }


  return (
    <FormControl>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <RangeSliderChakra
        aria-label={["min", "max"]}
        min={0}
        max={beamLength}
        defaultValue={[0.20 * beamLength, 0.80 * beamLength]}
        onChange={(val) => onRangeSliderValueChange(val)}
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
          {parseFloat(String(0.20*beamLength)).toFixed(2)}m
        </RangeSliderMark>
        <RangeSliderMark value={0.50*beamLength} {...labelStyles}>
          {parseFloat(String(0.50*beamLength)).toFixed(2)}m
        </RangeSliderMark>
        <RangeSliderMark value={0.80*beamLength} {...labelStyles}>
          {parseFloat(String(0.80*beamLength)).toFixed(2)}m
        </RangeSliderMark>

        <Tooltip
          hasArrow
          bg="blue.600"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${rangeSliderValue[0]}m`}
        >
          <RangeSliderThumb index={0} />
        </Tooltip>
        <Tooltip
          hasArrow
          bg="blue.600"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${rangeSliderValue[1]}m`}
        >
          <RangeSliderThumb index={1} />
        </Tooltip>
      </RangeSliderChakra>
    </FormControl>
  );
}
