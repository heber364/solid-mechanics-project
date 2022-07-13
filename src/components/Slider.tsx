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
}

export function Slider({ name, label, beamLength, ...rest }: SliderProps) {
  const [sliderValue, setSliderValue] = useState(5);
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
        mt={6}
        id={name}
        defaultValue={0.2*beamLength}
        min={0}
        max={beamLength}
        colorScheme="blue"
        onChange={(v) => setSliderValue(v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderMark value={0.20*beamLength} {...labelStyles}>
            {0.20*beamLength}m
        </SliderMark>
        <SliderMark value={0.50*beamLength} {...labelStyles}>
            {0.5*beamLength}m
        </SliderMark>

        <SliderMark value={0.80*beamLength} {...labelStyles}>
            {0.80*beamLength}m
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
