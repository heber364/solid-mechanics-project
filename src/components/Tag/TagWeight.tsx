import { MouseEventHandler } from "react";

import {
  HStack,
  Tag as TagChakra,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";

interface TagProps{
    a: number;
    b: number;
    c: number;
    start:number;
    end:number;
    module: number;
    xBar: number;
    onRemoveTag: MouseEventHandler;
}

export function TagWeight({ a, b, c, start, end, module, xBar, onRemoveTag }: TagProps) {

  return (
    <HStack spacing={6}>
      <TagChakra variant="outline" colorScheme="pink" size="lg" >
        <TagLabel>Carga: ({`${a}x^2 + ${b}x + ${c}`})N.m</TagLabel>
        <TagLabel ml={2}>Inicio: {start}m</TagLabel>
        <TagLabel ml={2}>Fim: {end}m</TagLabel>
        <TagLabel ml={2}>Modulo: {parseFloat(String(module)).toFixed(2)}N</TagLabel>
        <TagLabel ml={2}>X Barra: {parseFloat(String(xBar)).toFixed(2)}m</TagLabel>
        <TagCloseButton onClick={onRemoveTag} />
      </TagChakra>
    </HStack>
  );
}