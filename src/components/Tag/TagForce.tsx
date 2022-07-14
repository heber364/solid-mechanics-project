import { MouseEventHandler } from "react";

import {
  HStack,
  Tag as TagChakra,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";

interface TagProps{
  value: number;
  distance: number;
  onRemoveTag: MouseEventHandler;
}

export function TagForce({ value, distance, onRemoveTag }: TagProps) {
  return (
    <HStack spacing={6}>
      <TagChakra variant="outline" colorScheme="blue" size="lg">
        <TagLabel>Força: {value}N</TagLabel>
        <TagLabel ml={2}>Distancia: {distance}m</TagLabel>
        <TagCloseButton onClick={onRemoveTag} />
      </TagChakra>
    </HStack>
  );
}
