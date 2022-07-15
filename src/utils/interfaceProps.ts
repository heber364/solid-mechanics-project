export interface ForceProps {
    id: number;
    value: number;
    distance: number;
  }
  
  export interface MomentProps {
    id: number;
    value: number;
    distance: number;
  }
  
  export interface WeightProps {
    id: number;
    coefficientA: number;
    coefficientB: number;
    coefficientC: number;
    start: number;
    end: number;
    forceModule: number;
    forceModulePosition: number;
  }
  
  export interface SupportProps {
    reactionForce: number;
  }