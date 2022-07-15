import { useState } from "react";

import {
  FormControl,
  FormLabel,
  Slider as SliderChakra,
  SliderFilledTrack,
  SliderMark,
  SliderProps as SliderPropsChakra,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";

interface SliderProps extends SliderPropsChakra {
  name: string;
  label?: string;
  beamLength: number;
  sliderValue: number;
  onSliderValueChange: (sliderValue: number) => void;
}

export function Slider({ name, label, beamLength, sliderValue, onSliderValueChange, ...rest }: SliderProps) {

  const [showTooltip, setShowTooltip] = useState(false);

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }

  return (
    <FormControl>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <SliderChakra
        id={name}
        defaultValue={0}
        min={0}
        max={beamLength}
        step={0.05}
        colorScheme="blue"
        onChange={(val) => onSliderValueChange(val)}
        
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...rest}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderMark value={0.20*beamLength} {...labelStyles}>
          {parseFloat(String(0.20*beamLength)).toFixed(2)}m
        </SliderMark>
        <SliderMark value={0.50*beamLength} {...labelStyles}>
          {parseFloat(String(0.5*beamLength)).toFixed(2)}m
        </SliderMark>

        <SliderMark value={0.80*beamLength} {...labelStyles}>
          {parseFloat(String(0.80*beamLength)).toFixed(2)}m
        </SliderMark>
        <Tooltip
          hasArrow
          bg="blue.600"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${sliderValue}m`}
        >
          <SliderThumb />
        </Tooltip>
      </SliderChakra>
    </FormControl>
  );
}
