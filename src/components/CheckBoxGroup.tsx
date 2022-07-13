import { forwardRef, ReactNode } from "react";

import {
  FormLabel,
  FormControl,
  RadioGroupProps as RadioGroupPropsChakra,
  HStack,
  RadioGroup as RadioGroupChakra,
} from "@chakra-ui/react";

interface RadioGroupProps extends RadioGroupPropsChakra {
  name: string;
  label?: string;
  defaultValue: string;
  children: ReactNode;
  
  
}

const RadioGroupBase = ({ name, label, children, defaultValue, ...rest}: RadioGroupProps) => {
  return (
    <FormControl as='fieldset' m="0 auto" >
      {!!label && <FormLabel as='legend' htmlFor={name}>{label}</FormLabel>}
          <RadioGroupChakra 
            id={name} 
            defaultValue={defaultValue} 
            {...rest} >
            <HStack spacing={6}>
                {children}
            </HStack>
          </RadioGroupChakra>

    </FormControl>
  );
};

export const RadioGroup = forwardRef(RadioGroupBase);