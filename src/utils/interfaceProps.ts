  
  export interface ForceMomentProps {
    type: string;
    id: number;
    value: number;
    distance: number;

    coefficientA?: number;
    coefficientB?: number;
    coefficientC?: number;
    length?: number;
  }
  
  export interface WeightProps {
    type: string;
    id: number;
    coefficientA: number;
    coefficientB: number;
    coefficientC: number;
    distance: number;
    length: number;
    forceModule: number;
    forceModulePosition: number;

    value?: number;
  }
  
  export interface SupportProps {
    reactionForce: number;
    reactionMoment: number; 
  }

  export interface RectangularBeamProps{
    a: number;
    b:number;
  }
  
  export interface CircularBeamProps{
    r: number; 
  }

  export interface TriangularBeamProps{
    b: number;
    h: number;
  }

  export interface MaximumMomentProps{
    position: number;
    value: number; 
  }

  export interface IBeamProps {
    vertical: {
      b: number;
      h: number;
    }
    horizontal: {
      b: number;
      h: number;
    }
  }

  export interface HBeamProps{
    horizontal: {
      b: number;
      h: number;
    }
    vertical: {
      b: number;
      h: number;
    }
  }

  export interface UBeamProps{
    horizontal: {
      b: number;
      h: number;
    }
    vertical: {
      b: number;
      h: number;
    }
  }

  export interface TBeamProps{
    horizontal: {
      b: number;
      h: number;
    }
    vertical: {
      b: number;
      h: number;
    }
  }



