import { forwardRef } from "react";

import {
  FormLabel,
  FormControl,
  NumberInputProps,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

interface InputProps extends NumberInputProps {
  name: string;
  label?: string;
  pHolder?: string;
}

const InputNumberBase = ({ name, label, pHolder, ...rest}: InputProps) => {
  return (
    <FormControl>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <NumberInput 
        id={name}
        
        {...rest}
        >
        <NumberInputField placeholder={pHolder}/>
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
};

export const InputNumber = forwardRef(InputNumberBase);
