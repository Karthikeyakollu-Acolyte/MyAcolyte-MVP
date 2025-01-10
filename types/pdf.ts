
export interface Annotation {
  id: string
  type: 'highlight' | 'draw' | 'rectangle' | 'circle' | 'line'
  content: string
  position: {
    x: number
    y: number
    width?: number
    height?: number
  }
  page: number
  color: string
}




export interface ConfigureToolsProps {
  tool: Tool;
  brushSize: number;
  brushColor: string;
  eraserSize: number;
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuPosition: React.Dispatch<React.SetStateAction<MenuPosition>>;
  loopPathRef: React.MutableRefObject<fabric.Path | null>;
  setLoopPoints: any;
  setSelectedTool: React.Dispatch<React.SetStateAction<Tool>>
  saveLayerContent: (content: Object) => void;
}

export interface Rect {
  width: number;
  height: number;
}

export type Note = {
  id: string | number;
  position: { top: number; left: number };
  content: string;
  isVisible: Boolean
};


export interface CanvasInitializerProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  rect: Rect;
}

interface newObject {

  type: string;
  data: string,
  position: object

}

export interface CanvasWrapperProps {
  pageRects: DOMRect[];
  isDrawing: boolean;
  containerNodeRef?:HTMLDivElement;
  type:"infinte"|"pdf"
}
export interface scaleStateProps {
  scale: number;
  positionX: number;
  positionY: number;
  previousScale: number;
}
export interface FabricCanvasProps {
  rect?: { width: number; height: number };
  isDrawing: boolean;
  index: number | string;
  saveLayerContent: (content: []) => void;
  initialContent?: [];
  pageIndex: number | string;
  noteContent?: string;
  scaleState?: scaleStateProps;
  newObject?: newObject

}



export interface MenuPosition {
  top: number;
  right: number;
}

export interface MenuProps {
  menuVisible: boolean;
  menuPosition: MenuPosition;
  loopPoints: any
  setMenuVisible: any
}

export interface ToolContextType {
  selectedTool: Tool
  setSelectedTool: (tool: Tool) => void
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
  brushSize: number
  setBrushSize: (size: number) => void
  eraserSize: number
  setEraserSize: (size: number) => void
  brushColor: string
  setBrushColor: (color: string) => void,

}



export type Tool = "pen" | "highlighter" | "pixelEraser" | "objectEraser" | "rectangleSelection" | "freeformSelection" | "text" | "circle" | "square" | "triangle" | "star" | "diamond" | "shapes" | "arrow" | "texthighlighter" | "line" | "star" | "hexagon" | null

// Custom type extending fabric.Object to include objectId
export interface CustomFabricObject<T extends fabric.Object> extends fabric.Object {
  objectId?: string;  // objectId should be a number, change it to string if needed
}















export interface ChatCardProps {
  imageSrc: string;
  alt: string;
}

export interface IconButtonProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

export interface QuickPromptProps {
  text: string;
}
