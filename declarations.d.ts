declare module 'roughjs/bundled/rough.esm' {
    import { RoughCanvas, RoughGenerator } from 'roughjs/bin/canvas';
  
    const rough: {
      canvas: (canvas: HTMLCanvasElement) => RoughCanvas;
      generator: () => RoughGenerator;
    };
  
    export default rough;
  }

  declare module 'react-resizable';

  declare module 'react-modal-video';